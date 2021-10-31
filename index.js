const express = require('express');
const csvdb = require('node-csv-query').default;

const app = express();
const port = process.env.PORT;
var databaseConnection = null;


// register routes
require(__dirname + "/app.js");

// start server
csvdb(__dirname + "/dataset.csv").then(function (db) {
  databaseConnection = db;
  app.listen(port, (err) => {
    if(err){
      return console.log(err);
    }
    
    console.log(`Example app listening at http://localhost:${port}`);
  });
});