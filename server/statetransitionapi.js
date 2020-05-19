const stateTransitionDao = require("./statetransitiondao");

module.exports = function (app) {
    app.post("/state-transition/create",(req,res) => {
        const transition = {...req.body, timestamp:new Date()};
        console.log(transition);
        stateTransitionDao.createNewTransition(transition, function(err,data){
            if(err) res.send(err);
            else res.send(data);
        });
    });

};

