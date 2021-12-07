# Final Rubric

### General

- Authentication
  - Successfully register a new user
  - Successfully log in
  - Only able to create reports if you are logged in
- Code is properly linted, sensible variable names
- No commented-out code, extraneous variables
- Clear documentation for methods and important code blocks
- Routing is done properly

### Map View Page
- View reports created by other users, shown on different areas of campus
- Reports are pulled from database
- Clicking on a marker shows more information about the report
- Can scroll around map to view all of campus

### List View Page
- Reports are shown in a feed with more information (image, description, etc.), also pulled from database
- Each report contains a delete and update button which can be clicked to either remove the report or update the fields in the submit report page
- Reports can only be updated or deleted by the user they were created by

### Submit Report Page
- Contains fields where user can input information about a report
- Once submit button is clicked, report is sent to database
- User is sent to map view page where they can see their new report

### CRUD
- Create:
  - Users
  - Reports
- Read:
  - Reports on map view, easier to see location
  - Reports on list view, easier to see other info
- Update:
  - Edit reports via list view page, as long as you are the creator of that report
- Delete:
  - Delete a report which you have previously created, from list view page
