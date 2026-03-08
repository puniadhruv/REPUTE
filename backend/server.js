const express = require("express");
const cors = require("cors");
const path = require("path");

const uploadRoute = require("./routes/uploadRoute");
const scoreRoute = require("./routes/scoreRoute");
const reputationRoute = require("./routes/reputationRoute");
const proofRoute = require("./routes/proofRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (can be restricted later as needed)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve uploaded files statically if needed (e.g., for debugging)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Register API routes
app.use("/api/upload", uploadRoute);
app.use("/api/score", scoreRoute);
app.use("/api/reputation", reputationRoute);
app.use("/api/generate-proof", proofRoute);

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`REPUTE backend server running on port ${PORT}`);
});

