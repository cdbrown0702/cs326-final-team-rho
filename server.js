'use strict'

// Imports necessary users and events
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
    return -1;
};
function valPass(user, pwd) {
    let i = findUs(user);
    if (i === -1) {
        return false;
    }
    if (users[i]['pwd'] !== pwd) {
        return false;
    }
    return true;
};
function addUs(user, pwd) {
    if (findUs(user) === -1) {
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
serv.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
});
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
// Creates report
serv.post('/createReport',
checkLoggedIn,
(req, res) => {
    let newID, userID;
    let userInd = findUs(req.user);
    if (userInd === -1) { // if not logged in, no submission
        alert("You're not logged in!");
        res.sendFile('client/login.html');
    } else {
        userID = users[userInd]['uid'];
    }
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
            'uid': userID,
            'rid': newID,
            'name': data.name,
            'category': data.category,
            'date': data.date,
            'coords': data.coords,
            'desc': data.desc
        });
        fs.writeFile("client/scripts/events.json", JSON.stringify(database), err => {
            if (err) {
                console.err(err);
            }
        });
    });
});
serv.post('/delete',
checkLoggedIn,
(req, res) => {
    let userInd = findUs(req.user);
    let userID;
    if (userInd === -1) {
        res.redirect('/login'); 
    } else {
        userID = users[userInd]['uid'];
    }
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        // insert code to check if userid = uid in the report they want to delete
        // Give them a baby modal saying are you sure or something
    })
});
serv.post('/update'),
checkLoggedIn,
(req, res) => {
    let userInd = findUs(req.user);
    let userID;
    if (userInd === -1) {
        res.redirect('/login'); 
    } else {
        userID = users[userInd]['uid'];
    }
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        // insert code to check if userid = uid in the report they want to update,
        // redirect to submit with fields auto-filled... HANG ON TO PREVIOUS REPORT ID SO YOU CAN UPDATE 
    })
}

// READ is within map.js and listview.js
// sets our directory to client
serv.use(exp.static('client'));

serv.get('*', (req,res) => {
    res.send('Error');
});

serv.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});