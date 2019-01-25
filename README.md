# Spring-Procs
This backend project is to get the result from shell via Child Processes 'ps aux' and 'whoamI', then to filter the result by taking only the rows without  'root' and 'username'  , as well as it does other filtrations...
 It uses sqlite db, node.js, Express frameworks...

There are two branches
1. master - it is implemented with callbacks...
2. refactor - it uses promises, async, await ...

to run this you need to do these commands in terminal

1. git clone https://github.com/ArmLil/Spring-Procs.git
2. cd Spring-Procs
3. npm install
4. node index.js
