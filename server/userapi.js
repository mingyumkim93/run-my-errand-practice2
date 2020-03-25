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
            //check if the username already taken
            //if not,
            hashPassword(req, res).then(hashedPassword=>{
                req.body.password = hashedPassword;
                userDao.createNewUser(req.body, res);
            });
        });
}