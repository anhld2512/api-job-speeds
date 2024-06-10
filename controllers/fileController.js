const path = require('path');
const fs = require('fs');
const multer = require('multer');
const File = require('../models/File');

// Define paths for public and private directories
const publicDir = path.join(__dirname, '../public/uploads');
const privateDir = path.join(__dirname, '../private/uploads');

// Create directories if they do not exist
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(privateDir)) {
    fs.mkdirSync(privateDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isPublic = req.body.isPublic !== undefined ? req.body.isPublic : true;
        const uploadPath = isPublic ? publicDir : privateDir;
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedFilename = file.originalname.trim().replace(/\s+/g, '_');
        cb(null, uniqueSuffix + '-' + sanitizedFilename);
    }
});

const upload = multer({ storage });

// Middleware to handle file upload
exports.uploadFile = upload.single('file');

// Controller to handle file upload
exports.handleFileUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const isPublic = req.body.isPublic !== undefined ? req.body.isPublic : true;
    const userId = req?.user?.id || null; // userId can be null
    const allowedUsers = req.body.allowedUsers || [];
    const newFile = new File({
        filename: req.file.filename,
        userId: userId,
        isPublic: isPublic,
        allowedUsers: allowedUsers,
        path: req.file.path
    });

    await newFile.save();

    const host = req.get('host');
    const fileUrl = `${req.protocol}://${host}/uploads/${isPublic ? 'public' : 'private'}/${req.file.filename}`;
    res.status(201).json({ result: true, file: req.file, fileUrl });
};

// Controller to handle file retrieval
exports.getFile = async (req, res) => {
    try {
        const file = await File.findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const isAllowed = file.isPublic || (req.user && req.user.id === file.userId?.toString()) || file.allowedUsers.includes(req.user?.id);
        if (!isAllowed) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.sendFile(file.path, { root: '.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to handle file deletion
exports.deleteFile = async (req, res) => {
    try {
        const file = await File.findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        if (req.user && req.user.id !== file.userId?.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }
        fs.unlinkSync(file.path);
        await File.deleteOne({ filename: req.params.filename });

        res.status(204).json({ message: 'File deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};