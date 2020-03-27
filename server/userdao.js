const mysqlConn = require("./mysqlhelper");

const userDao = {
    createNewUser(user,cb){
        mysqlConn.query("insert into user set ?", user, (error,data) =>{
            cb(error, data);
        });
    },
    getUserById(id,cb){
        mysqlConn.query("select * from user where id = ?", id, (error,data) =>{
            cb(error, data);
        });
    },
    getUserByUsername(username,cb){
        mysqlConn.query("select * from user where username = ?", username, (error,data) =>{
            cb(error, data);
        });
    }
}

module.exports = userDao;