const mysql = require("mysql");
const util = require("util");
require("dotenv").config();

const mysqlConn = mysql.createConnection({
    protocol: "mysql",
    host: "localhost",
    port: 3306,
    user: "dbuser",
    password: process.env.DB_PASSWORD,
    database: "crm"
});

mysqlConn.query = util.promisify(mysqlConn.query);

module.exports = mysqlConn;