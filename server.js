'use strict'

const express = require('express');
const spring = express();

const bodyParser = require('body-parser');
spring.use(bodyParser.json());


exports.get_server = async (arr) => {
  spring.get('/', function(request, response) {
      response.json(arr);
  });
  spring.listen(8080, function(){
    console.log('Listening on port 8080');
  });
}
