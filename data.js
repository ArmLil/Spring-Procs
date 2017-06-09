'use strict'

const child = require('child_process');
const exec = require('child_process').exec;

module.exports.command_who = async() => {
		return new Promise((resolve, reject) => {
				exec('whoami', (err, stdout, stderr) => {
					if (err) {
						return reject(err);
					}
          //const user = stdout.substr(0, stdout.indexOf('\n'));
					const user = stdout.trim();
					resolve(user);
				});
			});
		}
/*
		module.exports.command_who = async() => {
			const user = child.spawn('whoami');
			return new Promise((resolve, reject) => {
					const str_arr = [];
					user.stdout.on('data', d => {
						if (typeof user === 'undefined') reject(new Error('Opps.'))
						else {
							str_arr.push(d);
							resolve(str_arr);
						}
					});
				})
				.then((arr) => {
					return new Promise((resolve, reject) => {
						user.stdout.on('end', () => {
							arr = Buffer.concat(arr).toString();
							const user_name = arr.substr(0, arr.indexOf('\n'));
							resolve(user_name);
						});
					});
				});
		};
*/

		module.exports.command_ps_aux = async(user) => {
			const ps = child.spawn('ps', ['aux']);

			return new Promise((resolve, reject) => {
					const str_arr = [];
					ps.stdout.on('data', d => {
						str_arr.push(d);
						resolve(str_arr)
					});
				})
				.then((_arr) => {
					return new Promise((resolve, reject) => {
						ps.stdout.on('end', () => {
							_arr = Buffer.concat(_arr).toString().split('\n');
							let filt_arr_1 = [];
							filt_arr_1 = _arr.filter(str => {
								const f_word = str.substr(0, str.indexOf(' '));
								return ((user !== f_word) && (f_word !== 'root'));
							});
							resolve(filt_arr_1);
						});
					});
				}) //here we can catch the errors
		};


		module.exports.arr_rows = async(arr) => {
			const filt_arr = [];

			for (let str of arr) {
				str = str.replace(/\s+/g, ' ').trim().split(' ');
				filt_arr.push(str);
			}
			const i_pName = filt_arr[0].findIndex(s => s === 'USER');
			const i_pid = filt_arr[0].findIndex(s => s === 'PID');
			const i_command = filt_arr[0].findIndex(s => s === 'COMMAND');

			const last_arr = [];
			for (let row of filt_arr) {
				row = row.filter(e => (row.indexOf(e) === i_pName) ||
					(row.indexOf(e) === i_pid) ||
					(row.indexOf(e) === i_command));
				last_arr.push(row);
			}
			last_arr.pop();
			last_arr.shift();
			return last_arr;
		};
