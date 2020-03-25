const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userApi = require("./userapi"); 
const mysqlConn = require("./mysqlhelper");
userApi(app,mysqlConn,bcrypt);

app.listen(port, () => console.log(`Listening on port ${port}`));