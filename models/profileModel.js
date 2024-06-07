// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  role: {
    type: String,
    enum: ['Employer', 'Recuiter','Admin'],
    required: true,
    default:'Employer'
  },
  avatar: {
    type: String,
    default: ''
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      default: ''
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Other'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt field before save
profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
