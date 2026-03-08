const express = require("express");
const { generateProof } = require("../controllers/proofController");

const router = express.Router();

// POST /api/generate-proof
router.post("/", generateProof);

module.exports = router;


