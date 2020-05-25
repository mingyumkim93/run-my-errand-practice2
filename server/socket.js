const messageDao = require("./messagesDao");
const stateTransitionDao = require("./statetransitiondao");
const { uuid } = require("uuidv4");

module.exports = function (server) {
    const io = require("socket.io").listen(server);
    io.on("connection", socket => {
        console.log("New client connected", socket.id);
        socket.on("disconnect", () => console.log("Client disconnected: ", socket.id));
        socket.on("error", () => console.log("Recieved error from client: ", socket.id));
        socket.on("join", (id) => socket.join(id));
        socket.on("message", (message) => {
            message = { ...message, createdAt: new Date(), isRead: 0, id: uuid() }
            messageDao.createNewMessage(message, function (err, data) {
                if (err) socket.emit("message-error");
                else {
                    if (message.type === "NOTIFICATION") {
                        socket.broadcast.to(message.receiver).emit("state_changed");
                        socket.emit("state_changed");
                        if (socket.rooms[message.receiver])
                            socket.emit("message", message); // emit to myself
                        else
                            socket.broadcast.to(message.receiver).emit("message", message); //emit to the other one
                    }
                    else{
                        socket.emit("message", message);
                        socket.broadcast.to(message.receiver).emit("message", message);
                        if(message.type === "OFFER"){
                            const tenSeconds = 1000 * 10;
                            setTimeout(()=>{
                                stateTransitionDao.getCurrentState(message.id, function (err, data){
                                    if(err) console.log("There was error fetching current state of offer");
                                    if(data.length === 0){
                                        const transition = {object_id:message.id, new_state:"canceled", timestamp:new Date()}
                                        stateTransitionDao.createNewTransition(transition, function(err, data){
                                            if(err) console.log("There was error creating new state of offer");
                                            else{
                                                const timeoutNotificationToRunner = {
                                                    id:uuid(), createdAt:new Date(), isRead:0, sender:"SYSTEM", receiver:message.sender, relatedUser:message.receiver, 
                                                    type:"NOTIFICATION", content:`offer id ${message.id} is canceled due to timeout`
                                                };
                                                const timeoutNotificationToPoster = {
                                                    id:uuid(), createdAt:new Date(), isRead:0, sender:"SYSTEM", receiver:message.receiver, relatedUser:message.sender, 
                                                    type:"NOTIFICATION", content:`offer id ${message.id} is canceled due to timeout`
                                                };
                                                messageDao.createNewMessage(timeoutNotificationToRunner, function (err, data){
                                                    if(err) console.log("There was error creating new timout notification")
                                                    else {
                                                        socket.emit("message", timeoutNotificationToRunner);
                                                        socket.emit("state_changed");
                                                    }
                                                });
                                                messageDao.createNewMessage(timeoutNotificationToPoster, function (err, data){
                                                    if(err) console.log("There was error creating new timout notification")
                                                    else {
                                                        socket.broadcast.to(message.receiver).emit("message", timeoutNotificationToPoster);
                                                        socket.broadcast.to(message.receiver).emit("state_changed");
                                                    }
                                                });
                                            }
                                        })
                                    }
                                });
                            }, tenSeconds)
                        }
                    }
                };
            });
        });
        socket.on("offer-", (object_id, new_state) => {
            stateTransitionDao.createNewTransition()
        });
    });
}; 