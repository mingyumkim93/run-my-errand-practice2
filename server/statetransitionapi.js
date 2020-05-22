const stateTransitionDao = require("./statetransitiondao");

module.exports = function (app) {
    app.post("/state-transition/create",(req,res) => {

        let currentState = "initial";
        stateTransitionDao.getCurrentState(req.body.object_id, function(err,data){
            if(err) console.log(err);
            if(data.length !== 0) currentState = data[0].new_state;
            const transition = {...req.body, timestamp:new Date()};
            if(currentState === "canceled")
                res.sendStatus(403);

            else if(currentState === "initial"){
                if(req.body.new_state === "confirmed" || currentState === req.body.new_state)
                    res.sendStatus(403);
                else{
                    stateTransitionDao.createNewTransition(transition, function(err,data){
                        if(err) res.status(404).send(err);
                        else res.sendStatus(200);
                    });
                }
            }

            else if(currentState === "accepted"){
                if(req.body.new_state === "initial" || currentState === req.body.new_state)
                    res.sendStatus(403);
                else{
                    stateTransitionDao.createNewTransition(transition, function(err,data){
                        if(err) res.status(404).send(err);
                        else res.sendStatus(200);
                    });
                }
            }

            else if(currentState === "confirmed"){
                if(req.body.new_state !== "canceled")
                    res.sendStatus(403);
                else{
                    stateTransitionDao.createNewTransition(transition, function(err,data){
                        if(err) res.status(404).send(err);
                        else res.sendStatus(200);
                    });
                }
            }

            else{
                res.sendStatus(403);
            }

            //possible state transitions
            //initial >> canceled, accepted
            //canceled >> "NOTHING"
            //accepted >> canceled, confirmed
            //confirmed >> cancdeled
        });

        
        
    });

    app.get("/state-transition", (req, res) => {
        stateTransitionDao.getCurrentState(req.query.id, function(err, data){
            if(err) res.send(err);
            else res.send(data);
        });
    });
};

