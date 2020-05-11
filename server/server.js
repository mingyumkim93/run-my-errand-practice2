const express = require("express");
const bodyParser = require("body-parser");

const auth = require("./auth");
const userApi = require("./userapi"); 
const errandsApi = require("./errandsapi");
const messagesApi = require("./messagesapi");
const socket = require("./socket");

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

auth(app);
userApi(app);
errandsApi(app);
messagesApi(app);
socket(server);



