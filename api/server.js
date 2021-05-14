const express = require('express');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const path = require('path');
const fetch = require('node-fetch');
const _ = require('lodash');
const app = express(),
      bodyParser = require("body-parser");
      port = process.env.PORT?parseInt(process.env.PORT, 10):80;
const __dirname = path.resolve();

// place holder for the data
let users = [
];

let userMap = {};

schedule.scheduleJob('*/1 * * * *', function(){
  console.log('Job to check slot at ' + new Date());
  if(users.length>0){
    findSlot(userMap);
  }
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/users', (req, res) => {
  console.log('api/users called!')
  res.json(users);
});

app.get('/api/users/map', (req, res) => {
  console.log('api/users/map called!')
  res.json(userMap);
});

app.post('/api/users', (req, res) => {
  users = JSON.parse(req.body);
});

app.post('/api/users/map', (req, res) => {
  userMap = JSON.parse(req.body);
});

app.post('/api/user', (req, res) => {
  const user = req.body.user;
  console.log('Adding user:::::', user);
  users.push(user);
  const districtId = user.district.value;
  user.filter.age.forEach((age)=>{
    var key = `${districtId}_${age}`;
    if(key in userMap){
      userMap[key].push(user);
    } else {
      userMap[key]= [user];
    }
  });
  res.json("user addedd");
});
var userData = {};
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

const dataFetch = async (districtId,age) => {
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth()+1; 
  const yyyy = today.getFullYear();
  const reqDate = `${dd}-${mm}-${yyyy}`
  console.log(reqDate);
  const response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${reqDate}`, {
          method: 'GET',
          headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
      })
  const resp = await response.json();   
  return resp;
}
  
function findSlot(userMap) {
  userData = userMap;
  userData.forEach(function(value, key) {
      console.log(key)
      var input=key.split("-");
      var districtId= input[0];
      var age= input[1];
      var data = dataFetch(districtId,age);
      data.then((data)=>{
      for (var i=0;i < data.centers.length;i++){
          var subdata = data.centers[i];
              for (var j=0;j < subdata.sessions.length;j++) {
                  var sessiondata = subdata.sessions[j];
                  if(sessiondata.min_age_limit == age && sessiondata.available_capacity >0) {
                      console.log('Slots available for following locations:' , subdata.name , subdata.state_name , subdata.district_name , subdata.pincode , sessiondata.date);
                      notify(key,subdata.district_name,sessiondata.min_age_limit,sessiondata.date);
                  }
              }
      }})
  })
}

function notify(key,districtName,age,date) {
  var result = userData.get(key);
  result.forEach((user)=>{
      console.log(user.email);
      sendMail(user.email, {districtName,age,date})
  })
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'turvoshipment@gmail.com',
    pass: 'turvoshiper@007'
  }
});

const mailOptions = {
  from: 'turvoshipment@gmail.com',
  to: '',
  subject: 'New Slot for vaccination available in your area! Hurry up!',
  text: ''
};


function sendMail(toAddress, metadata){
    mailOptions.to = toAddress;
    mailOptions.text = `Hey ! Vaccination slot is now available for age group ${metadata.age} at district ${metadata.districtName} on date ${metadata.date}`;
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
};
