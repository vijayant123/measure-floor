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
  if(req.query.startYear) {
    var start = parseInt(req.query.startYear, 10);
    if(isNaN(start)){
      throw new Error('Invalid startYear');
    }
  }

  if(req.query.endYear) {
    var end = parseInt(req.query.endYear, 10);
    if(isNaN(end)){
      throw new Error('Invalid endYear');
    }
  }

  if(req.query.parameters) {
    var needles = [];
    var params = req.query.parameters.split(',');
    for(var i=0; i < params.length; i++){
      switch(params[i]){
        case "CO2":
          needles.push("carbon_dioxide_co2_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent");
          break;

        case "N2O":
          needles.push("nitrous_oxide_n2o_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent");
          break;

        case "HFCS":
          needles.push("hydrofluorocarbons_hfcs_emissions_in_kilotonne_co2_equivalent");
          break;

        case "GHGS":
          needles.push("greenhouse_gas_ghgs_emissions_including_indirect_co2_without_lulucf_in_kilotonne_co2_equivalent");
          needles.push("greenhouse_gas_ghgs_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent");
          break;
    
        case "NF3":
          needles.push("nitrogen_trifluoride_nf3_emissions_in_kilotonne_co2_equivalent");
          break;

        case "CH4":
          needles.push("methane_ch4_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent");
          break;

        case "PFCS":
          needles.push("perfluorocarbons_pfcs_emissions_in_kilotonne_co2_equivalent");
          break;      
        
        case "SF6":
          needles.push("sulphur_hexafluoride_sf6_emissions_in_kilotonne_co2_equivalent");
          break;
            
        default:
          throw new Error("Invalid parameters");
      }
    }
  }

  db.find(function (record) {
    if(record.id != req.params.id){ 
      return false;
    }

    record.year = parseInt(record.year, 10);
    if(req.query.startYear) {
      if(record.year < start){
        return false;
      }
    }

    if(req.query.endYear) {
      if(record.year > end){
        return false;
      }
    }

    if(req.query.parameters) {
      var found = false;
      for(var j=0; j < needles.length; j++) {
        if(record.category == needles[j]) {
          found = true;
          break;
        }
      }

      if(!found) {
        return false;
      }
    }

    return true;
  }).then(function (records) {
    res.json({
      data: records.map(record => {
        record.year = parseInt(record.year, 10);
        return record;
      })
    })
  });
});

module.exports = router;