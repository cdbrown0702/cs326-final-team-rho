// Creates a group for the entire listview
const listGroup = document.getElementById("list-group");

function addReport(id, title, descText, location, date) {
    // Creates container and row functionality
    const container = document.createElement("div");
    const row = document.createElement("div");
    const col2 = document.createElement("div");
    const col3 = document.createElement("div");

    // Creates locations for several different features of each row
    const body = document.createElement("div");
    const header = document.createElement("h2");
    const desc = document.createElement("p");
    const loc = document.createElement("p");
    const dateText = document.createElement("p");
    const deleteBtn = document.createElement("button");
    deleteBtn.id = `deleteBtn${id}`;
    const updateBtn = document.createElement("button");
    updateBtn.id = `updateBtn${id}`;

    // Adds identification and class structure to previous divs 
    container.id = id;
    container.classList = `list-group-item ${id}`;
    row.classList = "row";
    col2.classList = "col";
    col3.classList = "col-1";
    header.textContent = title;
    desc.textContent = descText;
    loc.textContent = location;
    loc.classList = "text-muted";
    dateText.textContent = date;
    dateText.classList = "text-muted";
    deleteBtn.classList = "btn btn-danger mb-1";
    deleteBtn.textContent = "Delete Report";
    updateBtn.classList = "btn btn-primary";
    updateBtn.textContent = "Update Report";

    // Combines the different elements into individual pieces
    body.appendChild(header);
    body.appendChild(desc);
    body.appendChild(loc)
    body.appendChild(dateText);
    col2.appendChild(body);
    col3.appendChild(deleteBtn);
    col3.appendChild(updateBtn);
    row.appendChild(col2);
    row.appendChild(col3);
    container.appendChild(row);
    listGroup.appendChild(container);
}

// Gets reports, users and current user
fetch('/getInfo')
    .then(response => response.json())
    .then(data => {

      let reports = data[0];
      let users = data[1];
      let reqUser = data[2];

      // Gets the id of the current user
      let uid;
      for (let i = 0; i < users.length; i++) {
        if (users[i]['user'] === reqUser) {
          uid = users[i]['uid'];
        }
      }

      // Iterates through every current report, creating an element for it
      for (let i = 0, l = reports.length; i < l; i++) {
        let e = reports[i];
        let locString = `${e['coords'][0]}, ${e['coords'][1]}`;
        addReport(e['rid'], e['name'], e['desc'], locString, e['date']);
        
        // Adds a button function for deleting said report
        document.getElementById(`deleteBtn${e['rid']}`).addEventListener('click', () => {

            // If the user who posted the report presses it, delete the report and refresh
            if (uid === e['uid']) {

              fetch('/delete', {
                method: 'POST',
                body: JSON.stringify({'uid': e['uid'], 'rid': e['rid']})
              });

              location.reload();
            } else { // Otherwise, alert them that they are not the user

              alert("This is not your report!");
            }
        });

        // Adds a button function for updating said report
        document.getElementById(`updateBtn${e['rid']}`).addEventListener('click', () => {
           
            // If the user who posted the report presses it, delete the report and send the user to submit a new report
            if (uid === e['uid']) {

              fetch('/delete', {
                method: 'POST',
                body: JSON.stringify({'uid': e['uid'], 'rid': e['rid']})
              });
              window.location.href = "https://ualert.herokuapp.com/report.html";
            } else { // Otherwise, alert them that they are not the user

              alert("This is not your report!");
            }

        });
      }
  });