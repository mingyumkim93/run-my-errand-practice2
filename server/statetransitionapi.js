const stateTransitionDao = require("./statetransitiondao");

module.exports = function (app) {

    app.get("/state-transition", (req, res) => {
        stateTransitionDao.getCurrentState(req.query.id, function(err, data){
            if(err) res.send(err);
            else res.send(data);
        });
    });
};

