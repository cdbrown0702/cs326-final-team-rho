'use strict'

const fs = require('fs');
let database;
if (fs.existsSync("client/scripts/events.json")) {
    database = JSON.parse(fs.readFileSync("client/scripts/events.json"));
} else {
    database = [];
}
let users;
if (fs.existsSync("client/scripts/users.json")) {
    users = JSON.parse(fs.readFileSync("client/scripts/users.json"));
} else {
    users = [];
}

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
};

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
);

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

// Authentication Functions
function findUs(user) {
    for (let i = 0; i < users.length; i++) {
        if (users[i]['user'] === user) {
            return i;
        }
    }
    return 0;
};
function valPass(user, pwd) {
    let i = findUs(user);
    if (i === 0) {
        return false;
    }
    if (users[i]['pwd'] !== pwd) {
        return false;
    }
    return true;
};
function addUs(user, pwd) {
    if (findUs(user) === 0) {
        users.push({'uid' : users.length + 1, 'user' : user, 'pwd': pwd});
        fs.writeFile("client/scripts/users.json", JSON.stringify(users), err => {
            if (err) {
                console.err(err);
            }
        });
        return true;
    }
    return false;
};
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}
// Authentication Endpoints
serv.get('/',
    checkLoggedIn,
    (req, res) => {
        res.send("logged");
    });
serv.post('/login',
    passport.authenticate('local' , {     // use username/password authentication
        'successRedirect' : '/map.html',   // when we login, go to /html 
        'failureRedirect' : '/login'      // otherwise, back to login
    }));
serv.get('/login',
	(req, res) => res.sendFile('client/login.html',
				   { 'root' : __dirname }));
serv.post('/register',
(req, res) => {
    const username = req.body['username'];
    const password = req.body['password'];
    // TODO
    // Check if we successfully added the user.
    let result = addUs(username, password);
    // If so, redirect to '/login'
    if (result) { res.redirect('/login'); }
    // If not, redirect to '/register'.
    if (!result) { res.redirect('/register'); }
});
serv.get('/register',
(req, res) => res.sendFile('client/register.html',
                { 'root' : __dirname }));

serv.post('/createReport',
(req, res) => {
    let newID;
    if (database.length === 0) {
        newID = 1;
    } else {
        newID = database.length + 1;
    }
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        database.push({
            'rid': newID,
            'name': data.name,
            'category': data.category,
            'date': data.date,
            'desc': data.desc,
            'coords': data.coords

        });
        fs.writeFile("client/scripts/events.json", JSON.stringify(database), err => {
            if (err) {
                console.err(err);
            }
        });
    });
});

// sets our directory to client
serv.use(exp.static('client'));

serv.get('*', (req,res) => {
    res.send('Error');
});

serv.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});