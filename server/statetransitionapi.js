const stateTransitionDao = require("./statetransitiondao");

module.exports = function (app) {

    app.get("/state-transition", (req, res) => {
        stateTransitionDao.getCurrentState(req.query.id).then(data => res.send(data)).catch(err => res.send(err));
    });
};

