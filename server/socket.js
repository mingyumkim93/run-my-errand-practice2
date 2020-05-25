const messageDao = require("./messagesDao");
const stateTransitionDao = require("./statetransitiondao");
const { uuid } = require("uuidv4");
const tenSeconds = 1000 * 10;

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
                                                        socket.emit("offer-state-changed");
                                                    }
                                                });
                                                messageDao.createNewMessage(timeoutNotificationToPoster, function (err, data){
                                                    if(err) console.log("There was error creating new timout notification")
                                                    else {
                                                        socket.broadcast.to(message.receiver).emit("message", timeoutNotificationToPoster);
                                                        socket.broadcast.to(message.receiver).emit("offer-state-changed");
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
        socket.on("offer-state-transition", (payload) => {
            //todo : validaion, create new errand state transition when offer is confirmed && this event happen when server is initialized
            const object_id = payload.object_id;
            const new_state = payload.new_state;
            const transition = {object_id, new_state, timestamp: new Date()};
            stateTransitionDao.createNewTransition(transition, function(err, data){
                if(err) console.log("there was error on creating new state transition of offer");
                else{
                messageDao.getMessageById(object_id, function(err, data){
                    const offer = data[0];
                    if(err) console.log("ther was error on fetching offer by id");
                    else{
                        if(new_state === "canceled"){
                            //because it is runner who is cancelling this offer
                            socket.emit("offer-state-changed");
                            socket.broadcast.to(offer.receiver).emit("offer-state-changed");

                            const cancelNotificationToRunner = {
                                id:uuid(), createdAt:new Date(), isRead:0, sender:"SYSTEM", receiver:offer.sender, relatedUser:offer.receiver, 
                                type:"NOTIFICATION", content:`offer id ${offer.id} is canceled`
                            };
                            const cancelNotificationToPoster = {
                                id:uuid(), createdAt:new Date(), isRead:0, sender:"SYSTEM", receiver:offer.receiver, relatedUser:offer.sender, 
                                type:"NOTIFICATION", content:`offer id ${offer.id} is canceled`
                            };
                            messageDao.createNewMessage(cancelNotificationToRunner, function (err, data){
                                if(err) console.log("There was error creating cancel notification for runner")
                                else socket.emit("message", cancelNotificationToRunner);
                                
                            });
                            messageDao.createNewMessage(cancelNotificationToPoster, function (err, data){
                                if(err) console.log("There was error creating cancel notification for poster")
                                else socket.broadcast.to(offer.receiver).emit("message", cancelNotificationToPoster);
                                
                            });
                        }
                        else if(new_state === "accepted"){
                            //because it is poster who is accepting this offer
                            socket.emit("offer-state-changed");
                            socket.broadcast.to(offer.sender).emit("offer-state-changed");

                            const acceptNotificationToRunner = {
                                id:uuid(), createdAt:new Date(), isRead:0, sender:"SYSTEM", receiver:offer.sender, relatedUser:offer.receiver, 
                                type:"NOTIFICATION", content:`offer id ${offer.id} is accepted`
                            };
                            const acceptNotificationToPoster = {
                                id:uuid(), createdAt:new Date(), isRead:0, sender:"SYSTEM", receiver:offer.receiver, relatedUser:offer.sender, 
                                type:"NOTIFICATION", content:`offer id ${offer.id} is accepted`
                            };
                            messageDao.createNewMessage(acceptNotificationToRunner, function (err, data){
                                if(err) console.log("There was error creating cancel notification for runner")
                                else socket.broadcast.to(offer.sender).emit("message", acceptNotificationToRunner);
                                
                            });
                            messageDao.createNewMessage(acceptNotificationToPoster, function (err, data){
                                if(err) console.log("There was error creating cancel notification for poster")
                                else socket.emit("message", acceptNotificationToPoster);
                                
                            });

                            setTimeout(()=>{
                                stateTransitionDao.getCurrentState(object_id, function(err, data){
                                    if(err) console.log("there was error on fetching current state of offer");
                                    //because there was already new transition, I don't care empty data here
                                    else{
                                        //if it's still "accepted" state
                                        if(data[0].new_state === new_state){
                                            const transition = {object_id, new_state:"canceled", timestamp: new Date()};
                                            stateTransitionDao.createNewTransition(transition, function(err, data){
                                                if(err) console.log("there was error on creating new state transition of offer");
                                                else {
                                                    const timeoutNotificationToRunner = {
                                                        id:uuid(), createdAt:new Date(), isRead:0, sender:"SYSTEM", receiver:offer.sender, relatedUser:offer.receiver, 
                                                        type:"NOTIFICATION", content:`offer id ${offer.id} is canceled due to timeout`
                                                    };
                                                    const timeoutNotificationToPoster = {
                                                        id:uuid(), createdAt:new Date(), isRead:0, sender:"SYSTEM", receiver:offer.receiver, relatedUser:offer.sender, 
                                                        type:"NOTIFICATION", content:`offer id ${offer.id} is canceled due to timeout`
                                                    };
                                                    messageDao.createNewMessage(timeoutNotificationToPoster, function (err, data){
                                                        if(err) console.log("There was error creating new timout notification for poster")
                                                        else {
                                                            socket.emit("message", timeoutNotificationToPoster);
                                                            socket.emit("offer-state-changed");
                                                        }
                                                    });
                                                    messageDao.createNewMessage(timeoutNotificationToRunner, function (err, data){
                                                        if(err) console.log("There was error creating new timout notification for runner")
                                                        else {
                                                            socket.broadcast.to(offer.sender).emit("message", timeoutNotificationToRunner);
                                                            socket.broadcast.to(offer.sender).emit("offer-state-changed");
                                                        }
                                                    });
                                                }
                                            })
                                        }
                                    }
                                });
                            }, tenSeconds)

                        }
                        //new_state === confirmed
                        else{
                            //because it's runenr who is confirming this offer
                            socket.emit("offer-state-changed");
                            socket.broadcast.to(offer.receiver).emit("offer-state-changed");

                            const confirmNotificationToRunner = {
                                id:uuid(), createdAt:new Date(), isRead:0, sender:"SYSTEM", receiver:offer.sender, relatedUser:offer.receiver, 
                                type:"NOTIFICATION", content:`offer id ${offer.id} is confirmed`
                            };
                            const confirmNotificationToPoster = {
                                id:uuid(), createdAt:new Date(), isRead:0, sender:"SYSTEM", receiver:offer.receiver, relatedUser:offer.sender, 
                                type:"NOTIFICATION", content:`offer id ${offer.id} is confirmed`
                            };
                            messageDao.createNewMessage(confirmNotificationToRunner, function (err, data){
                                if(err) console.log("There was error creating confirm notificaion to runner")
                                else socket.emit("message", confirmNotificationToRunner);
                                
                            });
                            messageDao.createNewMessage(confirmNotificationToPoster, function (err, data){
                                if(err) console.log("There was error creating confirm notificaion to poster")
                                else socket.broadcast.to(offer.receiver).emit("message", confirmNotificationToPoster);
                                
                            });
                        }
                    }
                });
                }
            });
        });
    });
}; 
