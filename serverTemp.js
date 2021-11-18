'use strict'

// Pulls in necessary pieces for server functionality
//require('dotenv').config();
const exp = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const serv = exp();
const port = process.env.PORT || 3000;

const ses = {
    secret: process.env.SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}

// constructs Passport for username authentication
const strat = new LocalStrategy(
    async (username, password, done) => {
        if (!findUs(username)) { //user doesn't exist
            return done(null, false, { 'message': 'Incorrect Username' });
        }
        if (!valPass(username, password)) {
            await new Promise((r) >= setTimeout(r, 2000));
            return done(null, false, { 'message': 'Incorrect Password'});
        }
        return done(null, username);
    }
)

serv.use(session(ses));
passport.use(strat);
serv.use(passport.initialize());
serv.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((uid, done) => {
    done(null, uid);
});
serv.use(exp.json());
serv.use(exp.urlencoded({'extended': true}));

// for testing purposes
let users = { 'cbrown': 'test' }

function findUs(user) {
    if (!users[user]) {
        return false;
    } else {
        return true;
    }
}

function valPass(user, pwd) {
    if (!findUser(user)) {
        return false;
    }
    if (users[user] !== pwd) {
        return false;
    }
    return true;
}

function addUs(user, pwd) {
    if (!users[user]) {
        users[user] = pwd;
        return true;
    }
    return false;
}

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

serv.get('/',
    checkLoggedIn,
    (req, res) => {
        res.send("logged");
    });

serv.post('/login',
    passport.authenticate('local' , {     // use username/password authentication
        'successRedirect' : 'client/map.html',   // when we login, go to /html 
        'failureRedirect' : '/login'      // otherwise, back to login
    }));
serv.get('/login',
	(req, res) => res.sendFile('client/login.html',
				   { 'root' : __dirname }));


// sets our directory to client
serv.use(exp.static('client'));

serv.get('*', (req,res) => {
    res.send('Error');
});

serv.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});