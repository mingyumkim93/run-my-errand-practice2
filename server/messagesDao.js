const mysqlConn = require("./mysqlhelper");

const messagesDao = {
    createNewMessage(message,cb){
        mysqlConn.query("insert into messages set ?", message, (error, data) => {
            cb(error, data);
        });
    },

    getRelatedMessages(id,cb){
        mysqlConn.query("select * from messages where sender=? or receiver=? order by createdAt", [id,id], (error, data) => {
            cb(error, data);
        });
    }
}

module.exports = messagesDao;