const Job = require('../models/jobModel');
const Profile = require("../models/profileModel");

// Create a new job
exports.createJob = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "Profile ID is required" });
        }

        // Fetch user profile asynchronously
        const profileDetail = await Profile.findOne({userId:userId});

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
            contact: profile,
            jobStatus: 'active' // Set initial job status to active
        };
       
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
        res.status(500).json({ error: error.message });
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
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(204).json({ message: 'Job deleted' });
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
    const jobTyped = req.body.data?.filter?.jobTyped ?? null; // Ensure this matches the schema field
    const jobName = req.body.data?.filter?.jobName ?? null;

    const filter = { jobStatus: 'active' };

    if (search) {
        filter.$text = { $search: search };
    } else {
        if (jobCategory) {
            filter.jobCategory = jobCategory;
        }
        if (jobTyped) {
            filter.jobTyped = jobTyped; // Ensure this matches the schema field
        }
        if (jobName) {
            filter.jobName = new RegExp(jobName, 'i'); // Use regex for partial match
        }
    }

    try {
        const jobsPromise = Job.find(filter) // Project only necessary fields
            .limit(limit)
            .skip(skip)
            .sort({ dateCreated: -1 });

        const countPromise = Job.countDocuments(filter);

        // Aggregation pipeline to get distinct values
        const distinctJobNamesPromise = Job.aggregate([
            { $match: { jobStatus: 'active' } },
            { $group: { _id: '$jobName' } },
            { $sort: { _id: 1 } },
            { $limit: 100 },
            { $project: { _id: 0, jobName: '$_id' } }
        ]).exec();

        const distinctJobCategoriesPromise = Job.aggregate([
            { $match: { jobStatus: 'active' } },
            { $group: { _id: '$jobCategory' } },
            { $sort: { _id: 1 } },
            { $limit: 100 },
            { $project: { _id: 0, jobCategory: '$_id' } }
        ]).exec();

        const distinctJobTypesPromise = Job.aggregate([
            { $match: { jobStatus: 'active' } },
            { $group: { _id: '$jobTyped' } },
            { $sort: { _id: 1 } },
            { $limit: 100 },
            { $project: { _id: 0, jobTyped: '$_id' } }
        ]).exec();

        // Wait for all promises to complete
        const [jobs, count, distinctJobNames, distinctJobCategories, distinctJobTypes] = await Promise.all([
            jobsPromise,
            countPromise,
            distinctJobNamesPromise,
            distinctJobCategoriesPromise,
            distinctJobTypesPromise
        ]);

        const FilterModel = {
            JobNames: distinctJobNames.map(doc => doc.jobName),
            JobCategories: distinctJobCategories.map(doc => doc.jobCategory),
            JobTyped: distinctJobTypes.map(doc => doc.jobTyped)
        };

        res.status(200).json({
            result: true,
            data: jobs,
            count: count,
            FilterModel: FilterModel
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};