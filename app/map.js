const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
const mapboxSdk = require('@mapbox/mapbox-sdk/umd/mapbox-sdk.min.js');

mapboxgl.accessToken = 'pk.eyJ1IjoiYWl1cGp1bGlhbiIsImEiOiJjazBlNTZjb3UwMDcyM2hvN2FyYnprN2oxIn0._WDJd5MgVTsJnImGLI8IDQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-122.431297, 37.773972],
  zoom: 9.5
});
const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });

document.getElementById('map').addEventListener('changeMovieLocations', e => {
  const movieLocations = e.detail;
  const movieLocationsLatLon = movieLocations.map(movieLocation => {
    return mapboxClient.geocoding.forwardGeocode({
      query: `${movieLocation.locations}, San Francisco`,
      autocomplete: false,
      limit: 1
    }).send();
  });
  Promise.all(movieLocationsLatLon).then(function (responses) {
    const features = [];
    responses.forEach((response, index) => {
      if (response && response.body && response.body.features && response.body.features.length) {
        const feature = response.body.features[0];
        features.push({
          type: 'Feature',
          properties: {
            description: `<strong>${movieLocations[index].locations}</strong><p>Fun facts: ${movieLocations[index].fun_facts || '-'}</p>`,
            icon: 'cinema'
          },
          geometry: {
            type: 'Point',
            coordinates: feature.center
          }
        });
      }
    });
    map.getSource('places').setData({
      type: 'FeatureCollection',
      features,
    });
  });
});

map.on('load', function() {
  map.addLayer({
    id: 'places',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    },
    layout: {
      'icon-image': '{icon}-15',
      'icon-allow-overlap': true
    }
  });

  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on('click', 'places', function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'places', function() {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'places', function() {
    map.getCanvas().style.cursor = '';
  });
});
