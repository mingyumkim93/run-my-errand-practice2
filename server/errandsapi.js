const errandDao = require('./errandsdao');

module.exports = function (app) {
    app.post("/api/errands", (req, res) => {
        errandDao.createNewErrand(req.body, function(err,data){
            if(err) res.send(err);
            else res.send(data);
        });
    });

    app.get("/api/errands", (req,res) => {
        errandDao.getAllErrands(function(err,data){
            if(err) res.send(err);
            else res.send(data);
        });
    });

    app.get("/api/errand/:id", (req,res) => {
        errandDao.getErrandById(req.params.id, function(err, data){
            if(err) res.send(err);
            else res.send(data);
        });
    });
}
