const messageDao = require("./messagesDao");
const stateTransitionDao = require("./statetransitiondao");
const { uuid } = require("uuidv4");
const tenSeconds = 1000 * 10;
const SYSTEM = "SYSTEM";
const NOTIFICATION = "NOTIFICATION";
let timersForOffer = {};

function getNotificationForRunner(offer, content) {
    return {
        id: uuid(), createdAt: new Date(), isRead: 0, sender: SYSTEM, receiver: offer.sender, relatedUser: offer.receiver,
        type: NOTIFICATION, content: "offer id: " + offer.id + " " + content
    };
};

function getNotificationForPoster(offer, content) {
    return {
        id: uuid(), createdAt: new Date(), isRead: 0, sender: SYSTEM, receiver: offer.receiver, relatedUser: offer.sender,
        type: NOTIFICATION, content: "offer id: " + offer.id + " " + content
    };
};

function createNotifications(io, offer, content) {
    const notificationToRunner = getNotificationForRunner(offer, content);
    const notificationToPoster = getNotificationForPoster(offer, content);
    messageDao.createNewMessage(notificationToRunner, function (err, data) {
        if (err) console.log(err);
        else {
            io.in(notificationToRunner.receiver).emit("message", notificationToRunner);
            io.in(notificationToRunner.receiver).emit("offer-state-changed");
        }
    });
    messageDao.createNewMessage(notificationToPoster, function (err, data) {
        if (err) console.log(err);
        else {
            io.in(notificationToPoster.receiver).emit("message", notificationToPoster);
            io.in(notificationToPoster.receiver).emit("offer-state-changed");
        }
    });
};

function setStateCheckTimeout(io, offer, lastTransitionTimestamp = undefined) {
    clearTimeout(timersForOffer[offer.id]);
    delete timersForOffer[offer.id];
    timersForOffer = {...timersForOffer, [offer.id] : setTimeout(() => {
        console.log("time out!!!");
        stateTransitionDao.getCurrentState(offer.id, function (err, data) {
            if (err) console.log(err);
            else {
                //if data===[]  >> no transition at all >> still initial state
                if (!data[0]) createCanceledStateTransition(io, offer);
                //if there has been some state transition since the offer was created
                else {
                    if (data[0].new_state === "accepted") createCanceledStateTransition(io, offer);
                } 
            }
        });
    }, lastTransitionTimestamp? lastTransitionTimestamp - new Date() + tenSeconds : offer.createdAt - new Date() + tenSeconds)};
};

function createCanceledStateTransition(io, offer) {
    const transition = { object_id: offer.id, new_state: "canceled", timestamp: new Date() }
    stateTransitionDao.createNewTransition(transition, function (err, data) {
        if (err) console.log(err);
        else createNotifications(io, offer, "is canceled due to timeout");
    });
};

function initialCheckForTimeoutOffer(io){
    messageDao.getMessagesByType("OFFER", function(err,data){
        if(err) console.log(err);
        else{
            data.forEach(offer => {
                stateTransitionDao.getCurrentState(offer.id, function(err,data){
                    if(err) console.log(err);
                    else{
                        //if initial state
                        if(data.length === 0){
                            //if timeout
                            if(new Date() - offer.createdAt > tenSeconds){
                                createCanceledStateTransition(io, offer);
                            }
                            //not timeout yet
                            else{
                                setStateCheckTimeout(io, offer);
                            }
                        }
                        //not initial state (canceled, accepted, confirmed)
                        else{
                            if(data[0].new_state === "accepted"){
                                //if timeout
                                if(new Date() - data[0].timestamp > tenSeconds){
                                    createCanceledStateTransition(io, offer);
                                }
                                else{
                                    setStateCheckTimeout(io, offer, data[0].timestamp);
                                }
                            }
                        }
                    }
                });
            });
        }
    });
};

module.exports = function (server) {
    const io = require("socket.io").listen(server);
    initialCheckForTimeoutOffer(io);
    io.on("connection", socket => {
        console.log("New client connected", socket.id);
        socket.on("disconnect", () => console.log("Client disconnected: ", socket.id));
        socket.on("error", () => console.log("Recieved error from client: ", socket.id));
        socket.on("join", (id) => socket.join(id));
        socket.on("message", (message) => {
            message = { ...message, createdAt: new Date(), isRead: 0, id: uuid() };
            messageDao.createNewMessage(message, function (err, data) {
                if (err) socket.emit("message-error");
                else {
                    //only chat and offer will be emited like this because there is no notification coming from client side
                    io.in(message.receiver).emit("message", message);
                    io.in(message.sender).emit("message", message);
                    if (message.type === "OFFER") {
                        createNotifications(io, message, "is sent");
                        setStateCheckTimeout(io, message);
                    }
                };
            });
        });
        socket.on("offer-state-transition", (payload) => {
            //todo : validaion, create new errand state transition when offer is confirmed
            const object_id = payload.object_id;
            const new_state = payload.new_state;
            // get current state
            // if canceled >> no transition allowed
            // if accepted >> only cancel or confirm
            // if confirmed >> no transition allowed
            // if initial >> cancel or accepted allowed
            const transition = { object_id, new_state, timestamp: new Date() };
            stateTransitionDao.createNewTransition(transition, function (err, data) {
                if (err) console.log(err);
                else {
                    messageDao.getMessageById(object_id, function (err, data) {
                        const offer = data[0];
                        if (err) console.log(err);
                        else {
                            if (new_state === "canceled") createNotifications(io, offer, "is canceled");
                            else if (new_state === "accepted") {
                                createNotifications(io, offer, "is accepted");
                                setStateCheckTimeout(io, offer, new Date());
                            }
                            else createNotifications(io, offer, "is confirmed");
                        };
                    });
                };
            });
        });
    });
}; 
