const express = require('express');
const csvdb = require('node-csv-query').default;

const app = express();
const port = process.env.PORT;
global.databaseConnection = null;


// register routes
app.use(require(__dirname + "/app.js"));

// start server
csvdb(__dirname + "/dataset.csv").then(function (db) {
  global.databaseConnection = db;
  app.listen(port, (err) => {
    if(err){
      return console.log(err);
    }
    
    console.log(`Example app listening at http://localhost:${port}`);
  });
});