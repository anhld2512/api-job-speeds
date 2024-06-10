const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // userId là tùy chọn
    isPublic: { type: Boolean, default: true },
    allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    path: { type: String, required: true }
});

module.exports = mongoose.model('File', FileSchema);