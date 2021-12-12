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

<<<<<<< HEAD
## APIs

## Database

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
=======
## URL Routes / Mappings
| Route      | Description |
| ----------- | ----------- |
| /login.html  | Allows the user to log in      |
| /register.html  | Allows the user to make a new account with username and password, redirects to login when done       |
| /listview.html  | Allows the user to view reports on a feed, redirects to login if user is not logged in       |
| /report.html  | Allows the user to submit a report, redirects to login if user is not logged in       |
| /map.html  | Allows user to view reports on map       |
>>>>>>> 29bb26f1c9a5059c649024193e103036160e0c1f
