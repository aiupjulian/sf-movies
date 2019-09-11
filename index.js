const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const MongoClient = require('mongodb').MongoClient;

const dbURL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const dbName = 'sfmovies';
const dbCollection = 'moviesLocations';
const client = new MongoClient(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('./public'));

// client code
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// API
app.get('/api/movie', (req, res) => {
  const { title } = req.query;
  req.app.locals.collection.find({ title }).toArray().then(result => {
    res.send(result);
  }).catch(error => {
    console.log(error);
  });
});

// if we can't connect to the db, don't start the server
client.connect().then(() => {
  const db = client.db(dbName);
  const collection = db.collection(dbCollection);
  app.locals.collection = collection;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}).catch(error => {
  console.log(error);
});
