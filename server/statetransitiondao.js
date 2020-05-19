const mysqlConn = require("./mysqlhelper");

const stateTransitionDao = {
    createNewTransition(transition,cb){
        mysqlConn.query("insert into state_transitions set ?", transition, (error, data) => {
            console.log(error);
            console.log(data);
            cb(error, data);
        });
    }
};

module.exports = stateTransitionDao;