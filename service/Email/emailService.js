const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services or SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (applicant, job) => {
    console.log(applicant, job)
  const { fullName, email, coverLetter, urlCV, phone } = applicant;
  const { contact, jobImageUrl, jobAttachmentUrl, title, company } = job;

  const applicantTemplatePath = path.join(__dirname, './views/ViewsEmail/applicantEmailTemplate.ejs');
  const jobCreatorTemplatePath = path.join(__dirname, './views/ViewsEmail/jobCreatorEmailTemplate.ejs');

  // Render email for applicant
  const applicantEmailTemplate = await ejs.renderFile(applicantTemplatePath, {
    fullName,
    jobTitle: title,
    coverLetter,
    urlCV,
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
    jobTitle: title,
    coverLetter,
    urlCV,
    companyName: contact.company,
    currentYear: new Date().getFullYear()
  });

  const applicantMailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // Send email to applicant
    subject: 'Job Application Received',
    html: applicantEmailTemplate,
    attachments: []
  };

  const jobCreatorMailOptions = {
    from: process.env.EMAIL_USER,
    to: contact.email, // Send email to job creator
    subject: 'New Job Application Received',
    html: jobCreatorEmailTemplate,
    attachments: []
  };

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
      filename: 'Job Description.pdf',
      path: jobAttachmentUrl
    });
    jobCreatorMailOptions.attachments.push({
      filename: 'Job Description.pdf',
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
