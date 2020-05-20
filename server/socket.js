const messageDao = require("./messagesDao");
const { uuid } = require("uuidv4");

module.exports = function(server){
    const io = require("socket.io").listen(server);
    io.on("connection", socket => {
        console.log("New client connected", socket.id);
        socket.on("disconnect", ()=>console.log("Client disconnected: ", socket.id));
        socket.on("error", ()=>console.log("Recieved error from client: ", socket.id));
        socket.on("join",(id)=> socket.join(id));
        socket.on("message", (message) => {
            message = {...message, createdAt: new Date(), isRead:0, id:uuid()}
            messageDao.createNewMessage(message, function(err,data){
                console.log(err);
                console.log(data);
                if(err) socket.emit("message-error");
                else {
                    socket.emit("message", message);
                    socket.broadcast.to(message.receiver).emit("message", message);
                };
            });
        });
    });
}; 