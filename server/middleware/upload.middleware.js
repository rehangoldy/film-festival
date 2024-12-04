const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
const movieDir = path.join(uploadDir, 'movies');
const thumbnailDir = path.join(uploadDir, 'thumbnails');

[movieDir, thumbnailDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on file type
    const dest = file.fieldname === 'thumbnail' ? thumbnailDir : movieDir;
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    
    // Store the relative path in req.files for later use
    if (!req.uploadedFiles) req.uploadedFiles = {};
    const relativePath = path.join('uploads', file.fieldname === 'thumbnail' ? 'thumbnails' : 'movies', filename);
    req.uploadedFiles[file.fieldname] = relativePath.replace(/\\/g, '/');
    
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'movie') {
    // Accept video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'), false);
    }
  } else if (file.fieldname === 'thumbnail') {
    // Accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// Middleware to handle movie uploads
const uploadMovie = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'movie', maxCount: 1 }
]);

module.exports = {
  uploadMovie
};
