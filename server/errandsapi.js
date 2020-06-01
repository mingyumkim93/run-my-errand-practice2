const errandDao = require("./errandsdao");
const stateTransitionDao = require("./statetransitiondao");
const { uuid } = require("uuidv4");

module.exports = function (app) {
    app.post("/errand/post", (req, res) => {
        req.body.timestamp = new Date();
        req.body.id = uuid();
        errandDao.createNewErrand(req.body).then(data => res.send(data)).catch(err => res.send(err));
    });

    app.get("/errand/fetch-all", (req,res) => {
        errandDao.getAllErrands().then(data => res.send(data)).catch(err => res.send(err));
    });

    app.get("/errand/:id", (req,res) => {
        errandDao.getErrandById(req.params.id).then(data => res.send(data)).catch(err => res.send(err));
    });

    app.get("/fetch-my-errands", async (req,res) => {
        let myErrands = null;
        try{
            myErrands = await errandDao.getMyErrands(req.query.id);
            for(let index=0; index<myErrands.length; index++){
                const state = await stateTransitionDao.getCurrentState(myErrands[index].id);
                myErrands[index] = {...myErrands[index], state: state[0]? state[0].new_state : "initial"};
            }
        }catch(err){res.send(err)}
        res.send(myErrands);
    });
};
