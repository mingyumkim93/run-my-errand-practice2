const mysqlConn = require("./mysqlhelper");

const stateTransitionDao = {
    createNewTransition(transition){
        return mysqlConn.query("insert into state_transitions set ?", transition);
    },

    getCurrentState(objectId){
        return mysqlConn.query("select * from state_transitions where object_id = ? ORDER BY id DESC LIMIT 1", objectId);
    }
};

module.exports = stateTransitionDao;