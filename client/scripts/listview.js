const listGroup = document.getElementById("list-group");

function addReport(id, title, descText, location, date) {
    // init divs
    const container = document.createElement("div");
    const row = document.createElement("div");
    const col2 = document.createElement("div");
    const col3 = document.createElement("div");
    const body = document.createElement("div");
    const header = document.createElement("h2");
    const desc = document.createElement("p");
    const loc = document.createElement("p");
    const dateText = document.createElement("p");
    const deleteBtn = document.createElement("button");
    deleteBtn.id = `deleteBtn${id}`;
    const updateBtn = document.createElement("button");
    updateBtn.id = `updateBtn${id}`;
    // add stuff to divs
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
    // put divs together
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

fetch('/getReports')
    .then(response => response.json())
    .then(data => {

      for (let i = 0, l = data.length; i < l; i++) {
        let e = data[i];
        let locString = `${e['coords'][0]}, ${e['coords'][1]}`;
        addReport(e['rid'], e['name'], e['desc'], locString, e['date']);
        
        document.getElementById(`deleteBtn${e['rid']}`).addEventListener('click', () => {

          fetch('/getUser')
          .then(response => response.json())
          .then(data => {

            console.log(JSON.stringify(data));

            if (data === e['rid']) {
              fetch('/delete', {
                method: 'POST',
                body: JSON.stringify({'uid': e['uid'], 'rid': e['rid']})
              });
              location.reload();
            } else {
              alert("This is not your report!");
            }
          });
        });

        document.getElementById(`updateBtn${e['rid']}`).addEventListener('click', () => {
          fetch('/getUser')
          .then(response => response.json())
          .then(data => {
            // console.log(currRID);
            alert(data);

            if (data === e['rid']) {
              fetch('/delete', {
                method: 'POST',
                body: JSON.stringify({'uid': e['uid'], 'rid': e['rid']})
              });
              window.location.href = "https://ualert.herokuapp.com/report.html";
            } else {
              alert("This is not your report!");
            }
          });

        });
      }
  });
