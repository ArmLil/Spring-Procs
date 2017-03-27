'use strict'

const express = require('express');
const sqlite = require('sqlite');
const child = require('child_process');

const spring = express();

spring.post('/check-procs', (req, res) => {
  res.end();
})
