'use strict'

const express = require('express');
const sqlite = require('sqlite');
const child = require('child_process');

const spring = express();

spring.post('/check-procs', (req, res) => {
})

const get_row_obj =  (i_row, arr) => {
  //we need to have the first word of each row for further filtering
  let str = '', f_word = '', n = i_row;
  do{
    f_word += arr[n++];
  }while(arr[n] !== ' ')
  do{
    str += arr[i_row++];//get the row
  }while(arr[i_row] !== '\n')
  let result = [++i_row, f_word, str];// i_row is the last index of each row
  return result;
};

const command_who = () => {
  const user = child.spawn('whoami');
  let arr = [];
  user.stdout.on('data', (d) => arr.push(d));
  user.stdout.on('end', () => {
    arr = Buffer.concat(arr).toString();
    let n = 0, user_name = '';
    do{
      user_name += arr[n++];
    }while(arr[n] !== '\n')
    console.log(user_name);
  });
 }
command_who();

const command_ps = () => {
   const ps = child.spawn('ps',['aux']);
   let arr = [];
   ps.stdout.on('data', (d) => arr.push(d));
   ps.stdout.on('end', () => {
     arr = Buffer.concat(arr).toString();
     let arr_row = [], i_row = 0;
     let str_obj = [];
     do{
       str_obj = get_row_obj(i_row, arr);
       //here need to compare with the result of whoami not with 'lilo'
       //str_obj[1] is the first word of the row,
       // str_obj[0] is first index of each row
       if(str_obj[1] !== 'lilo' && str_obj[1] !== 'root')
          arr_row.push(str_obj[2]);
       i_row = str_obj[0];
     }while(i_row < arr.length);

     for(const a of arr_row){
       console.log(`${a}\n`);
     }
   });
 }
 command_ps();
