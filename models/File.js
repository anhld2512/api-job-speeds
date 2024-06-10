const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    filename: { type: String, required: true },
    userId: { type: String,},
    isPublic: { type: Boolean, default: true },
    allowedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', fileSchema);