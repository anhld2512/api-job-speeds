const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true cho 465, false cho các cổng khác
  auth: {
    user: process.env.EMAIL_USER, // địa chỉ email của bạn (ví dụ: info@jobspeeds.com)
    pass: process.env.EMAIL_PASS // mật khẩu email của bạn
  },
});

const smtpSendEmail = async (to, subject) => {
    try {
      console.log('Rendering email template...');
  
      const mailOptions = {
        from: process.env.EMAIL_FROM, // Sử dụng địa chỉ email bạn muốn gửi từ
        to,
        subject,
        html: `<html>
<head>
  <title>Email Template</title>
</head>
<body>
  <p>This is a test email sent from our Node.js application.</p>
</body>
</html>`,
      };
  
      console.log('Sending email...');
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

module.exports = smtpSendEmail;