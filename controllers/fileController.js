const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const multer = require('multer');
const storage = require('../config/gridFsStorage');
const File = require('../models/File');
const upload = multer({ storage });

const conn = mongoose.connection;
let gridfsBucket;

conn.once('open', () => {
    gridfsBucket = new GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
});

exports.uploadFile = upload.single('file');

exports.handleFileUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const isPublic = req.body.isPublic !== undefined ? req.body.isPublic : true;
    const allowedUsers = req.body.allowedUsers || [];
    const newFile = new File({
        filename: req.file.filename,
        userId: req.user.id,
        isPublic: isPublic,
        allowedUsers: allowedUsers
    });

    await newFile.save();

    const host = req.get('host');
    // const fileUrl = `${req.protocol}://${host}/api/files/${req.file.filename}
    const fileUrl = `https://api.jobspeeds.com/api/files/${req.file.filename}`
    res.status(201).json({result:true, file: req.file, fileUrl });
};

exports.getFile = async (req, res) => {
    try {
        console.log(req.params.filename)
        const file = await File.findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const isAllowed = file.isPublic || req.user.id === file.userId.toString() || file.allowedUsers.includes(req.user.id);

        if (!isAllowed) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const readstream = gridfsBucket.openDownloadStreamByName(req.params.filename);
        readstream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const file = await File.findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        if (req.user.id !== file.userId.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await gridfsBucket.delete(file._id);
        await File.deleteOne({ filename: req.params.filename });

        res.status(204).json({ message: 'File deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};