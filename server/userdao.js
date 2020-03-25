const mysqlConn = require("./mysqlhelper");

const userDao = {
    createNewUser(userInfo,res){
        mysqlConn.query("insert into user set ?", userInfo, (err) =>{
            if(err){
                console.log("MySQL Error");
                res.send(err);
            }
            else
                res.sendStatus(200);
        });
    }
}

module.exports = userDao;