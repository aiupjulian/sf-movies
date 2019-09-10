const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// by default dataSF API limits the response to 1000 rows
const countQuery = 'https://data.sfgov.org/resource/yitu-d5am.json?$select=count(title)';
const getMoviesLocationsQuery = count => `https://data.sfgov.org/resource/yitu-d5am.json?$limit=${count}`;
const moviesLocationJSONPath = path.join(__dirname, '../data/moviesLocations.json');

console.log('Creating database...');
axios.get(countQuery).then(response => response.data[0].count_title).then(moviesLocationsCount => {
  axios.get(getMoviesLocationsQuery(moviesLocationsCount)).then(response => {
    const data = JSON.stringify(response.data, null, 2);
    fs.writeFileSync(moviesLocationJSONPath, data);
    const mongoimport = spawnSync('mongoimport', ['--jsonArray', '-d', 'sfmovies', '--collection', 'moviesLocations', '--file', moviesLocationJSONPath, '--drop']);
    if (mongoimport.status != 0) {
      console.log('There was an error while attempting to create the mongo database:');
      console.log(mongoimport.stderr.toString());
      console.log('Import the included moviesLocations json into your mongo database.')
    } else {
      console.log('Mongo database created succesfully');
    }
  });
});
