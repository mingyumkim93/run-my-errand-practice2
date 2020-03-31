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
    getUserByEmail(email,cb){
        mysqlConn.query("select * from user where email = ?", email, (error,data) =>{
            cb(error, data);
        });
    }
}

module.exports = userDao;