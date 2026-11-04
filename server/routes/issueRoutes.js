const express = require("express");
const { createIssue , getIssues ,getIssueById , getNearbyIssues,} = require("../controllers/issueController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createIssue);
router.get("/", getIssues);
router.get("/nearby", getNearbyIssues);
router.get("/:id", getIssueById);

module.exports = router;