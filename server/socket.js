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
                    //only chat and offer will be treated like this because there is no notification from client
                    socket.emit("message", message);
                    socket.broadcast.to(message.receiver).emit("message", message);
                    if (message.type === "OFFER") {
                        createNotifications(socket, message, "is sent", true);
                        setTimeout(() => {
                            stateTransitionDao.getCurrentState(message.id, function (err, data) {
                                if (err) console.log("There was error fetching current state of offer");
                                if (data.length === 0) {
                                    const transition = { object_id: message.id, new_state: "canceled", timestamp: new Date() };
                                    stateTransitionDao.createNewTransition(transition, function (err, data) {
                                        if (err) console.log("There was error creating new state of offer");
                                        else {
                                            createNotifications(socket, message, "is canceled due to timeout", true);
                                        };
                                    });
                                };
                            });
                        }, oneMinute);
                    }
                };
            });
        });
        socket.on("offer-state-transition", (payload) => {
            //todo : validaion, create new errand state transition when offer is confirmed && this event happen when server is initialized
            const object_id = payload.object_id;
            const new_state = payload.new_state;
            const transition = { object_id, new_state, timestamp: new Date() };
            stateTransitionDao.createNewTransition(transition, function (err, data) {
                if (err) console.log("there was error on creating new state transition of offer");
                else {
                    messageDao.getMessageById(object_id, function (err, data) {
                        const offer = data[0];
                        if (err) console.log("ther was error on fetching offer by id");
                        else {
                            if (new_state === "canceled") {
                                //because it is runner who is cancelling this offer
                                createNotifications(socket, offer, "is canceled", true);
                            }
                            else if (new_state === "accepted") {
                                //because it is poster who is accepting this offer
                                createNotifications(socket, offer, "is accepted", false);
                        
                                setTimeout(() => {
                                    stateTransitionDao.getCurrentState(object_id, function (err, data) {
                                        if (err) console.log("there was error on fetching current state of offer");
                                        //because there was already new transition, I don't care empty data here
                                        else {
                                            //if it's still "accepted" state
                                            if (data[0].new_state === new_state) {
                                                const transition = { object_id, new_state: "canceled", timestamp: new Date() };
                                                stateTransitionDao.createNewTransition(transition, function (err, data) {
                                                    if (err) console.log("there was error on creating new state transition of offer");
                                                    else {
                                                        createNotifications(socket, offer, "is canceled due to timeout", false);
                                                    };
                                                });
                                            };
                                        };
                                    });
                                }, oneMinute)
                            }
                            //new_state === confirmed
                            else {
                                //because it's runenr who is confirming this offer
                                createNotifications(socket, offer, "is confirmed", true);
                            };
                        };
                    });
                };
            });
        });
    });
}; 
