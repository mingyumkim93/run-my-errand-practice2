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

    updateToRunningState(errandId, runnerId, fee){
        return mysqlConn.query("update errands set runner_id = ?, fee = ? where id = ? ", [runnerId, fee, errandId]);
    },

    getMyErrands(id){
        return mysqlConn.query("select * from errands where runner_id = ? or poster_id = ?", [id, id]);
    }
}

module.exports = errandDao;