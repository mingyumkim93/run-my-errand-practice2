const express = require('express');
const bodyParser = require('body-parser');

const auth = require('./auth');
const userApi = require("./userapi"); 

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

auth(app);
userApi(app);

// app.get('/test',(req, res) => {console.log(req); res.send({express: "test route"})})

app.listen(port, () => console.log(`Listening on port ${port}`));