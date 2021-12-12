# Team Rho
## UAlert
## Fall 2021

## Overview

UAlert is an application that allows UMass students the ability to document any campus occurrences, including but not limited to car accidents, police encounters, community events, and more. On a campus flooded with different people with varied methods of information, it is vital to have a centralized application to keep the entire population informed. Thus, UAlert serves as a safe, efficient and user-oriented platform for awareness.

## Team Members

* Connor Brown (@cdbrown0702)
* James West (@james-west1)
* Nitant Rimal (@nrimalAI)

## User Interface

## APIs

* '/login' - POST and GET usages. POST authenticates a user, with either a success or a failure. Success redirects to the map page, while failure refreshes the page. The GET request simply sends you to the login page, used when access is denied.
* '/logout' - GET usage. This endpoint for the logout link destroys the current session and redirects to the login page, effectively logging out the current user.
* '/register' - POST. This endpoint for the register page registers the user, pulling the entered username and password, checking if the user entered already exists. Iff it doesn't, the user is added to the database and they are directed to login. Otherwise, you must try again.
* '/reportCheck' - GET. This endpoint is activated when any customer tries to access the "Submit Report" page. If the user is unauthenticated, they will be denied access and sent to the login page instead. If they are authenticated, they will be directed to the page they wanted ('report.html').
* '/getInfo' - GET. This endpoint is used on both the map and feed pages. It functions as a way to receive the list of reports, users and the current, authenticated user. It is used in conjunction with other endpoints to perform UI-oriented functions: populating the map, the feed, and supporting the deleting or updating of reports.
* '/createReport' - POST. This endpoint for the report page grabs the users and reports from the database, and generates a report ID for the report written. It then pulls form data from the submission page, creating a new report, and inserts into the database for reports.
* '/delete' - POST. This endpoint for the listview page is used in two different ways. This endpoint is used for both UPDATE and DELETE CRUD functions. It takes the report provided and deletes it from the database of reports.

## Database
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
  + hash: String // encrypted password
  + salt: String / hide hash, extra layer of protection
}


## URL Routes/Mappings

* "/listview.html" - This page contains an updated feed of all current reports, including the name, the description of it, and the coordinates of the event.
* '/map.html" - This page is the main display page, showcasing markers which, when clicked, show a brief amount of details on the events they represent. 
* '/login.html" - This page allows the user to login, or they can redirect themselves to the registration page.
* '/register.html" - This pages allows the user to register their account.
* '/report.html" - The final page, this page is limited to authenticated users. They can then give multiple different details about the event that occurred for display on list and map views.

## Authentication/Authorization

When a user registers their account, their password is encrypted into a hash value. The resulting encryption is stored in our database along with the user in question (NOT in plaintext) in an effort to protect user's accounts from brute-force attacks. In addition, the login page utilizes a delay system to protect further from brute-forces. When a user successfully logs in, they gain access to a few tools: they can now submit reports through the "Submit Report" page, as well as delete and/or update their own reports (not others) through the "List View" page. Non-authenticated users are limited to the "Map View" and "List View" pages, i.e. read-only functionality.

## Division of Labor

* Connor: Map view page (front- and back-end), routing for map as well as utilizing Mapbox GL JS API, user authentication and encryption, front-end UI, server framework
* James: List view page (front- and back-end), routing for list view and full functionality of report feed, as well as the UI for it
* Nitant: Report submission page (front- and back-end), routing for report submission, front-end UI

## Conclusion

We, the creators of UAlert, learned an immense amount about web programming, APIs, routing and in general how much work goes into even the simplest of webpages. From the ground up, into frameworks, into actually layering new bits and pieces on top until you have a polished product, we've been able to take control of every step and see how everything blends together. We encountered many setbacks along the way; this included general time management, the ability to put together our work in a timely and efficient manner. It was probably our biggest problem throughout the process of putting everything together, and at the finish line we can see the progress we've made. We have also each refined our ability to process information and have become more resourceful about growing as developers. We wish we could have had a little more experience with certain tools, such as REST APIs, beforehand, but we were able to put two and two together to really wrap everything up nicely., given time of course. We would hope to add more UI, including the ability to post pictures of an incident, the have individual report pages, and even a user-specific page showcasing your past reports. We also envisioned a liking/disliking system that unfortunately did not come to fruition. Despite that, this has been an intense learning experience that borderline felt as though we were on the frontlines of a true, industry occupation. Our growth as a team speaks just as much for our growth as individual computer scientists, and we hope that we can take this application further in the future.
