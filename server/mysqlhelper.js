const mysql = require("mysql");

const mysqlConn = mysql.createConnection({
    protocol: "mysql",
    host: "localhost",
    port: 3306,
    user: "dbuser",
    password: "Daylight12!",
    database: "crm"
});

module.exports = mysqlConn;