const listGroup = document.getElementById("list-group");
console.log(listGroup);
for (let i = 0; i < 10; i++) {
    // init divs
    const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    addReport("https://www.umass.edu/ipo/sites/default/files/styles/simplecrop/public/11_018_073_6.jpg", "test", text);
    addReport("https://static01.nyt.com/images/2021/09/30/multimedia/30xp-umass/30xp-umass-mobileMasterAt3x.jpg", "test", text);
}

function addReport(imageURL, title, descText) {
    // init divs
    const container = document.createElement("div");
    const row = document.createElement("div");
    const col1 = document.createElement("div");
    const col2 = document.createElement("div");
    const img = document.createElement("img");
    const body = document.createElement("div");
    const header = document.createElement("h2");
    const desc = document.createElement("p");
    const time = document.createElement("p");
    // add stuff to divs
container.classList = "list-group-item";
    row.classList = "row";
    col1.classList = "col-auto";
    col2.classList = "col";
    img.src = imageURL;
    img.classList = "list-image";
    header.textContent = title;
    desc.textContent = descText;
    time.textContent = "5 minutes ago";
    time.classList = "text-muted";
    // put divs together
    body.appendChild(header);
    body.appendChild(desc);
    body.appendChild(time);
    col1.appendChild(img);
    col2.appendChild(body);
    row.appendChild(col1);
    row.appendChild(col2);
    container.appendChild(row);
    listGroup.appendChild(container);
}
