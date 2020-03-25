const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userApi = require("./userapi"); 
userApi(app);

app.listen(port, () => console.log(`Listening on port ${port}`));