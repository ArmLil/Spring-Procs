'use strict'

const data = require('./data');
const database = require('./database');
const server = require('./server');

////////////////////////////////////////////////////////////////////

const main = async () => {
  try{
    const val_command_who = await data.command_who();
    const val_command_ps = await data.command_ps_aux(val_command_who);
    const val_array_rows = await data.arr_rows(val_command_ps);
    const val_db = await database.get_db(val_array_rows);
    const val_server = await server.get_server(val_db);
  } catch (e) {
    console.error('We have an error.', e);
  }
}
main();


/*
data.command_who()

    .then((who_result) => {
      return data.command_ps_aux(who_result);
    }).catch((err) => console.error('Catch who_err.', err))

    .then((ps_result) =>
      return data.arr_rows(ps_result);
    }).catch((err) => console.error('Catch ps_err.', err))

    .then((arr_result) => {
      return database.get_db(arr_result);
    }).catch((err) => console.error('Catch db_err.', err))

    .then((arr) => {
        spring.get('/', function(request, response) {
            response.json(arr);
        });
        spring.listen(8080, function(){
          console.log('Listening on port 8080');
        });
}).catch((err) => console.error('Catch server_err.', err));*/
