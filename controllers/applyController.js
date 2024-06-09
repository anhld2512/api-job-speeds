const Apply = require('../models/applyModel');
const Job = require('../models/jobModel'); // Assuming you have a Job model
const sendEmail = require('../service/Email/emailService');

// Create a new application
const createApplication = async (req, res) => {
    try {
    
      const newApplication = new Apply(req.body);
      const savedApplication = await newApplication.save();
      
      // Get job details to send email
      const job = await Job.findById(savedApplication.jobId).populate('contact');
      res.status(201).json({result:true,savedApplication});
      if (job) {
        await sendEmail(savedApplication, job);
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Get all applications
const getApplications = async (req, res) => {
  try {
    const applications = await Apply.find().populate('jobId').populate('userId');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single application by ID
const getApplicationById = async (req, res) => {
  try {
    const application = await Apply.findById(req.params.id).populate('jobId').populate('userId');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an application
const updateApplication = async (req, res) => {
  try {
    const updatedApplication = await Apply.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedApplication) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an application
const deleteApplication = async (req, res) => {
  try {
    const deletedApplication = await Apply.findByIdAndDelete(req.params.id);
    if (!deletedApplication) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filter applications
const filterApplications = async (req, res) => {
  try {
    const { fullName, email, phone } = req.query;
    const query = {};

    if (fullName) {
      query.fullName = { $regex: fullName, $options: 'i' }; // case-insensitive regex search
    }
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }
    if (phone) {
      query.phone = { $regex: phone, $options: 'i' };
    }

    const applications = await Apply.find(query).populate('jobId').populate('userId');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  filterApplications // Add the new filter function here
};
