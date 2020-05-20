const mysqlConn = require("./mysqlhelper");

const stateTransitionDao = {
    createNewTransition(transition,cb){
        mysqlConn.query("insert into state_transitions set ?", transition, (error, data) => {
            cb(error, data);
        });
    },

    getCurrentState(objectId, cb){
        mysqlConn.query("select * from state_transitions where object_id = ? ORDER BY id DESC LIMIT 1", objectId, (error, data) => {
            cb(error, data);
        });
    }
};

module.exports = stateTransitionDao;