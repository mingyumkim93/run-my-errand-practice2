const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userDao = require('./userdao');
const bcrypt = require('bcrypt');

module.exports = function(app){
    app.use(expressSession({
        //TODO: change secret later and hide it.
        secret:'change later',
        resave:true,
        saveUninitialized:true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        console.log("serialize user ", user);
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        console.log("deserialize user id: ", id);
        userDao.getUserById(id, function (error, data) {
            const user = data[0];
            if (error) console.log("Error happened on querying an user")
            console.log("data[0] in deserializeUser " + user)
            done(null, user)
        });
    });

    passport.use(new LocalStrategy(function(username, password, done){
        userDao.getUserByUsername(username, function(err, data){
            const user = data[0];
            if(err) return done(err);
            if(!user) return done(null, false);
            if(!bcrypt.compareSync(password, user.password)) return done(null, false);
            return done(null, user); //login success
        });
    }))

    app.post('/login', passport.authenticate('local',{failureRedirect:'/login_fail'}),function(_,res){
        //if authentication was successful, this function will get called.
        console.log("login success");
        res.sendStatus(200);
    });

    app.get('/login_fail',function(_,res){
        res.status(401);
        res.send("login failed!")
    });
}