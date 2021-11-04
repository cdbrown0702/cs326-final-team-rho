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

for (let i = 0, l = currEvents.length; i < l; i++) {
  let e = currEvents[i];

  let popup = new mapboxgl.Popup({offset: 25}).setHTML(
    'Name: ' + e['name'] + '<br>Date: ' + e['date'] + '<br>Description: ' + e['desc'] 
  );

  new mapboxgl.Marker({
    color: 'black'
  }).setLngLat(e['coords']).setPopup(popup).addTo(map);
}

// const popup = new mapboxgl.Popup({offset: 25}).setText(
//   'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
// );

// const marker = new mapboxgl.Marker({
//   color: 'black'
// }).setLngLat([-72.52480, 42.38984]).setPopup(popup).addTo(map);