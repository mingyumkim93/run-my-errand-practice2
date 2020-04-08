const mysqlConn = require("./mysqlhelper");

const errandDao = {
    createNewErrand(errand,cb){
        mysqlConn.query("insert into errands set ?", errand, (error,data) =>{
            cb(error, data);
        });
    },
}

module.exports = errandDao;