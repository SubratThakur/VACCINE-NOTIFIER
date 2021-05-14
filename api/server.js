const express = require('express');
const path = require('path');
const _ = require('lodash');
const app = express(),
      bodyParser = require("body-parser");
      port = process.env.PORT?parseInt(process.env.PORT, 10):80;
const __dirname = path.resolve();
// place holder for the data
let users = [
];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/users', (req, res) => {
  console.log('api/users called!')
  res.json(users);
});

app.post('/api/user', (req, res) => {
  const user = req.body.user;
  console.log('Adding user:::::', user);
  users.push(user);
  res.json("user addedd");
});

app.delete('/api/user', (req, res) => {
  const user = req.body.user;
  let filteredUser = users;
  console.log('Deleting user:::::', user);
  if(user.district){
    filteredUser = filteredUser.filter((regUser)=>{
      return (regUser.district.label === user.district.label && regUser.state.label === user.state.label && regUser.email === user.email && regUser.phone === user.phone);
    })
  } else if(user.state){
    filteredUser = filteredUser.filter((regUser)=>{
      return !(regUser.state.label === user.state.label && regUser.email === user.email && regUser.phone === user.phone);
    })
  } else if( user.email && user.phone) {
    filteredUser = filteredUser.filter((regUser)=>{
         return !(regUser.email === user.email && regUser.phone === user.phone);
    })
  }
  const count = users.length-filteredUser.length;

  users= filteredUser;

  res.json(count);
});

app.get('/', (req,res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});