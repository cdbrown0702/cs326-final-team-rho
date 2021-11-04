// Defines constants for map initialization
const campus    = L.latLng(42.38922, -72.52650),
      southWest = L.latLng(42.37519, -72.53988),
      northEast = L.latLng(42.39892, -72.51576),
      mapBounds = [southWest, northEast];

// Sets access token and initializes map, sets boundarys and zoom
mapboxgl.accessToken = 'pk.eyJ1IjoiY2Ricm93bjA3MDIiLCJhIjoiY2t2anRnOWI0MDQ3djJ1cW5sY2tnNjVkNCJ9.JII6kT21_W_G7O_Lvpww2g';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: campus, // starting position [lng, lat]
  zoom: 16, // starting zoom
  maxZoom: 18,
  maxBounds: mapBounds
});

// Defines the current, submitted reports
// TODO connect this to a database/JSON file
currEvents = [{
  'name': 'Car Accident',
  'date': '3 Dec 2016',
  'coords': [-72.52695, 42.39506],
  'desc': 'There was a major car accident near the northern rotary on campus, someone is dead'
}, {
  'name': 'Morrill Fire',
  'date': 'November 28 2016',
  'coords': [-72.52480, 42.38984],
  'desc': 'Theta Chi literally just burnt Morrill down what the heck?'
}];

// Iterates through all submitted reports, creating popups and a marker for each
for (let i = 0, l = currEvents.length; i < l; i++) {
  let e = currEvents[i];
  let popup = new mapboxgl.Popup({offset: 25}).setHTML(
    'Name: ' + e['name'] + '<br>Date: ' + e['date'] + '<br>Description: ' + e['desc'] 
  );
  new mapboxgl.Marker({
    color: 'black'
  }).setLngLat(e['coords']).setPopup(popup).addTo(map);
}