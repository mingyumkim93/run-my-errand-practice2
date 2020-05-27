const messageDao = require("./messagesDao");
const stateTransitionDao = require("./statetransitiondao");
const { uuid } = require("uuidv4");
const oneMinute = 1000 * 60;
const SYSTEM = "SYSTEM";
const NOTIFICATION = "NOTIFICATION";

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

function setStateCheckTimeout(io, offer) {
    setTimeout(() => {
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
    }, oneMinute);
};

function createCanceledStateTransition(io, offer) {
    const transition = { object_id: offer.id, new_state: "canceled", timestamp: new Date() }
    stateTransitionDao.createNewTransition(transition, function (err, data) {
        if (err) console.log(err);
        else createNotifications(io, offer, "is canceled due to timeout");
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
                                setStateCheckTimeout(io, offer);
                            }
                            else createNotifications(io, offer, "is confirmed");
                        };
                    });
                };
            });
        });
    });
}; 
