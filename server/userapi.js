const bcrypt = require("bcrypt");
const userDao = require("./userdao");

async function hashPassword(req, res) {
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) {
                reject(err);
                res.send(err);
            }
            resolve(hash);
        });
    })
    return hashedPassword;
};

module.exports = function (app) {
        app.post("/api/user", (req, res) => {
            userDao.getUserByUsername(req.body.username, function(err, user){
                user = user[0];
                if(err) send(err);
                if(!user){
                    hashPassword(req, res).then(hashedPassword=>{
                        req.body.password = hashedPassword;
                        userDao.createNewUser(req.body, function(err,user){
                            // find a better way to handle this duplicated code
                            if(err) res.send(err);
                            else {res.send(user)}
                        });
                    });
                }
                if(user) res.sendStatus(401);
            });
        });
}