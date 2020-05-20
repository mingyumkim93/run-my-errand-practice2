const stateTransitionDao = require("./statetransitiondao");

module.exports = function (app) {
    app.post("/state-transition/create",(req,res) => {
        const transition = {...req.body, timestamp:new Date()};
        stateTransitionDao.createNewTransition(transition, function(err,data){
            if(err) res.send(err);
            else res.send(data);
        });
    });

    app.get("/state-transition", (req, res) => {
        stateTransitionDao.getCurrentState(req.query.id, function(err, data){
            if(err) res.send(err);
            else res.send(data);
        });
    });
};

