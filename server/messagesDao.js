const mysqlConn = require("./mysqlhelper");

const messagesDao = {
    createNewMessage(message,cb){
        mysqlConn.query("insert into messages set ?", message, (error, data) => {
            cb(error, data);
        });
    },

    getAllMessages(id,cb){
        mysqlConn.query("select * from messages where sender=? or receiver=? order by createdAt", [id,id], (error, data) => {
            cb(error, data);
        });
    },

    getMessagesWithUser(othersId,myId,cb){
        mysqlConn.query("select * from messages where (sender=? and receiver=?) or (sender=? and receiver=?)",[othersId, myId, myId, othersId],(error, data) => {
            cb(error, data);
        });
    },
    
    markMessagesAsRead(myId,othersId,cb){
        mysqlConn.query("update messages set isRead = 1 where sender=? and receiver=?",[othersId, myId], (error, data) => {
            cb(error, data);
        });
    }
};

module.exports = messagesDao;