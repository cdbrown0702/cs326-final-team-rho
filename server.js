'use strict'

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const MongoUsers = client.db("Users").collection("UserList");
const MongoReports = client.db("Reports").collection("Submission");

// Pulls in necessary pieces for server functionality
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
        if (!await findUs(username)) { // user doesn't exist

            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Incorrect Username' });
        }
        if (!await valPass(username, password)) { // password is incorrect

            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Incorrect Password'});
        }
        return done(null, username);
    }
);

// password encryption method
const minicrypt = require('./miniCrypt');
const mc = new minicrypt();

// Passport setup
serv.use(session(ses));
passport.use(strat);
serv.use(passport.initialize());
serv.use(passport.session());
passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((uid, done) => { done(null, uid); });
serv.use(exp.json());
serv.use(exp.urlencoded({'extended': true}));

// Authentication Functions
async function findUs(user) { // Find username
    try {
        // Pull list of users from database
        let users = await MongoUsers.find({}).toArray();
        // If no users, user doesn't exist
        if (users.length === 0) {
            return false;
        }
        // Otherwise, iterate through users until you find user
        for (let i = 0; i < users.length; i++) {
            if (users[i]['user'] === user) {
                return true;
            }
        }
        // If not found, doesn't exist
        return false;
    } catch (err) { console.error(err); }
};

async function valPass(user, pwd) { // Validate user password
    try {
        // Pull list of users from database
        let users = await MongoUsers.find({}).toArray();

        // Iterate through users until user is found
        for (let i = 0; i < users.length; i++) {

            if (users[i]['user'] === user) {
                // Check if password matches using user's salt
                if (!mc.check(pwd, users[i]['salt'], users[i]['hash'])) {
                    return false;
                }
                break;
            }
        }
        return true; 

    } catch (err) { console.error(err); }
};

async function addUs(user, pwd) { // Add user (register)
    try {
        // Pull list of users from database
        let users = await MongoUsers.find({}).toArray();

        // Check to see if user exists
        if (await findUs(user)) {

            return false;

        } else { // If so, create salt and has for their password
            const [salt, hash] = mc.hash(pwd);
            
            // Add user with its salt and has to database (secure authentication)
            let newUser = {'uid': users.length + 1, 'user': user, 'salt': salt, 'hash': hash};
            await MongoUsers.insertOne(newUser);

            return true;
        }
    } catch (err) { console.error(err); }
};

function checkLoggedIn(req, res, next) { // Check if user is logged in
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Authentication Endpoints
serv.get('/', (req,res) => { // Redirect to login page on access of application
    res.redirect('/login');
});

serv.post('/login',
    passport.authenticate('local' , {     // use username/password authentication
        'successRedirect' : '/map.html',   // when we login, go to /html 
        'failureRedirect' : '/login'      // otherwise, back to login
    })
);

// If login endpoint received, send to login page
serv.get('/login',
	(req, res) => res.sendFile('client/login.html',{ 'root' : __dirname })
);

// Logout endpoint received, destroy user's session and direct to login page
serv.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
});

// Register endpoint received (from register submission button), add user
serv.post('/register',
(req, res) => {

    // Grab provided username and password from form
    const username = req.body['username'];
    const password = req.body['password'];

    (async() => {
        // Check if we successfully added the user.
        let result = await addUs(username, password);
        // If so, redirect to '/login'
        if (result === true) { res.redirect('/login'); }
        // If not, redirect to '/register'.
        if (result === false) { res.redirect('/register.html'); }
    })();
});

// Checks to see if user is logged in before allowing access to submission page
serv.get('/reportCheck',
checkLoggedIn,
(req, res) => {
    res.redirect('/pageReport.html');
});

// Creates a report (provided logged in)
serv.post('/createReport',
checkLoggedIn,
(req, res) => {
    (async() => {
        try {
            // Get users and reports from the database
            let users = await MongoUsers.find({}).toArray();
            let reports = await MongoReports.find({}).toArray();
    
            // Pulls user's ID from database
            let userID;
            for (let i = 0; i < users.length; i++) {
                if (users[i]['user'] === req.user) {
                    userID = users[i]['uid'];
                }
            }
            
            let body = '';
            req.on('data', data => body += data);
            req.on('end', async() => {

                // Grabs data from submission form
                const data = JSON.parse(body);
                
                // Creates new report object
                let newReport = {
                    'uid': userID,
                    'rid': reports.length + 1,
                    'name': data.name,
                    'category': data.category,
                    'date': data.date,
                    'coords': data.coords,
                    'desc': data.desc
                }

                try {
                    // Inserts report into database and redirects to map
                    await MongoReports.insertOne(newReport);

                    res.redirect('/client/map.html');
                } catch (err) { console.error(err); } 
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
