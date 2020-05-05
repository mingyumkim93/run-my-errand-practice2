const bcrypt = require("bcrypt");
const userDao = require("./userdao");
const { uuid } = require("uuidv4");

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
        app.post("/auth/signup", (req, res) => {
            userDao.getUserByEmail(req.body.email, function(err, data){
                if(err) res.send(err);
                if(data[0]) res.send(404);
                else{ //there is no same existing email in db
                    hashPassword(req, res).then(hashedPassword=>{
                        req.body.password = hashedPassword;
                        req.body.createdAt = new Date();
                        req.body.id = uuid();
                        userDao.createNewUser(req.body, function(err,user){
                            // find a better way to handle this duplicated code
                            if(err) res.send(err);
                            else {res.send(user)}
                        });
                    });
                }
            });
        });

        app.get("/auth/getFullNameById", (req, res) => {
            userDao.getUserById(req.query.id, function(err, data){
                if(err) res.send(err);
                else {res.send(data)}
            });
        });
};