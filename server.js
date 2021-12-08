'use strict'

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const MongoUsers = client.db("Users").collection("UserList");
const MongoReports = client.db("Reports").collection("Submission");

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
        if (!await findUs(username)) { //user doesn't exist
            return done(null, false, { 'message': 'Incorrect Username' });
        }
        if (!await valPass(username, password)) {
            return done(null, false, { 'message': 'Incorrect Password'});
        }
        return done(null, username);
    }
);

// Passport setup
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
async function findUs(user) {
    try {
        let u = await MongoUsers.find({}).toArray();
        console.log("users we get from mongo (findus): " + JSON.stringify(u));
        if (u.length === 0) {
            console.log("no users found");
            return false;
        }
        for (let i = 0; i < u.length; i++) {
            if (u[i]['user'] === user) {
                console.log("user found: " + user);
                return true;
            }
        }
        console.log("user not found: " + user);
        return false;
    } catch (err) { console.error(err); }
};
async function valPass(user, pwd) {
    try {
        if (!findUs(user)) {
            console.log("passwords: user wasnt found");
            return false;
        } else {
            let u = await MongoUsers.find({}).toArray();
            let ind;
            for (let i = 0; i < u.length; i++) {
                if (u[i]['user'] === user) {
                    ind = i;
                    break;
                }
            }
            if (u[ind]['pwd'] !== pwd) {
                console.log("password bad");
                return false;
            }
            console.log("password good");
            return true;
        }
    } catch (err) { console.error(err); }
};
async function addUs(user, pwd) {
    try {
        let users = await MongoUsers.find({}).toArray();
        if (await findUs(user)) {
            console.log("this user already exists");
            return false;
        } else {
            console.log("adding user");
            let newUser = {'uid': users.length + 1, 'user': user, 'pwd': pwd};
            console.log(newUser);
            await MongoUsers.insertOne(newUser);
            return true;
        }
    } catch (err) { console.error(err); }
};
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}
// Authentication Endpoints
serv.get('/', (req,res) => {
    res.redirect('/login');
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
        console.log("logged out");
        res.redirect('/login');
    });
});
serv.post('/register',
(req, res) => {
    const username = req.body['username'];
    const password = req.body['password'];
    // TODO
    // Check if we successfully added the user.
    (async() => {
        let result = await addUs(username, password);
        // If so, redirect to '/login'
        if (result === true) { res.redirect('/login'); }
        // If not, redirect to '/register'.
        if (result === false) { res.redirect('/register.html'); }
    })();
});
// serv.get('/register',
// (req, res) => res.sendFile('client/register.html',
//                 { 'root' : __dirname }));
// Creates report
serv.post('/createReport',
checkLoggedIn,
(req, res) => {
    let newID, userID;//, users = getUsers(), reports = getReports();

    (async() => {
        try {
            let users = await MongoUsers.find({}).toArray();
            let reports = await MongoReports.find({}).toArray();

            let userInd = findUs(req.user);

            if (userInd === -1) { // if not logged in, no submission
                alert("You're not logged in!");
                res.sendFile('client/login.html');
            } else {
                userID = users[userInd]['uid'];
            }
            if (reports.length === 0) {
                newID = 1;
            } else {
                newID = reports.length + 1;
            }
            let body = '';
            req.on('data', data => body += data);
            req.on('end', () => {
                const data = JSON.parse(body);
                let newReport = {
                    'uid': userID,
                    'rid': newID,
                    'name': data.name,
                    'category': data.category,
                    'date': data.date,
                    'coords': data.coords,
                    'desc': data.desc
                }
                (async() => {
                    await MongoReports.insertOne(newReport); 
                })();
            });
        } catch (err) { console.error(err); }
    })();
});
serv.post('/delete',
checkLoggedIn,
(req, res) => {
    let userInd = findUs(req.user);
    let userID; 
    //let users = getUsers();

    (async() => {
        try {
            let users = await MongoUsers.find({}).toArray();

            if (userInd === -1) {
                res.redirect('/login'); 
            } else {
                userID = users[userInd]['uid'];
            }
            let body = '';
            req.on('data', data => body += data);
            req.on('end', () => {
                const data = JSON.parse(body);
                // data needs to contain user ID to make sure the user isn't deleting someone else's report
                // also needs to contain report ID in order to remove it from the database
                let uid = data['uid'];
                let rid = data['rid'];
                if (uid === userID) {
                    // if the user ID of the report is the same as the user ID that made the request
                    // then report can be deleted
                    // filter database in order to remove report with matching RID, then set it equal to the database again
                    (async() => {
                        try {
                            await MongoReports.deleteOne( {"rid": rid} );
                        } catch (err) { console.error(err); }
                    })();
                    // refresh page so the deletion shows up
                    res.sendFile('client/listview.html', { 'root' : __dirname });
                } else {
                    // don't delete
                    alert("cannot delete reports made by other users!");
                }
            });
        } catch (err) { console.error(err); }
    })();
});
serv.post('/update'),
checkLoggedIn,
(req, res) => {
    let userInd = findUs(req.user);
    let userID; 

    (async() => {
        let users = await MongoUsers.find({}).toArray();
        let reports = await MongoReports.find({}).toArray();

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
            // TODO
            let uid = data['uid'];
            let rid = data['rid'];
            if (uid === userID) {
                // if the user ID of the report is the same as the user ID that made the request
                // then report can be updated
                // go to submitReport page with fields autofilled
                // how to do that?
                // go to submitReport
                //
                //await client.db("test").collection("Submission").findOneAndUpdate()
            } else {
                // don't update
                alert("cannot update reports made by other users!");
            }
        });
    })();
}

// READ is within map.js and listview.js
// sets our directory to client
serv.use(exp.static('client'));

client.connect(err => {
    if (err) {
        console.error(err);
    } else {
        serv.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    }
});