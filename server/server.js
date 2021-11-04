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
