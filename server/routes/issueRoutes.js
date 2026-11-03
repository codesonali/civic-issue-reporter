const express = require("express");
const { createIssue } = require("../controllers/issueController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createIssue);

module.exports = router;