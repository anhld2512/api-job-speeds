const mongoose = require('mongoose');
const { Schema } = mongoose;

const applySchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: false },
  phone: { type: String, required: true },
  coverLetter: { type: String, required: false },
  urlCV: { type: String, required: false },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create indexes for efficient searching
applySchema.index({ fullName: 1 });
applySchema.index({ email: 1 });
applySchema.index({ phone: 1 });

// Middleware to update the updatedAt field
applySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

applySchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Apply = mongoose.model('Apply', applySchema);

module.exports = Apply;
