// make some number of divs
// for each div...
// image on left
// header top right
// description bottom right

const listGroup = document.getElementById("list-group");
console.log(listGroup);
for (let i = 0; i < 3; i++) {
    const div = document.createElement("div");
    div.classList = "list-group-item";
    const img = document.createElement("img");
    img.classList = "list-image";
    img.src = "https://static01.nyt.com/images/2021/09/30/multimedia/30xp-umass/30xp-umass-jumbo.jpg";
    const header = document.createElement("h1");
    header.textContent = "Title";
    const description = document.createElement("p");
    description.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Molestie nunc non blandit massa enim nec dui. Quis ipsum suspendisse ultrices gravida. Dui ut ornare lectus sit amet est. Purus sit amet luctus venenatis. Quis enim lobortis scelerisque fermentum dui faucibus in ornare. Risus ultricies tristique nulla aliquet enim tortor.";
    div.appendChild(img);
    div.appendChild(header);
    div.appendChild(description);
    listGroup.appendChild(div);
}

function addReport(imageURL, title, desc) {
    const div = document.createElement("div");
    div.classList = "list-group-item";
    const img = document.createElement("img");
    img.classList = "list-image";
    img.src = imageURL;
    const header = document.createElement("h1");
    header.textContent = title;
    const description = document.createElement("p");
    description.textContent = desc;
    div.appendChild(img);
    div.appendChild(header);
    div.appendChild(description);
    listGroup.appendChild(div);
}

addReport("https://www.umass.edu/ipo/sites/default/files/styles/simplecrop/public/11_018_073_6.jpg", "test", "hello world");
