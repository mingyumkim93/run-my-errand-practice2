const errandDao = require("./errandsdao");
const { uuid } = require("uuidv4");

module.exports = function (app) {
    app.post("/errand/post", (req, res) => {
        req.body.createdAt = new Date();
        req.body.id = uuid();
        errandDao.createNewErrand(req.body).then(data => res.send(data)).catch(err => res.send(err));
    });

    app.get("/errand/fetch-all", (req,res) => {
        errandDao.getAllErrands().then(data => res.send(data)).catch(err => res.send(err));
    });

    app.get("/errand/:id", (req,res) => {
        errandDao.getErrandById(req.params.id).then(data => res.send(data)).catch(err => res.send(err));
    });

    app.get("/fetch-my-errands", (req,res) => {
        errandDao.getMyErrands(req.query.id).then(res => console.log(res)).catch(err => res.send(err));
    });
};
