const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
router.get("/",function(req,res){
    res.send("abc")
})
// Route để upload file
router.post('/upload', fileController.uploadFile, fileController.handleFileUpload);

// Route để xử lý hiển thị file
router.get('/file/:filename', fileController.checkFileAccess, fileController.getFileUrl);

// Route để xử lý xóa file
router.delete('/:filename', fileController.deleteFile);

module.exports = router;
