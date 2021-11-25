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

import { MongoClient } from 'mongodb';
const uri = "mongodb+srv://hello:<password>@cluster0.ewjrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {


    //client.close();
  });

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
    if (await client.db("test").collection("Submission").length === 0) {
        newID = 1;
    } else {
        newID = await client.db("test").collection("Submission").length + 1;
    }
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        // database.push({
        //     'uid': userID,
        //     'rid': newID,
        //     'name': data.name,
        //     'category': data.category,
        //     'date': data.date,
        //     'coords': data.coords,
        //     'desc': data.desc
        // });
        // fs.writeFile("client/scripts/events.json", JSON.stringify(database), err => {
        //     if (err) {
        //         console.err(err);
        //     }
        // });
        await client.db("test").collection("Submission").insertOne({
            'uid': userID,
            'rid': newID,
            'name': data.name,
            'category': data.category,
            'date': data.date,
            'coords': data.coords,
            'desc': data.desc
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
        // data needs to contain user ID to make sure the user isn't deleting someone else's report
        // also needs to contain report ID in order to remove it from the database
        let uid = data['uid'];
        let rid = data['rid'];
        if (uid == userID) {
            // if the user ID of the report is the same as the user ID that made the request
            // then report can be deleted
            // filter database in order to remove report with matching RID, then set it equal to the database again
            await client.db("test").collection("Submission").deleteOne(report => report['rid'] !== rid);
            
            // refresh page so the deletion shows up
            res.sendFile('client/listview.html', { 'root' : __dirname });
        } else {
            // don't delete
            alert("cannot delete reports made by other users!");
        }
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
        // TODO
        let uid = data['uid'];
        let rid = data['rid'];
        if (uid == userID) {
            // if the user ID of the report is the same as the user ID that made the request
            // then report can be updated
            // go to submitReport page with fields autofilled
            // how to do that?
            // go to submitReport
            //
            await client.db("test").collection("Submission").findOneAndUpdate()
        } else {
            // don't update
            alert("cannot update reports made by other users!");
        }

    })
}

// READ is within map.js and listview.js
// sets our directory to client
serv.use(exp.static('client'));

serv.post('/', (req,res) => {
    res.redirect('/login');
});

serv.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
//---
// 'use strict'

// // Imports necessary users and events
// const fs = require('fs');
// let database;
// if (fs.existsSync("client/scripts/events.json")) {
//     database = JSON.parse(fs.readFileSync("client/scripts/events.json"));
// } else {
//     database = [];
// }
// let users;
// if (fs.existsSync("client/scripts/users.json")) {
//     users = JSON.parse(fs.readFileSync("client/scripts/users.json"));
// } else {
//     users = [];
// }

// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://hello:hello@cluster0.ewjrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(err => {
//   const collection = client.db("test").collection("devices2");
//   //user
//   //profile
//   // perform actions on the collection object
//   collection.insertOne({name: "234"});
// //   client.close();
// });

// // Pulls in necessary pieces for server functionality
// //require('dotenv').config();
// const exp = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const serv = exp();
// const port = process.env.PORT || 3000;

// const ses = {
//     secret: process.env.SECRET || 'secret',
//     resave: false,
//     saveUninitialized: false
// };

// // constructs Passport for username authentication
// const strat = new LocalStrategy(
//     async (username, password, done) => {
//         if (!findUs(username)) { //user doesn't exist
//             return done(null, false, { 'message': 'Incorrect Username' });
//         }
//         if (!valPass(username, password)) {
//             return done(null, false, { 'message': 'Incorrect Password'});
//         }
//         return done(null, username);
//     }
// );
// serv.use(session(ses));
// passport.use(strat);
// serv.use(passport.initialize());
// serv.use(passport.session());
// passport.serializeUser((user, done) => {
//     done(null, user);
// });
// passport.deserializeUser((uid, done) => {
//     done(null, uid);
// });
// serv.use(exp.json());
// serv.use(exp.urlencoded({'extended': true}));

// // Authentication Functions
// function findUs(user) {
//     for (let i = 0; i < users.length; i++) {
//         if (users[i]['user'] === user) {
//             return i;
//         }
//     }
//     return -1;
// };
// function valPass(user, pwd) {
//     let i = findUs(user);
//     if (i === -1) {
//         return false;
//     }
//     if (users[i]['pwd'] !== pwd) {
//         return false;
//     }
//     return true;
// };
// function addUs(user, pwd) {
//     if (findUs(user) === -1) {
//         users.push({'uid' : users.length + 1, 'user' : user, 'pwd': pwd});
//         fs.writeFile("client/scripts/users.json", JSON.stringify(users), err => {
//             if (err) {
//                 console.err(err);
//             }
//         });
//         return true;
//     }
//     return false;
// };
// function checkLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         next();
//     } else {
//         res.redirect('/login');
//     }
// }

