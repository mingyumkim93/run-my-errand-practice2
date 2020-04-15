const mysqlConn = require("./mysqlhelper");

const messagesDao = {
    createNewMessage(message,cb){
        mysqlConn.query("insert into messages set ?", message, (error, data) => {
            cb(error, data);
        });
    },
}

module.exports = messagesDao;