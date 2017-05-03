'use strict'

const express = require('express');

const sqlite = require('sqlite');

const child = require('child_process');

const spring = express();

const bodyParser = require('body-parser');

spring.use(bodyParser.json());

const sqlite3     = require('sqlite3').verbose();

const fs          = require('fs');

const dbFile = './database.db';

const dbExists = fs.existsSync(dbFile);

if(!dbExists)  fs.openSync(dbFile, 'w');

const db = new sqlite3.Database(dbFile);

////////////////////////////////////////////////////////////////////


const command_who = () => {
  return new Promise((resolve, reject) => {

    const user = child.spawn('whoami');
    let str_arr = [];
    user.stdout.on('data', d => str_arr.push(d));
    user.stdout.on('end', () => {
      str_arr = Buffer.concat(str_arr).toString();
      const user_name = str_arr.substr(0, str_arr.indexOf('\n'));

      resolve(user_name);
    });
  });
};


 const command_ps_aux = (user) => {
   return new Promise((resolve, reject) => {

      const ps = child.spawn('ps',['aux']);
      let str_arr = [];
      ps.stdout.on('data', d => str_arr.push(d));
      ps.stdout.on('end', () => {
        str_arr = Buffer.concat(str_arr).toString().split('\n');

        let filt_arr_1 = [];

        filt_arr_1 = str_arr.filter(str => {
          const f_word = str.substr(0, str.indexOf(' '));
          return ((user !== f_word) && (f_word !== 'root'));
        });

      resolve(filt_arr_1);
    });
  });
};


const arr_rows = (arr) => {
  return new Promise((resolve, reject) => {
    const filt_arr = [];

    for (let str of arr){
      str = str.replace(/\s+/g,' ').trim().split(' ');
      filt_arr.push(str);
    }

    resolve(filt_arr);
  });
};



const final_array = (filt_arr) => {
  return new Promise((resolve, reject) => {

    const i_pName = filt_arr[0].findIndex(s => s === 'USER');
    const i_pid = filt_arr[0].findIndex(s => s === 'PID');
    const i_command = filt_arr[0].findIndex(s => s === 'COMMAND');

    const last_arr = [];
    for (let row of filt_arr){
      row = row.filter(e => (row.indexOf(e) === i_pName) ||
                            (row.indexOf(e) === i_pid) ||
                           (row.indexOf(e) === i_command));
     last_arr.push(row);
    }
    last_arr.pop();
    last_arr.shift();

    resolve(last_arr);
  });
};


command_who().then((result) => {
  return command_ps_aux(result);
}).then((ps_result) => {
  //console.log(result);
  return arr_rows(ps_result);
}).then((arr_result) => {
  //console.log(result);
  return final_array(arr_result);
}).then((final_result) => {
 //console.log(final_result);

  db.serialize(() => {

    db.run('CREATE TABLE if not exists my_table (' +
    '`run_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
    '`result`)');


////////////////////////////////////////////////////////////////

    // Insert some data using a statement:
    let obj_arr = [];
    const statement = db.prepare('INSERT INTO `my_table` (`result`) VALUES (?)');
       for (let row = 0; row < final_result.length; ++row){
         obj_arr.push(`
{ROW: ${row +1}, USER: ${final_result[row][0]}, PID: ${final_result[row][1]}, COMMAND: ${final_result[row][2]}}`);
       }
       statement.run(`${obj_arr}`);

       statement.finalize();
////////////////////////////////////////////////////////////////
       const arr = [];
       db.each("SELECT * FROM my_table", (err, row) => {
         //console.log(row);
         arr.push(row);
       });

       spring.get('/', function(request, response) {
         response.json(arr);
       });

       spring.listen(8080, function(){
         console.log('Listening on port 8080');
       });
       // Close the database:
       db.close();
     });
   });
