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
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Incorrect Username' });
        }
        if (!await valPass(username, password)) {
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Incorrect Password'});
        }
        return done(null, username);
    }
);

// password encryption method
const minicrypt = require('scripts/minicrypt.js');
const mc = new minicrypt();

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
        let u = await MongoUsers.find({}).toArray();
        for (let i = 0; i < u.length; i++) {
            if (u[i]['user'] === user) {
                if (!mc.check(pwd, u[i]['salt'], u[i]['hash'])) {
                    console.log("password bad");
                    return false;
                }
                break;
            }
        }
        console.log("password good");
        return true; 
    } catch (err) { console.error(err); }
};
async function addUs(user, pwd) {
    try {
        let users = await MongoUsers.find({}).toArray();
        if (await findUs(user)) {
            console.log("this user already exists");
            return false;
        } else {
            const [salt, hash] = mc.hash(pwd);
            let newUser = {'uid': users.length + 1, 'user': user, 'salt': salt, 'hash': hash};
            console.log("adding user: " + JSON.stringify(newUser));
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
serv.get('/pageReport.html',
checkLoggedIn,
(req, res) => {
    res.redirect('/pageReport.html');
});
// Creates report
serv.post('/createReport',
checkLoggedIn,
(req, res) => {
    (async() => {
        try {
            let users = await MongoUsers.find({}).toArray();
            let reports = await MongoReports.find({}).toArray();
            let userID;

            for (let i = 0; i < users.length; i++) {
                if (users[i]['user'] === req.user) {
                    userID = users[i]['uid'];
                    break;
                }
            }

            let body = '';
            req.on('data', data => body += data);
            req.on('end', () => {
                const data = JSON.parse(body);
                let newReport = {
                    'uid': userID,
                    'rid': reports.length + 1,
                    'name': data.name,
                    'category': data.category,
                    'date': data.date,
                    'coords': data.coords,
                    'desc': data.desc
                }
                (async() => {
                    await MongoReports.insertOne(newReport);
                    res.redirect('client/map.html');
                })();
            });
        } catch (err) { console.error(err); }
    })();
});
serv.get('/getReports',
(req,res) => {
    (async() => {
        res.send(await MongoReports.find({}).toArray());
    })();
})
serv.post('/delete',
checkLoggedIn,
(req, res) => {
    (async() => {
        try {
            let users = await MongoUsers.find({}).toArray();
            console.log("how bout here");
            
            let userID;

            for (let i = 0; i < users.length; i++) {
                if (users[i]['user'] === req.user) {
                    userID = users[i]['uid'];
                    break;
                }
            }

            let body = '';
            req.on('data', data => body += data);
            req.on('end', () => {
                const data = JSON.parse(body);
                // data needs to contain user ID to make sure the user isn't deleting someone else's report
                // also needs to contain report ID in order to remove it from the database
                let reportUID = data['uid'];
                let rid = data['rid'];

                console.log("posting " + reportUID + " " + rid);
                if (reportUID === userID) {
                    // if the user ID of the report is the same as the user ID that made the request
                    // then report can be deleted
                    // filter database in order to remove report with matching RID, then set it equal to the database again
                    (async() => {
                        try {
                            await MongoReports.deleteOne( {"rid": rid} );
                            res.redirect('client/listview.html');
                        } catch (err) { console.error(err); }
                    })();
                } else {
                    // don't delete
                    console.log("delete failed");
                }
            });
        } catch (err) { console.error(err); }
    })();
});
serv.post('/update'),
checkLoggedIn,
(req, res) => {
    (async() => {
        let users = await MongoUsers.find({}).toArray();
        //let reports = await MongoReports.find({}).toArray();

        let userID;

        for (let i = 0; i < users.length; i++) {
            if (users[i]['user'] === req.user) {
                userID = users[i]['uid'];
                break;
            }
        }

        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            // insert code to check if userid = uid in the report they want to update,
            // redirect to submit with fields auto-filled... HANG ON TO PREVIOUS REPORT ID SO YOU CAN UPDATE 
            // TODO
            let reportUID = data['uid'];
            let rid = data['rid'];
            if (reportUID === userID) {
                res.redirect(`/pageReport?id=${rid}`);
            } else {
                // don't update
                console.log("update failed");
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
