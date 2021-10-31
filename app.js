var express = require("express");
var router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});


router.get('/countries', (req, res) => {
  var countries = [];
  var minYearMap = new Map();
  var maxYearMap = new Map();
  var db = global.databaseConnection;
  db.find(function (record) {
    var recordCountry =  record.country_or_area;
    record.year = parseInt(record.year, 10);
    if(minYearMap.get(recordCountry)){
      if (minYearMap.get(recordCountry) > record.year){
        minYearMap.set(recordCountry, record.year);
      }
    } else {
      minYearMap.set(recordCountry, record.year);
    }

    if(maxYearMap.get(recordCountry)){
      if (maxYearMap.get(recordCountry) < record.year){
        maxYearMap.set(recordCountry, record.year);
      }
    } else {
      maxYearMap.set(recordCountry, record.year);
    }

    if(countries.find(e => e.country_or_area == recordCountry)){
      return true;
    } else {
      countries.push(record);
      return true;
    }
  }).then(function (records) {
    res.json({
      data: countries.map(country => {
        delete country.category;
        delete country.value;
        delete country.year;
        country.minimum_year = minYearMap.get(country.country_or_area);
        country.maximum_year = maxYearMap.get(country.country_or_area);
        return country;
      })
    });
    
  });
});


router.get('/country/:id', (req, res) => {
  var db = global.databaseConnection;
  db.find(function (record) {
    console.log(record.);
    if(record.id != req.params.id){
      return false;
    }

    record.year = parseInt(record.year, 10);
    return true;
  }, function (records){
    res.json({
      data: records.map(record => {
        record.year = parseInt(record.year, 10);
        return record;
      })
    })
  });
});

module.exports = router;