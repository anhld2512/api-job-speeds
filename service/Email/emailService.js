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

const sendEmail = async (applicant, job) => {
  const { fullName, email, coverLetter, urlCV, phone ,address} = applicant;
  const { contact, jobImageUrl, jobAttachmentUrl, jobName } = job;

  const applicantTemplatePath = path.join(__dirname, './template/templateApplicant.ejs');
  const jobCreatorTemplatePath = path.join(__dirname, './template/templateJobCreator.ejs');

  // Render email for applicant
  const applicantEmailTemplate = await ejs.renderFile(applicantTemplatePath, {
    fullName,
    jobTitle: jobName,
    coverLetter,
    urlCV,
    phone,
    email,
    address,
    contactEmail: contact.email,
    companyName: contact.company,
    currentYear: new Date().getFullYear()
  });

  // Render email for job creator
  const jobCreatorEmailTemplate = await ejs.renderFile(jobCreatorTemplatePath, {
    contactName: contact.name, // Assuming `contact` has a `name` field
    fullName,
    email,
    phone,
    jobTitle: jobName,
    coverLetter,
    urlCV,
    address,
    companyName: contact.company,
    currentYear: new Date().getFullYear()
  });

  const applicantMailOptions = {
    from: process.env.EMAIL_FROM,
    to: email, 
    subject: 'Application Received',
    html: applicantEmailTemplate,
    attachments: []
  };

  const jobCreatorMailOptions = {
    from: process.env.EMAIL_FROM,
    to: contact.email, // Send email to job creator
    subject: 'New Application Received',
    html: jobCreatorEmailTemplate,
    attachments: []
  };
  if(urlCV){
    jobCreatorMailOptions.attachments.push({
        filename: 'Job Description.pdf',
        path: urlCV
      });
  }
  if (jobImageUrl) {
    applicantMailOptions.attachments.push({
      filename: 'Image.jpg',
      path: jobImageUrl
    });
    jobCreatorMailOptions.attachments.push({
      filename: 'Image.jpg',
      path: jobImageUrl
    });
  }

  if (jobAttachmentUrl) {
    applicantMailOptions.attachments.push({
      filename: 'CA Application.pdf',
      path: jobAttachmentUrl
    });
    jobCreatorMailOptions.attachments.push({
      filename: 'CV Application.pdf',
      path: jobAttachmentUrl
    });
  }

  try {
    await transporter.sendMail(applicantMailOptions);
    await transporter.sendMail(jobCreatorMailOptions);
    console.log('Emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
};

module.exports = sendEmail;
