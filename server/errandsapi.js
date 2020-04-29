const errandDao = require("./errandsdao");

module.exports = function (app) {
    app.post("/errand/post", (req, res) => {
        errandDao.createNewErrand(req.body, function(err,data){
            if(err) res.send(err);
            else res.send(data);
        });
    });

    app.get("/errand/fetch-all", (req,res) => {
        errandDao.getAllErrands(function(err,data){
            if(err) res.send(err);
            else res.send(data);
        });
    });

    app.get("/errand/:id", (req,res) => {
        errandDao.getErrandById(req.params.id, function(err, data){
            if(err) res.send(err);
            else res.send(data);
        });
    });
}
