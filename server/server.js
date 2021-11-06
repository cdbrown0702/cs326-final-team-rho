// endpoints
// POST /report/new - send object that contains ID, header, date, description, location
// ID - number
// header - 3 words
// date - xx/xx/xxxx
// description - 2 sentences
// location - gps coordinates
// goal: generate a bunch of fake reports that we can display on the map and feed
// how to do it: generate those things above either with faker or by myself, compile report objects with them, send back to client
// client will display the report objects with front-end JS

const faker = require('faker');
let id = faker.datatype.number(100000);
let header = faker.random.words(3);
let dateObj = faker.date.past();
let dateString = `${dateObj.getMonth()}/${dateObj.getDay()}/${dateObj.getFullYear()}`
let description = faker.lorem.sentences(2);
// doing location myself since we know the range of coords that UMass campus is in
let latitude;
let longitude;
console.log(id);
console.log(header);
console.log(dateString);
console.log(description);

//----------------------
'use strict';
// const filename = 'ex.json';
let http = require('http');
let url = require('url');
let fs = require('fs');


// function reload(filename) {
    
//     if (fs.existsSync(filename)) {
//         let string1 = fs.readFileSync(filename);
//         evthing = JSON.parse(string1);
//     }
//     else {
//         evthing = {wordScores:[], gameScores:[]};
//     }
// }

// - Report Object - ID, name, date, description, location
// - User Object - ID, name, email, password, list of reports
// - Submissions - ReportID, UserID, date

// - /report/new -- allows for a new report to be added to the collection of reports when a request is sent to this endpoint (contains ID (generated), name, date, description and location)
// - /report/ID  -- viewing endpoint which returns the fields of the report
// - /user/new OR /register -- allows a new user to be created
// - /login -- allows any user to login and edit their submissions
// - /user/ID/submit/new?ID=1234 -- creates a submission object for the given user and report ID
// - /user/ID/submit/view -- returns all reports of the given user
// - /user/ID/submit/delete?id=1234 -- deletes the given report ID for a SPECIFIC user
let rep = {ID: 0, name: "", date: 0, description: "", location:[]};
let us = {name: "", ID: 0, email: "", password: "", listReports:""};
let sub = {reportID: 0, UserID: 0, date: 0}

let server = http.createServer();
server.on('req', async (req, res) => {
    res.writeHead(200, headerText);
    let options = url.parse(req.url, true).query;
    res.write(JSON.stringify(options));


   // reload(filename);

    if (options.pathname === "/new?ID=1234") {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            us.ID
            //wordScores.push({name: data.name, word: data.word, score: data.score});
        });
    } if (options.pathname === "/delete?id=1234") {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            evthing.gameScores.push({name: data.name, score: data.score});    
        });
    } if (options.pathname === "/view") {
        res.end(JSON.stringify(
            us.listReports));
    } if (options.pathname === "/highestGameScores") {
        res.end(JSON.stringify(
            evthing.gameScores.sort((a, b) => b.score - a.score).filter((v, x) => x < 10)));
    } else {
        res.end();
    }
}).listen(8080);
