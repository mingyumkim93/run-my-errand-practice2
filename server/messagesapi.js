const messagesDao = require("./messagesDao");

module.exports = function (app) {
    app.get("/message/fetch-all",(req,res)=>{
        messagesDao.getRelatedMessages(req.query.id, function(err,data){
            if(err) res.send(err);
            else res.send(data);
        })
    });

    app.post("/message/create",(req,res)=>{
        req.body.createdAt = new Date();
        req.body.isRead = 0;
        messagesDao.createNewMessage(req.body, function(err,data){
            if(err) res.send(err);
            else res.send(data);
        })
    });
}

