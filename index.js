const express = require('express');
const db = require('node-csv-query').default;

const app = express();
const port = 3000;
var databaseConnection = null;


// register routes
app.get('/', (req, res) => {
  res.send('Hello World!');
})


// start server
csvdb(__dirname + "/dataset.csv").then(function (db) {
  databaseConnection = db;
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});