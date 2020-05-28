const errandDao = require("./errandsdao");
const { uuid } = require("uuidv4");

module.exports = function (app) {
    app.post("/errand/post", (req, res) => {
        req.body.createdAt = new Date();
        req.body.id = uuid();
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

    app.get("/fetch-mypost", (req,res) => {
        errandDao.getErrandsIPost(req.query.id, function(err, data){
            if(err) res.send(err);
            else res.send(data);
        });
    });

    app.get("/fetch-myrun", (req,res) => {
        errandDao.getErrandsIRun(req.query.id, function(err, data){
            if(err) res.send(err);
            else res.send(data);
        });
    });
};
