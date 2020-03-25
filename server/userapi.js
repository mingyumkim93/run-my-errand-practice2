module.exports = function (app, mysqlConn, bcrypt) {

    app.post("/api/user", (req, res) => {
        //check if the username already taken
        //if not,
        const saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) {
                console.log("Password hashing failed")
                res.send(err);
            }
            else{
                req.body.password = hash;
                mysqlConn.query("insert into user set ?", req.body, function(err){
                    if(err) {
                        console.log("MySQL Error");
                        res.send(err);
                    }
                    else {
                        console.log("New user has been created: ", req.body);
                        res.sendStatus(200);
                    }
                });
            }
        });
        
    });

}