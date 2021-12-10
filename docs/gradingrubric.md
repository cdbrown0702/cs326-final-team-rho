# Final Rubric

### General __/25

- Authentication
  - Successfully register a new user
  - Successfully log in
  - Only able to access report submission if you are logged in (does not include map or main feed, which are available to non-users)
- Code is properly linted, sensible variable names
- No commented-out code, extraneous variables
- Clear documentation for methods and important code blocks
- Routing is done properly
- Website is deployed publicly on Heroku
- Video demonstration clearly displays features of app and how it could be used by campus members

### Map View Page  __/20
- View reports created by other users, shown on different areas of campus
- Reports are pulled from database
- Clicking on a marker shows limited information about the report
- Can scroll around map to view all of campus and surrounding area

### List View Page  __/25
- Reports are shown in a feed with more information (date, description, etc.), also pulled from database
- Each report contains a delete and update button which can be clicked to either remove the report or update the fields in the submit report page
- Delete button removes report and refreshes the page
- Update button directs you to submission page with fields auto-filled; submission updates the report
- Reports can only be updated or deleted by the user they were created by

### Submit Report Page __/25
- Can only be used if you are actually logged in as a registered user
- Contains fields where user can input information about a report
- Once submit button is clicked, report is sent to database
- User is sent to map view page where they can see their new report

### CRUD  __/5
- Create: 1 point
  - Users - needed to create/delete/update reports
  - Reports - only by users
- Read: 1 point
  - Reports on map view, easier to see location
  - Reports on list view, easier to see specific info
  - Can be read by non-users
- Update: 1 point
  - Edit reports via list view page, as long as you are the creator of that report
- Delete: 1 point
  - Delete a report which you have previously created, from list view page
