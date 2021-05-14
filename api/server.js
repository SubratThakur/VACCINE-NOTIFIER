const express = require('express');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const path = require('path');
const fetch = require('node-fetch');
const app = express(),
      bodyParser = require("body-parser");
      port = process.env.PORT?parseInt(process.env.PORT, 10):80;
//const __dirname = path.resolve();

// place holder for the data
let users = [
];

let userMap = {};

schedule.scheduleJob('*/1 * * * *', async function(){
  console.log('Job to check slot at ' + new Date());
  if(users.length>0){
    await findSlot();
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
  console.log(districtId+ ' :' +reqDate);
  const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${reqDate}`
  console.log(url);
  try{
    const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json','User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        })
    console.log(response);
    const resp = await response.json();
    console.log('Center Responce: '+resp);  
    return resp;
  } catch(e){
    console.log(e);
  }
}
  
async function findSlot() {
  userData = userMap;
  console.log(`User map : ${JSON.stringify(userData)}`);
  for (const key of Object.entries(userData)) {
    let notifyUser = false;
    var input=key[0].split("_");
    var result = key[1];
    var districtId= input[0];
    var age= input[1];
    var mailbody = `Hey ! Vaccination slot is now available for age group ${age} at ${result[0].district.label} (${result[0].state.label}) at below centers and dates : \n`
    var data = await dataFetch(districtId,age);
    for (var i=0;i < data.centers.length;i++){
      var subdata = data.centers[i];
      for (var j=0;j < subdata.sessions.length;j++) {
        var sessiondata = subdata.sessions[j];
        if(sessiondata.min_age_limit == age && sessiondata.available_capacity >0) {
            console.log('Slots available for following locations:' , subdata.name , subdata.state_name , subdata.district_name , subdata.pincode , sessiondata.date);
            mailbody = `${mailbody} \n ${subdata.name} on ${sessiondata.date} : available count =  ${sessiondata.available_capacity}\n`
            notifyUser = true;
        }
      }
    }
    if(notifyUser){
      result.forEach((user)=>{
        console.log(user.email);
        sendMail(user.email, mailbody)
      })
    }
  }
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


function sendMail(toAddress, mailbody){
    mailOptions.to = toAddress;
    mailOptions.text = `${mailbody} \n\n\n <b>Please unsubscribe to stop receiving further e-mails!</b>`;
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
};
