const mysqlConn = require("./mysqlhelper");
const errandDao = {

    getAllErrands(){
        return mysqlConn.query("select * from errands");
    },

    createNewErrand(errand){
        return mysqlConn.query("insert into errands set ?", errand);
    },

    getErrandById(id){
        return mysqlConn.query("select * from errands where id = ?", id);
    },

    updateToRunningState(errand, runner, fee){
        return mysqlConn.query("update errands set runner = ?, fee = ? where id = ? ", [runner, fee, errand]);
    },

    getMyErrands(id){
        return mysqlConn.query("select * from errands where runner = ? or poster = ?", [id, id]);
    }
}

module.exports = errandDao;