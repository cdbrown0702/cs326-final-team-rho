## Documentation for Database

Datatype: Report
{  
  + uid: <ObjectId1>, // id of the user who submitted
  + rid: <ObjectId2>, // id of the report
  + title: String, // basic description of event 
  + category: String, // color that shows urgency of event (corresponds to a category)    
  + date: String, // date of the event
  + location: Float Array[] // latitude and longitude (in [lng,lat] format) of event which can be displayed on the map 
  + description: String, // more detailed description of event with further info  
}

Datetype: User
{
  + uid: <ObjectId1>, // id of the user
  + user: String, // username of the user
  + pwd: String, // password of the user
}

## Division of Labor

- Connor: Fixed up issues from previous milestone, rewrote server in Express for easier database implementation, added authentication
- James: Fixed issues in listview, finished connecting Update/Delete endpoints, database implementation
- Nitant: Database implementation, endpoint work

## Heroku link

This is a link to our main login page -- please register and log in -- your report submissions will not be successful without having a valid account.

- Link: https://ualert.herokuapp.com/login.html )