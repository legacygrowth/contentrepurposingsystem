const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: 'ywxc ibrf ohnb ndgk',//process.env.EMAIL_PASS,
  },
});


const sendEmail = async function (to, subject, body){
  
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: body,
    });

    return true;
    
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = { sendEmail };
