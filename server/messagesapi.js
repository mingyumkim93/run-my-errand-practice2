const messagesDao = require("./messagesDao");

module.exports = function (app) {
    app.post("/api/messages",(req,res)=>{
        req.body.createdAt = new Date();
        //this is UTC time. but in MYSQL workbench shows it as local time. once I fech it from DB, it's again UTC time.
        messagesDao.createNewMessage(req.body, function(err, data){
            if(err) res.send(err);
            else res.send(data);
        });
    });

    app.put("/api/messages",(req,res)=>{
        messagesDao.getRelatedMessages(req.body.id, function(err,data){
            console.log("req.body.id", req.body.id);
            if(err) res.send(err);
            else res.send(data);
        })
    });
}

