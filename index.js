'use strict'

const express = require('express');
const spring = express();

const bodyParser = require('body-parser');
spring.use(bodyParser.json());

const data = require('./data');
const database = require('./database');

////////////////////////////////////////////////////////////////////


data.command_who()

    .then((who_result) => {
      return data.command_ps_aux(who_result);
    }).catch((err) => console.error('Catch who_err.', err))

    .then((ps_result) => {
      //console.log(result);
      return data.arr_rows(ps_result);
    }).catch((err) => console.error('Catch ps_err.', err))

    .then((arr_result) => {
      //console.log(result);
      return database.get_db(arr_result);
    }).catch((err) => console.error('Catch db_err.', err))

    .then((arr) => {
        spring.get('/', function(request, response) {
            response.json(arr);
        });
        spring.listen(8080, function(){
          console.log('Listening on port 8080');
        });
    }).catch((err) => console.error('Catch server_err.', err));
