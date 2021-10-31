var express = require("express");
var router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});


router.get('/countries', (req, res) => {
  var countries = [];
  var db = global.databaseConnection;
  db.find(function (record) {
    if(countries.find(e => e == record.country_or_area)){
      return true;
    } else {
      countries.push(record.country_or_area);
      return true;
    }
  }).then(function (records) {
    res.json({
      data: countries
    });
    
  });
});
module.exports = router;