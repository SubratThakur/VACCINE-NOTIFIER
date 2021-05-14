var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'turvoshipment@gmail.com',
    pass: 'turvoshiper@007'
  }
});

var mailOptions = {
  from: 'turvoshipment@gmail.com',
  to: '',
  subject: 'New Slot for vaccination available in your area! Hurry up!',
  text: ''
};


export default function sendMail(toAddress, body){
    mailOptions.to = toAddress;
    mailOptions.text = body;
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
};
