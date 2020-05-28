const mysqlConn = require("./mysqlhelper");

const userDao = {
    createNewUser(user){
        return mysqlConn.query("insert into user set ?", user);
    },
    getUserById(id){
        return mysqlConn.query("select * from user where id = ?", id);
    },
    getUserByEmail(email){
        return mysqlConn.query("select * from user where email = ?", email);
    }
}

module.exports = userDao;