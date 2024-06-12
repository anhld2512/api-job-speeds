const path = require("path");
const fs = require("fs");
const multer = require("multer");
const mime = require("mime-types");
const { v4: uuidv4 } = require("uuid");
const File = require("../models/File");

// Define paths for public and private directories
const uploadsDir = path.join(__dirname, "../uploads");
const publicDir = path.join(uploadsDir, "public");
const privateDir = path.join(uploadsDir, "private");

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
    const isPublic = req.body.isPublic !== "false"; // Default is public
    const uploadPath = isPublic ? publicDir : privateDir;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    let originalname = file.originalname.trim().replace(/\s+/g, "_");
    const fileExtension = path.extname(originalname);
    const defaultExtension = mime.extension(file.mimetype);
    // If file doesn't have an extension, use default based on MIME type
    if (!fileExtension) {
      originalname += `.${defaultExtension || "bin"}`;
    }

    // Generate a unique filename using uuidv4
    const uniqueFilename = `${uuidv4()}.${defaultExtension}`;
    cb(null, uniqueFilename);
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter,
});

// Middleware to handle file upload
exports.uploadFile = upload.single("file");

// Controller to handle file upload
exports.handleFileUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const isPublic = req.body.isPublic !== "false"; // Default is public
  const userId = req.body.userId || null; // userId could be null
  const allowedUsers = req.body.allowedUsers || [];
  const newFile = new File({
    filename: req.file.filename, // Save full filename including extension
    userId: userId,
    isPublic: isPublic,
    allowedUsers: allowedUsers,
    path: req.file.path,
  });

  await newFile.save();

  const fileUrl = `${req.protocol}://${req.get("host")}/api/files/file/${
    req.file.filename
  }`;
  delete req.file.path
  res.status(201).json({ result: true, file: req.file, fileUrl });
};

// Middleware to check file access
const jwt = require("jsonwebtoken");

exports.checkFileAccess = async (req, res, next) => {
  try {
    // Trích xuất token từ yêu cầu

    const filename = req.params.filename;
    const file = await File.findOne({ filename: filename }); // Tìm tệp tin bằng tên file (bao gồm cả phần mở rộng)
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Nếu là tệp tin công khai, không cần kiểm tra, trả kết quả luôn
    if (file.isPublic) {
      req.filePath = file.path; // Lưu đường dẫn của tệp tin trong yêu cầu
      return next();
    } else {
      const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized: No token provided" });
      }

      // Xác thực token để lấy thông tin userId
      const decoded = jwt.verify(
        token,
        "yourjwtsecret-sone-team-project-job-tool"
      );
      const userId = decoded.id;
    }

    // Kiểm tra quyền truy cập
    const isAllowed =
      userId &&
      (userId === file.userId?.toString() ||
        file.allowedUsers.includes(userId));
    if (!isAllowed) {
      return res.status(403).json({ error: "Access denied" });
    }

    req.filePath = file.path; // Lưu đường dẫn của tệp tin trong yêu cầu
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Controller to return file URL
exports.getFileUrl = async (req, res) => {
  try {
    // Find the file in the database using the filename from the request parameters
    const file = await File.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ error: "File not found in database" });
    }

    // Use the file path directly from the database as it is already an absolute path
    const filePath = file.path;

    // Debugging output to check file path
    console.log('File path from database:', filePath);

    // Check if the file exists on the server
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    // Set the content type based on the file's MIME type or infer it from the file extension
    const mimeType = file.mimeType || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);

    // Set the Content-Disposition header to 'inline' to allow the file to be viewed in the browser
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);

    // Set caching headers to ensure the browser does not cache the file
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Create a readable stream for the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Handle any errors that occur while reading the file
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      res.status(500).json({ error: 'Error reading file' });
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
};
// Controller to delete file
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (req.user && req.user.id !== file.userId?.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    fs.unlinkSync(file.path);
    await File.deleteOne({ filename: req.params.filename });

    res.status(204).json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
