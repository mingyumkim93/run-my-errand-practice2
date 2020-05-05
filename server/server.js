const express = require("express");
const bodyParser = require("body-parser");

const auth = require("./auth");
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
const io = require("socket.io").listen(server);
io.on("connection", socket => {
    console.log("New client connected", socket.id);
    socket.on("disconnect", ()=>console.log("Client disconnected: ", socket.id));
    socket.on("error", ()=>console.log("Recieved error from client: ", socket.id));
    socket.on("join",(id)=> socket.join(id));
});

// test 
let messages = [];
app.get("/api/messagesToMe", (req,res) => {
    res.send(messages);
})