'use strict'
let cheerio = require('cheerio');
var request = require('request');

var result = {};

request('http://198.199.110.201:8001/slugsense', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred 
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
  console.log('body:', body); // Print the HTML 
  let $ = cheerio.load(body);
  result["humidity"] = parseInt($('#hum').text())
  result["temperature"] = parseInt($('#temp').text())
  result["moisture"] = parseInt($('#moist').text())
  result["solar"] = Math.floor(Math.random()*101);
  console.log(result);
  request.post({
        url: 'https://slugsense.herokuapp.com/api/sensors/5/entries',
        form: { 
                "humidity": result["humidity"],
                "temperature": result["temperature"], 
                "moisture": result["moisture"],
                "sunlight": result["solar"]
              }
         }, function(error, response, body){
            console.log('error:', error); // Print the error if one occurred 
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
            console.log('body:', body);
  })
});

