'use strict'

const express = require('express');
const spring = express();

const child = require('child_process');

const bodyParser = require('body-parser');
spring.use(bodyParser.json());

const sqlite = require('sqlite');
const sqlite3     = require('sqlite3').verbose();

const fs          = require('fs');
const dbFile = './database.db';
const dbExists = fs.existsSync(dbFile);

if(!dbExists)  fs.openSync(dbFile, 'w');

////////////////////////////////////////////////////////////////////


const arr_rows = (arr) => {
  const filt_arr = [];
  for (let str of arr){
    str = str.replace(/\s+/g,' ').trim().split(' ');
    filt_arr.push(str);
  }
  return filt_arr;
}

const command_who = (callback) => {

  const user = child.spawn('whoami');
  let str_arr = [];
  user.stdout.on('data', d => str_arr.push(d));
  user.stdout.on('end', () => {
    str_arr = Buffer.concat(str_arr).toString();
    const user_name = str_arr.substr(0, str_arr.indexOf('\n'));
    return callback(user_name);
  });
 }

 const command_ps = () => {

   const ps = child.spawn('ps',['aux']);
   let str_arr = [];
   ps.stdout.on('data', d => str_arr.push(d));
   ps.stdout.on('end', () => {
     str_arr = Buffer.concat(str_arr).toString().split('\n');

     command_who(user => {
       let filt_arr = [];

       filt_arr = str_arr.filter(str => {
         const f_word = str.substr(0, str.indexOf(' '));
         return ((user !== f_word) && (f_word !== 'root'));
       });
       //console.log(filt_arr)
       filt_arr = arr_rows(filt_arr);

       //console.log(filt_arr);
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

///////////////////////////////////////////////////////////////////////////////////////

        const db = new sqlite3.Database(dbFile);

        db.serialize(() => {

          db.run('CREATE TABLE if not exists my_table (' +
          '`run_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
          '`result`)');
          // Insert some data using a statement:
          let obj_arr = [];
          const statement = db.prepare('INSERT INTO `my_table` (`result`) VALUES (?)');
             for (let row = 0; row < last_arr.length; ++row){
               obj_arr.push(`
{ROW: ${row +1}, USER: ${last_arr[row][0]}, PID: ${last_arr[row][1]}, COMMAND: ${last_arr[row][2]}}`);
               }
               statement.run(`${obj_arr}`);

               statement.finalize();

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
////////////////////////////////////////////////////////////////////////////////////////////
     });
   });
 }
command_ps();
