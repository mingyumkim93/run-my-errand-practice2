const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2');
const userDao = require('./userdao');
const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = function (app) {
    app.use(session({
        //TODO: change secret later and hide it.
        secret: 'change later',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser(function (user, done) {
        console.log("serialize user ", user);
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        console.log("deserialized user id: ", id);
        userDao.getUserById(id, function (error, data) {
            const user = data[0];
            if (error) console.log("Error happened on querying an user") 
            console.log("data[0] in deserializeUser " + user)
            done(null, user)
        });
    });

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, function (email, password, done) {
        userDao.getUserByEmail(email, function (err, data) {
            const user = data[0];
            if (err) return done(err);
            if (!user) return done(null, false);
            if (!bcrypt.compareSync(password, user.password)) return done(null, false);
            delete user.password;
            return done(null, user); //login success
        });
    }))

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
        console.log("accessToken: ", accessToken);////////////
        var user = {
            email: profile.email,
            firstname: profile.given_name,
            lastname: profile.family_name,
            authMethod: profile.provider
        };

        userDao.getUserByEmail(profile.email, function (error, data) {
            if (data[0]) {delete data[0].password; done(null, data[0]);}
            else userDao.createNewUser(user, function (error, data) {
                user = { ...user, id: data.insertId }
                console.log(user);
                done(null, user);
            });
        })
    }));

    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email'],
    }));

    app.post("/test", (req, res) => {userDao.getUserByEmail(req.body.email,(err,data)=>{console.log(data)}); res.send("????????????????????")});
    app.get("/api/auth", (req, res) => {
        if (req.user) {
            delete req.user.password;
            res.send(req.user);
        }
        else res.send(false);
    });

    app.get('/auth/google/redirect', passport.authenticate('google', {
        successRedirect: "http://localhost:3000",
        failureRedirect: "/auth/login/failed"
    }));

    app.post('/login', passport.authenticate('local', { failureRedirect: '/login/fail' }), function (req, res) {
        //if authentication was successful, this function will get called.
        delete req.user.password;
        res.status(200);
        res.send(req.user);
    });

    app.get('/api/logout', (req,res) => {req.logout(); res.send("Logout!!")})

    app.get('/login/fail', function (_, res) {
        res.sendStatus(401);
    });
}