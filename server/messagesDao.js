const mysqlConn = require("./mysqlhelper");

const messagesDao = {
    createNewMessage(message){
        return mysqlConn.query("insert into messages set ?", message);
    },

    getAllMessages(id){
        return mysqlConn.query("select * from messages where sender=? or receiver=? order by createdAt", [id,id]);
    },

    getMessagesWithUser(othersId,myId){
        return mysqlConn.query("select * from messages where (sender=? and receiver=?) or (sender=? and receiver=?)",[othersId, myId, myId, othersId]);
    },
    
    markMessagesAsRead(myId,othersId){
        return mysqlConn.query("update messages set isRead = 1 where (sender=? and receiver=?) or (receiver=? and relatedUser=?)",[othersId, myId, myId, othersId]);
    },

    getMessageById(id){
        return mysqlConn.query("select * from messages where id = ?", id);
    },

    getMessagesByType(type){
        return mysqlConn.query("select * from messages where type = ?", type);
    }
};

module.exports = messagesDao;