const mysqlConn = require("./mysqlhelper");

const messagesDao = {
    createNewMessage(message) {
        return mysqlConn.query("insert into messages set ?", message);
    },

    getAllMessages(id) {
        return mysqlConn.query("select * from messages where sender_id = ? or receiver_id = ? order by timestamp", [id, id]);
    },

    getMessagesWithUser(othersId, myId) {
        return mysqlConn.query("select * from messages where (sender_id = ? and receiver_id = ?) or (sender_id = ? and receiver_id = ?)", [othersId, myId, myId, othersId]);
    },

    markMessagesAsRead(myId, othersId) {
        return mysqlConn.query("update messages set is_read = 1 where (sender_id = ? and receiver_id = ?) or (receiver_id = ? and related_user_id = ?)", [othersId, myId, myId, othersId]);
    },

    getMessageById(id) {
        return mysqlConn.query("select * from messages where id = ?", id);
    },

    getMessagesByType(type) {
        return mysqlConn.query("select * from messages where type = ?", type);
    }
};

module.exports = messagesDao;