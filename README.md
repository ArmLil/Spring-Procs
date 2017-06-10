# Spring-Procs

This backend project is to get the result from shell via Child Processes 'ps aux' and 'whoamI', then to filter the result by taking only the rows without 'root' and 'username' , as well as it does other filtrations... It uses sqlite db, node.js, Express frameworks... There are two branches

1. master - it is implemented with callbacks...
2. refactor - it uses promises, async, await ...

npm run create-db
npm run start

http://localhost:8080/ (in Firefox the JSON format is more readable)

or
curl localhost:8080
