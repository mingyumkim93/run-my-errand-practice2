const { messageHandler, offerStateChangeHandler, initialCheckForTimeoutOffer } = require("./socket-handlers");

module.exports = function (server) {
    const io = require("socket.io").listen(server);
    initialCheckForTimeoutOffer(io);
    io.on("connection", socket => {
        console.log("New client connected", socket.id);
        socket.on("disconnect", () => console.log("Client disconnected: ", socket.id));
        socket.on("error", () => console.log("Recieved error from client: ", socket.id));
        socket.on("join", (id) => socket.join(id));
        socket.on("message", (message) => messageHandler(io, socket, message));
        socket.on("offer-state-transition", (payload) => offerStateChangeHandler(io, socket, payload));
    });
}; 
