const express = require("express");
const path = require("path");
const { uploadSingleCsv } = require("../middleware/uploadMiddleware");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

// POST /api/upload
router.post(
  "/",
  (req, res, next) => {
    uploadSingleCsv(req, res, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message || "File upload failed" });
      }
      return next();
    });
  },
  uploadController.handleUpload
);

module.exports = router;

