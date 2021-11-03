let center    = L.latLng(42.38922, -72.52650),
    southWest = L.latLng(42.37519, -72.53988),
    northEast = L.latLng(42.39892, -72.51576),
    mapBounds = L.latLngBounds(southWest, northEast);

L.mapbox.accessToken = 'pk.eyJ1IjoiY2Ricm93bjA3MDIiLCJhIjoiY2t2anRnOWI0MDQ3djJ1cW5sY2tnNjVkNCJ9.JII6kT21_W_G7O_Lvpww2g';

let map = L.mapbox.map('map', null, {
    maxBounds: mapBounds,
    maxZoom: 18,
    minZoom: 15
}).setView(center, 16)
  .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));

map.fitBounds(mapBounds);

const geoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [42.393570, -72.530834]
      },
      properties: {
        title: 'Car Crash',
        description: 'Car flipped and this mf died lol'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [42.38984, -72.52480]
      },
      properties: {
        title: 'Arson',
        description: 'Theta Chi burnt down Morrill????'
      }
    }
  ]
};

for (const feature of geoJSON.features) {
  const newDiv = document.createElement('div');
  newDiv.className = 'marker';

  new mapboxgl.Marker(newDiv).setLngLat(feature.geometry.coordinates).addTo(map);
}