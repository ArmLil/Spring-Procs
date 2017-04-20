'use strict'

const express = require('express');
const sqlite = require('sqlite');
const child = require('child_process');

const spring = express();

spring.post('/check-procs', (req, res) => {
})
/////////////////////////////////////////////////////////////////////

const sqlite3     = require('sqlite3').verbose();
const fs          = require('fs');
const dbFile = './database.db';
const dbExists = fs.existsSync(dbFile);
if(!dbExists)  fs.openSync(dbFile, 'w');

////////////////////////////////////////////////////////////////////

const calling = (el, cb) =>{
  if (typeof cb === "function"){
    return cb(el);
  }
}

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

 const command_ps = (cb) => {
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
       filt_arr = calling(filt_arr, arr_rows);

       //console.log(filt_arr);
       const i_pName = filt_arr[0].findIndex(s => s === 'USER');
       const i_pid = filt_arr[0].findIndex(s => s === 'PID');
       const i_command = filt_arr[0].findIndex(s => s === 'COMMAND');
       const last_arr = [];
       for (let row of filt_arr){
         row = row.filter(e => (row.indexOf(e) == i_pName) ||
                               (row.indexOf(e) == i_pid) ||
                              (row.indexOf(e) == i_command));
        last_arr.push(row);
       }
       last_arr.pop();
       last_arr.shift();
       //console.log(last_arr);
       //const json_array = JSON.stringify(last_arr);
       //console.log(json_array);
///////////////////////////////////////////////////////////////////////////////////////

        const db = new sqlite3.Database(dbFile);
        db.serialize(() => {

          db.run('CREATE TABLE if not exists my_table (' +
          '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,' +
          '`user` TEXT,' +
          '`pid` INTEGER,' +
          '`command` TEXT)');
          // Insert some data using a statement:

          const statement = db.prepare('INSERT INTO `my_table` (`user`, `pid`, `command`) ' +
          'VALUES (?, ?, ?)');
             for (let row = 0; row < last_arr.length; ++row){
               statement.run(last_arr[row][0], last_arr[row][1], last_arr[row][2]);
               }

              statement.finalize();
              db.each("SELECT * FROM my_table", (err, row) => {
                console.log(row);
            });
              // Close the database:
              db.close();
        });
////////////////////////////////////////////////////////////////////////////////////////////

        return cb(last_arr);
     })
   });
 }
 command_ps(e => console.log(e));
