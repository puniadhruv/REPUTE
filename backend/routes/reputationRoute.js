const express = require("express");
const reputationController = require("../controllers/reputationController");

const router = express.Router();

// GET /api/reputation/:wallet
router.get("/:wallet", reputationController.getReputation);

module.exports = router;

