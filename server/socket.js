const messageDao = require("./messagesDao");
const stateTransitionDao = require("./statetransitiondao");
const { uuid } = require("uuidv4");
const oneMinute = 1000 * 60;
const SYSTEM = "SYSTEM";
const NOTIFICATION = "NOTIFICATION";

function getNotificationForRunner(offer, content) {
    return {
        id: uuid(), createdAt: new Date(), isRead: 0, sender: SYSTEM, receiver: offer.sender, relatedUser: offer.receiver,
        type: NOTIFICATION, content: "offer id: " + offer.id + " " + content + "Runner"
    };
};

function getNotificationForPoster(offer, content) {
    return {
        id: uuid(), createdAt: new Date(), isRead: 0, sender: SYSTEM, receiver: offer.receiver, relatedUser: offer.sender,
        type: NOTIFICATION, content: "offer id: " + offer.id + " " + content + "Poster"
    };
};

function createNotifications(socket, offer, content, isRunner){
    const notificationToRunner = getNotificationForRunner(offer, content);
    const notificationToPoster = getNotificationForPoster(offer, content);
    messageDao.createNewMessage(notificationToRunner, function(err, data){
        if(err) console.log(err);
        else{
            //1:when runner sent offer 2:when runner canceled offer 3:when runner confirmed offer
            if(isRunner){
                socket.emit("message", notificationToRunner);
                socket.emit("offer-state-changed");
            }
            //when poster accepted offer
            else{
                socket.broadcast.to(offer.sender).emit("message", notificationToRunner);
                socket.broadcast.to(offer.sender).emit("offer-state-changed");
            }
        }
    });
    messageDao.createNewMessage(notificationToPoster, function(err, data){
        if(err) console.log(err);
        else{
            if(isRunner){
                socket.broadcast.to(offer.receiver).emit("message", notificationToPoster);
                socket.broadcast.to(offer.receiver).emit("offer-state-changed", notificationToPoster);
            }
            else{
                socket.emit("message",notificationToPoster);
                socket.emit("offer-state-changed");
            }
        }
    });
};

function setStateCheckTimeout(socket,offer){
    setTimeout(()=>{
        stateTransitionDao.getCurrentState(offer.id, function(err, data){
            if(err) console.log(err);
            else{
                //if data===[]  >> no transition at all >> still initial state
                if(!data[0])createCanceledStateTransition(socket, offer, true);
                //if there has been some state transition since the offer was created
                else{
                    //WHY THE HELL THIS SHOULD BE ISRUNNER TRUE???!
                    if(data[0].new_state === "accepted")createCanceledStateTransition(socket, offer, true);
                }
            }
        });
    }, 10 * 1000);
};

function createCanceledStateTransition(socket, offer, isRunner){
    const transition = {object_id:offer.id, new_state:"canceled", timestamp:new Date()}
    stateTransitionDao.createNewTransition(transition, function(err, data){
        if(err) console.log(err);
        else createNotifications(socket, offer, "is canceled due to timeout", isRunner);
    });
};

module.exports = function (server) {
    const io = require("socket.io").listen(server);
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
                    //only chat and offer will be emited like this because there is no notification coming from client
                    socket.emit("message", message);
                    socket.broadcast.to(message.receiver).emit("message", message);
                    if (message.type === "OFFER") {
                        createNotifications(socket, message, "is sent", true);
                        setStateCheckTimeout(socket, message);
                    }
                };
            });
        });
        socket.on("offer-state-transition", (payload) => {
            //todo : validaion, create new errand state transition when offer is confirmed
            const object_id = payload.object_id;
            const new_state = payload.new_state;
            const transition = { object_id, new_state, timestamp: new Date() };
            stateTransitionDao.createNewTransition(transition, function (err, data) {
                if (err) console.log(err);
                else {
                    messageDao.getMessageById(object_id, function (err, data) {
                        const offer = data[0];
                        if (err) console.log(err);
                        else {
                            if (new_state === "canceled") createNotifications(socket, offer, "is canceled", true);
                            else if (new_state === "accepted") {
                                createNotifications(socket, offer, "is accepted", false);
                                setStateCheckTimeout(socket, offer);
                            }
                            else createNotifications(socket, offer, "is confirmed", true);
                        };
                    });
                };
            });
        });
    });
}; 
