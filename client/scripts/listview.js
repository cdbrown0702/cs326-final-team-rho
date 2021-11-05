const listGroup = document.getElementById("list-group");
console.log(listGroup);
for (let i = 0; i < 10; i++) {
    // init divs
    const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    addReport("https://www.umass.edu/ipo/sites/default/files/styles/simplecrop/public/11_018_073_6.jpg", "test", text, "42 -73", "11/4/21");
    addReport("https://static01.nyt.com/images/2021/09/30/multimedia/30xp-umass/30xp-umass-mobileMasterAt3x.jpg", "test", text, "42 -73", "11/4/21");
}

function addReport(imageURL, title, descText, location, date) {
    // init divs
    const container = document.createElement("div");
    const row = document.createElement("div");
    const col1 = document.createElement("div");
    const col2 = document.createElement("div");
    const col3 = document.createElement("div");
    const img = document.createElement("img");
    const body = document.createElement("div");
    const header = document.createElement("h2");
    const desc = document.createElement("p");
    const loc = document.createElement("p");
    const dateText = document.createElement("p");
    const deleteBtn = document.createElement("button");
    // add stuff to divs
    container.classList = "list-group-item";
    row.classList = "row";
    col1.classList = "col-auto";
    col2.classList = "col";
    col3.classList = "col-auto";
    img.src = imageURL;
    img.classList = "list-image";
    header.textContent = title;
    desc.textContent = descText;
    loc.textContent = location;
    loc.classList = "text-muted";
    dateText.textContent = date;
    dateText.classList = "text-muted";
    deleteBtn.classList = "btn btn-danger";
    deleteBtn.textContent = "Delete Report";
    // put divs together
    body.appendChild(header);
    body.appendChild(desc);
    body.appendChild(loc)
    body.appendChild(dateText);
    col1.appendChild(img);
    col2.appendChild(body);
    col3.appendChild(deleteBtn);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    container.appendChild(row);
    listGroup.appendChild(container);
}

// gets reports from JSON file
console.log("attempting to fetch");
// won't fetch here for some reason but the rest of this should work in theory
fetch('./scripts/events.json')
    .then(response => response.json())
    .then(data => {
      for (let i = 0, l = data.length; i < l; i++) {
        let e = data[i];
        let locString = `${e['coords'][0]}, ${e['coords'][1]}`;
        addReport("https://www.umass.edu/ipo/sites/default/files/styles/simplecrop/public/11_018_073_6.jpg", e['name'], e['desc'], locString, e['date']);
      }
    });
