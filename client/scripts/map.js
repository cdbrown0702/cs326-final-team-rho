let center    = L.latLng(42.38922, -72.52650),
    southWest = L.latLng(42.37519, -72.53988),
    northEast = L.latLng(42.39892, -72.51576),
    mapBounds = L.latLngBounds(southWest, northEast);

let map = L.map('map').setView(center, 16);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom: 15,
    maxBounds: mapBounds,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY2Ricm93bjA3MDIiLCJhIjoiY2t2anRnOWI0MDQ3djJ1cW5sY2tnNjVkNCJ9.JII6kT21_W_G7O_Lvpww2g'
}).addTo(map);

map.fitBounds(mapBounds);