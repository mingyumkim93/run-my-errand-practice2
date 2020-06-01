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
            userDao.getUserByEmail(req.body.email).then(data => {
                if(data[0]) res.send(404);
                else{
                    hashPassword(req, res).then(hashedPassword=>{
                        req.body.password = hashedPassword;
                        req.body.timestamp = new Date();
                        req.body.id = uuid();
                        userDao.createNewUser(req.body, function(err,user){
                            // find a better way to handle this duplicated code
                            if(err) res.send(err);
                            else {res.send(user)}
                        });
                    });
                }
            }).catch(err => res.send(err));
        });

        app.get("/auth/getFullNameById", (req, res) => {
            userDao.getUserById(req.query.id).then(data => res.send(data)).catch(err => console.log(err));
        });
};