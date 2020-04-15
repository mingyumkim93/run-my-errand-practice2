const messagesDao = require("./messagesDao");

module.exports = function (app) {
    app.post("/api/messages",(req,res)=>{
        messagesDao.createNewMessage(req.body, function(err, data){
            console.log(req.body)
            if(err) res.send(err);
            else res.send(data);
        });
    });
}

