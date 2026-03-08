const path = require("path");

/**
 * Handle CSV upload after multer has processed the file.
 * Returns a relative filePath that the frontend can pass to /api/score.
 */
async function handleUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Build a relative path like "uploads/filename.csv" from backend root.
    const relativePath = path.join("uploads", path.basename(req.file.path));

    return res.status(200).json({
      message: "File uploaded successfully",
      filePath: relativePath
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to upload file" });
  }
}

module.exports = {
  handleUpload
};

