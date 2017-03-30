'use strict'

const express = require('express');
const sqlite = require('sqlite');
const child = require('child_process');

const spring = express();

spring.post('/check-procs', (req, res) => {
})

const get_row_obj =  (index_row, array) => {
  let string = '';
  //we need to have the first word of
  // each row for further filtering
  let first_word = '';
  let numb = index_row;

  do{
    first_word += array[numb++];
  }while(array[numb] !== ' ')

  do{
    string += array[index_row++];//get the row
  }while(array[index_row] !== '\n')
  // index_row shows the last index of each row
  let result = [++index_row, first_word, string];
  return result;
};


const command_who = () => {
  const user = child.spawn('whoami');
  let array = [];
  user.stdout.on('data', (data) => {
    array.push(data);
  });

  user.stdout.on('end', () => {
    array = Buffer.concat(array).toString();
    let numb = 0;
    let user_name = '';
    do{
      user_name += array[numb++];
    }while(array[numb] !== '\n')
  });
 }

 const command_ps = () => {
   const ps = child.spawn('ps',['aux']);
   let array = [];
   ps.stdout.on('data', (data) => {
       array.push(data);
   });
   ps.stdout.on('end', () => {
     array = Buffer.concat(array).toString();
     let array_of_rows = [];
     let index_row = 0;
     let str_obj = [];
     do{
       str_obj = get_row_obj(index_row, array);
       //here need to compare with the result of whoami not with 'lilo'
       //str_obj[1] is the first word of the row,
       // str_obj[0] is first index of each row
       if(str_obj[1] !== 'lilo' && str_obj[1] !== 'root'){
          array_of_rows.push(str_obj[2]);
       }
       index_row = str_obj[0];
     }while(index_row < array.length);

     //for(const a of array_of_rows){
       //console.log(`${a}\n`);
     //}
   });
 }