// function createUser(){
//     await client.db("test").collection("devices").insert(wordscore) HAVE IN EACH FUNCTIONS
// }
// // Authentication Endpoints
// serv.get('/',
//     checkLoggedIn,
//     (req, res) => {
//         res.send("logged");
//     });
// serv.post('/login',
//     passport.authenticate('local' , {     // use username/password authentication
//         'successRedirect' : '/map.html',   // when we login, go to /html 
//         'failureRedirect' : '/login'      // otherwise, back to login
//     }));
// serv.get('/login',
// 	(req, res) => res.sendFile('client/login.html',
// 				   { 'root' : __dirname }));
// serv.get('/logout', (req, res) => {
//     req.logout(); // Logs us out!
//     res.redirect('/login'); // back to login
// });
// serv.post('/register',
// (req, res) => {
//     const username = req.body['username'];
//     const password = req.body['password'];
//     // TODO
//     // Check if we successfully added the user.
//     let result = addUs(username, password);
//     // If so, redirect to '/login'
//     if (result) { res.redirect('/login'); }
//     // If not, redirect to '/register'.
//     if (!result) { res.redirect('/register'); }
//     //api call to db operation
//     createUser()
// //     const collection = client.db("test").collection("devices");//for hoemwork: "homework".collection("gameScore"), different line "wordSCore"
// //     collection.insertOne({name:"123"});
// //   // perform actions on the collection object
// // //   client.close();
// // await client.db("test").collection("devices").insert(wordscore) HAVE IN EACH FUNCTIONS
// });
// serv.get('/register',
// (req, res) => res.sendFile('client/register.html',
//                 { 'root' : __dirname }));
// // Creates report
// serv.post('/createReport',
// checkLoggedIn,
// (req, res) => {
//     let newID, userID;
//     let userInd = findUs(req.user);
//     if (userInd === -1) {
//         alert("You're not logged in!");
//         res.redirect('/login');
//     } else {
//         userID = users[userInd]['uid'];
//     }
//     if (database.length === 0) {
//         newID = 1;
//     } else {
//         newID = database.length + 1;
//     }
//     let body = '';
//     req.on('data', data => body += data);
//     req.on('end', () => {
//         const data = JSON.parse(body);
//         database.push({
//             'uid': userID,
//             'rid': newID,
//             'name': data.name,
//             'category': data.category,
//             'date': data.date,
//             'coords': data.coords,
//             'desc': data.desc
//         });
//         fs.writeFile("client/scripts/events.json", JSON.stringify(database), err => {
//             if (err) {
//                 console.err(err);
//             }
//         });
//     });
// });
// serv.post('/delete',
// checkLoggedIn,
// (req, res) => {
//     let userInd = findUs(req.user);
//     let userID;
//     if (userInd === -1) {
//         res.redirect('/login'); 
//     } else {
//         userID = users[userInd]['uid'];
//     }
//     let body = '';
//     req.on('data', data => body += data);
//     req.on('end', () => {
//         const data = JSON.parse(body);
//         // insert code to check if userid = uid in the report they want to delete
//         // Give them a baby modal saying are you sure or something
//     })
// });
// serv.post('/update'),
// checkLoggedIn,
// (req, res) => {
//     let userInd = findUs(req.user);
//     let userID;
//     if (userInd === -1) {
//         res.redirect('/login'); 
//     } else {
//         userID = users[userInd]['uid'];
//     }
//     let body = '';
//     req.on('data', data => body += data);
//     req.on('end', () => {
//         const data = JSON.parse(body);
//         // insert code to check if userid = uid in the report they want to update,
//         // redirect to submit with fields auto-filled... HANG ON TO PREVIOUS REPORT ID SO YOU CAN UPDATE 
//     })
// }

// // READ is within map.js and listview.js
// // sets our directory to client
// serv.use(exp.static('client'));

// serv.get('*', (req,res) => {
//     res.send('Error');
// });

// client.connect(err => {
//   serv.listen(port, () => {
// console.log(`Server listening at http://localhost:${port}`);
// });
// });
