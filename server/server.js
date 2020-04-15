const express = require('express');
const bodyParser = require('body-parser');

const auth = require('./auth');
const userApi = require("./userapi"); 
const errandsApi = require("./errandsapi");
const messagesApi = require("./messagesapi");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

auth(app);
userApi(app);
errandsApi(app);
messagesApi(app);


const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const io = require('socket.io').listen(server);
io.on("connection", socket => {
    console.log("New client connected", socket.id);
    socket.on("disconnect", ()=>console.log("Client disconnected: ", socket.id));
    socket.on("error", ()=>console.log("Recieved error from client: ", socket.id));
    socket.on("join",(email)=> socket.join(email));
    socket.on("sendOffer", ({message, errand}) => {
        socket.broadcast.to(`${errand.poster}`).emit("sendOfferMessage", {message})
    });
    socket.on("message", (message) => {socket.broadcast.to(`${message.receiver}`).emit("message",message); messages.push(message)})
});

let messages = [];
app.get("/api/messagesToMe", (req,res) => {
    res.send(messages);
})