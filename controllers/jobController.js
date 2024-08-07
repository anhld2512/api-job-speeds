const Job = require('../models/jobModel');
const Profile = require("../models/profileModel");

// Create a new job
exports.createJob = async (req, res) => {
    try {
        const { userId } = '6690faecc5f8c34ca2d09909';
        
      
        // Fetch user profile asynchronously
        const profileDetail = await Profile.findOne({userId:'6690faecc5f8c34ca2d09909'});

        if (!profileDetail) {
            return res.status(404).json({ error: "User not found" });
        }
        const profile = {
            name: profileDetail.personalInfo.fullName,
            email: profileDetail.personalInfo.email,
            phone: profileDetail.personalInfo.phone,
            company: req.body.contact.company,
            address: profileDetail.personalInfo.address,
            avatar: profileDetail.avatar
        };
       
        const jobData = {
            ...req.body,
            userId:'6690faecc5f8c34ca2d09909',
            contact: profile,
            jobStatus: 'active' // Set initial job status to active
        };
        console.log(jobData)
        // Create and save the job
        const job = new Job(jobData);
        await job.save();

        res.status(201).json({result:true,data:job});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json({result: true, data: job});
    } catch (error) {
        res.status(500).json({result: false, error: error.message });
    }
};

// Update a job by ID
exports.updateJobById = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json({result: true, data: job});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a job by ID
exports.deleteJobById = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id,{jobStatus:'closed'});
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(204).json({result:true, message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Filter jobs
exports.filterJobs = async (req, res) => {
    const limit = parseInt(req.body.limit) || 12;
    const skip = parseInt(req.body.skip) || 0;
    const search = req.body.data?.search || null;
    const jobCategory = req.body.data?.filter?.jobCategory ?? null;
    const jobTyped = req.body.data?.filter?.jobTyped ?? null;
    const jobName = req.body.data?.filter?.jobName ?? null;

    const filter = { jobStatus: 'active' };

    if (search) {
        filter.$text = { $search: search };
    } else {
        if (jobCategory) {
            filter.jobCategory = jobCategory;
        }
        if (jobTyped) {
            filter.jobTyped = jobTyped;
        }
        if (jobName) {
            filter.jobName = new RegExp(jobName, 'i');
        }
    }

    try {
        // Projection để chỉ lấy các trường cần thiết
        const projection = {
            _id: 1,
            jobTitle: 1,
            jobDescription: 1,
            jobCategory: 1,
            jobTyped: 1,
            jobName: 1,
            dateCreated: 1,
            jobSkills: 1,
            'contact.company': 1,
            jobImageUrl: 1,
        };

        const jobsPromise = Job.find(filter, projection)
            .limit(limit)
            .skip(skip)
            .sort({ dateCreated: -1 });

        const countPromise = Job.countDocuments(filter);

        // Wait for all promises to complete
        const [jobs, count] = await Promise.all([
            jobsPromise,
            countPromise
        ]);

        res.status(200).json({
            result: true,
            data: jobs,
            count: count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDistinctValues = async (req, res) => {
    const { field } = req.query; // Lấy trường cần lấy giá trị phân biệt từ query params

    if (!field) {
        return res.status(400).json({ error: 'Field query parameter is required' });
    }

    const validFields = ['jobCategory', 'jobName', 'jobTyped'];
    if (!validFields.includes(field)) {
        return res.status(400).json({ error: 'Invalid field parameter' });
    }

    try {
        const distinctValues = await Job.find({ jobStatus: 'active' }).distinct(field);

        res.status(200).json({
            result: true,
            data: distinctValues
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};