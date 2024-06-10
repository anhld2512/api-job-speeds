const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mime = require('mime-types');
const File = require('../models/File');

// Define paths for public and private directories
const uploadsDir = path.join(__dirname, '../uploads');
const publicDir = path.join(uploadsDir, 'public');
const privateDir = path.join(uploadsDir, 'private');

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
        const isPublic = req.body.isPublic !== 'false'; // Mặc định là công khai
        const uploadPath = isPublic ? publicDir : privateDir;
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        let originalname = file.originalname.trim().replace(/\s+/g, '_');
        const fileExtension = path.extname(originalname);
        
        // Nếu file không có phần mở rộng, xác định loại file và thêm phần mở rộng
        if (!fileExtension) {
            const mimeType = file.mimetype;
            const extension = mime.extension(mimeType);
            if (extension) {
                originalname = `${originalname}.${extension}`;
            }
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + originalname);
    }
});

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file 10MB
    fileFilter
});

// Middleware to handle file upload
exports.uploadFile = upload.single('file');

// Controller to handle file upload
exports.handleFileUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const isPublic = req.body.isPublic !== 'false'; // Mặc định là công khai
    const userId = req.body.userId || null; // userId có thể là null
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

        const userId = req.user ? req.user.id : null;
        const isAllowed = file.isPublic || (userId && (userId === file.userId?.toString() || file.allowedUsers.includes(userId)));
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