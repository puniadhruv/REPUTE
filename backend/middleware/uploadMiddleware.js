const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage to save files into backend/uploads with original filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filter to allow only CSV files
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (ext === ".csv" || mime === "text/csv" || mime === "application/vnd.ms-excel") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }
}

const upload = multer({
  storage,
  fileFilter
});

// Middleware for single CSV file upload under field name "file"
const uploadSingleCsv = upload.single("file");

module.exports = {
  uploadSingleCsv
};

