'use strict'

const express = require('express');
const sqlite = require('sqlite');
const child = require('child_process');

const spring = express();

spring.post('/check-procs', (req, res) => {
})

const calling = (el, cb) =>{
  if (typeof cb === "function"){
    return cb(el);
  }
}

const arr_rows = (arr) => {
  let filt_arr = [];
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
    let user_name = str_arr.substr(0, str_arr.indexOf('\n'));
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

       filt_arr = calling(filt_arr, arr_rows);

       const i_pName = filt_arr[0].findIndex(s => s === 'USER');
       const i_pid = filt_arr[0].findIndex(s => s === 'PID');
       const i_command = filt_arr[0].findIndex(s => s === 'COMMAND');
       let last_arr = [];
       for (let row of filt_arr){
         row = row.filter(e => (row.indexOf(e) == i_pName) ||
                               (row.indexOf(e) == i_pid) ||
                              (row.indexOf(e) == i_command));
         last_arr.push(row);
       }
       console.log(last_arr);
     })
   });
 }
 command_ps();
