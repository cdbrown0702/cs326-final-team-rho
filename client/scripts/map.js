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

// Fetches all input events from a local JSON file, creating markers with ind. popups
fetch('/getInfo')
    .then(response => response.json())
    .then(data => {
      for (let i = 0, l = data[0].length; i < l; i++) {
        let e = data[0][i];
        let popup = new mapboxgl.Popup({offset: 25}).setHTML(
          'Name: ' + e['name'] + '<br>Date: ' + e['date'] + '<br>Description: ' + e['desc'] 
        );
        new mapboxgl.Marker({
          color: e['category']
        }).setLngLat(e['coords']).setPopup(popup).addTo(map);
      }
    });