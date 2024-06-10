const express = require('express');
const {
    uploadFile,
    handleFileUpload,
    getFile,
    deleteFile,
} = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/upload', uploadFile, handleFileUpload);
router.post('/upload/private', authMiddleware, uploadFile, (req, res, next) => {
    req.body.isPublic = false;
    next();
}, handleFileUpload);
router.get('/:filename', getFile); // Không cần authMiddleware cho việc lấy file
router.delete('/:filename', authMiddleware, deleteFile);

module.exports = router;