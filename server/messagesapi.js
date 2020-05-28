const messagesDao = require("./messagesDao");

module.exports = function (app) {
    app.get("/message/fetch-all",(req,res) => {
        messagesDao.getAllMessages(req.query.id).then(data => res.send(data)).catch(err => res.send(err));
    });

    app.post("/message/create",(req,res) => {
        req.body.createdAt = new Date();
        req.body.isRead = 0;
        messagesDao.createNewMessage(req.body).then(data => res.send(data)).catch(err => res.send(err));
    });

    app.get("/message/read",(req,res) => {
        messagesDao.markMessagesAsRead(req.query.user, req.query.other).then(data => res.send("succeed")).catch(err => res.send(err));
    });
};

