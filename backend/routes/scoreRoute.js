const express = require("express");
const scoreController = require("../controllers/scoreController");

const router = express.Router();

// POST /api/score
router.post("/", scoreController.handleScore);

module.exports = router;

