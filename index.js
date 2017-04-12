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

const get_first_word = (s) => {
  return s.substr(0, s.indexOf(' '));
};

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

       filt_arr = str_arr.filter((str) => {
         let f_word = str.substr(0, str.indexOf(' '));
         return ((user !== f_word) && (f_word !== 'root'));
       });
       console.log(filt_arr);
     })
   });
 }
 command_ps();


/*
const ps_logic = (result, hhh) => {
  console.log(result);
}

const command_ps = (hhh) => {

  command_who(result => {
    hhh
  });
};
command_ps();*/



    // console.log(str_arr);

     //if(!command_who(f_word)) console.log('done');

     //console.log(str_arr);
    //  for (let a of str_arr){
        //f_word = str_arr.substr(0, str_arr.indexOf(' '));
        //str = str.substr(0, str.indexOf(' '))

        //el = a.replace(/\s+/g,' ').trim();
        //console.log(el);
    //  }
