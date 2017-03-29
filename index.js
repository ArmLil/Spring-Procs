'use strict'

const express = require('express');
const sqlite = require('sqlite');
const child = require('child_process');
//const events = require('events');

const spring = express();

spring.post('/check-procs', (req, res) => {

})

const command_who = () => {
  const user = child.spawn('whoami');
  let array = [];
  user.stdout.on('data', (data) => {
    array.push(data);
  });
  user.stdout.on('end', () => {
    array = Buffer.concat(array).toString();
    console.log('This is the end');
    console.log(array);
  });
 }

 command_who();

  const command_ps = () => {
  const ps = child.spawn('ps',['aux']);
  let array = [];
  ps.stdout.on('data', (data) => {
      array.push(data);
  });
  ps.stdout.on('end', () => {
    array = Buffer.concat(array).toString();
    console.log(array);
     console.log(`${array[0]}\n${array[1]}`);
  });
}
  command_ps();
