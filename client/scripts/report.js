// Defines constants for map initialization
const campus    = L.latLng(42.38922, -72.52650),
      southWest = L.latLng(42.37519, -72.53988),
      northEast = L.latLng(42.39892, -72.51576),
      mapBounds = [southWest, northEast];

// Sets access token and initializes map, sets boundarys and zoom
mapboxgl.accessToken = 'pk.eyJ1IjoiY2Ricm93bjA3MDIiLCJhIjoiY2t2anRnOWI0MDQ3djJ1cW5sY2tnNjVkNCJ9.JII6kT21_W_G7O_Lvpww2g';
const subMap = new mapboxgl.Map({
  container: 'map-small', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: campus, // starting position [lng, lat]
  zoom: 16, // starting zoom
  maxZoom: 18,
  maxBounds: mapBounds
});

const marker = new mapboxgl.Marker({
  color: 'black',
  draggable: true
})
marker.setLngLat([-72.52650, 42.38922]).addTo(subMap);

function onDragEnd() {
  const lnglat = marker.getLngLat();
  document.getElementById('lat').innerHTML = `${lnglat.lat}`;
  document.getElementById('long').innerHTML = `${lnglat.lng}`;
}

marker.on('dragend', onDragEnd);

document.getElementById('sub').addEventListener('click', () => {
  let name = document.getElementById('eventName').value;
  let category = document.getElementById('category').value;
  let date = document.getElementById('dateInput').value;
  let desc = document.getElementById('descriptInput').value;
  let coords = [marker.getLngLat().lng, marker.getLngLat().lat];

  let obj = {'name': name,
             'date': date,
             'category': category,
             'coords': coords,
             'desc': desc};

  fetch("/createReport", {method: "POST", body: JSON.stringify(obj)});
});