const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    jobName: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: false
    },
    jobSalary: {
        type: String,
        required: false
    },
    jobLocation: {
        type: String,
        required: false
    },
    jobTyped: {
        type: String,
        required: true
    },
    jobCategory: {
        type: String,
        required: true
    },
    jobSkills: {
        type: [String],
        required: false
    },
    dateExpired: {
        type: Date,
        required: false,
        default: function() {
            const now = new Date();
            now.setDate(now.getDate() + 30); // Set default expiration to 30 days from now
            return now;
        }
    },
    jobStatus: {
        type: String,
        enum: ['active', 'closed', 'expired'],
        default: 'active'
    },
    jobImageUrl: String,
    jobAttachmentUrl: String,
    Responsibilities: String,
    Requirements: String,
    contact: {
        name: String,
        email: String,
        phone: String,
        address: String,
        avatar: String,
        company:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Middleware to update job status to 'expired' if dateExpired has passed
jobSchema.pre('save', function(next) {
    if (new Date(this.dateExpired) < new Date()) {
        this.jobStatus = 'expired';
    }
    next();
});
jobSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  jobSchema.index({ jobName: 'text', jobCategory: 'text', jobLocation: 'text' });

module.exports = mongoose.model('Job', jobSchema);