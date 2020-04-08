const mysqlConn = require("./mysqlhelper");

const errandDao = {

    getAllErrands(cb){
        mysqlConn.query("select * from errands", (error,data) =>{
            cb(error, data);
        });
    },

    createNewErrand(errand,cb){
        mysqlConn.query("insert into errands set ?", errand, (error,data) =>{
            cb(error, data);
        });
    },
}

module.exports = errandDao;