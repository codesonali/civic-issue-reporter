const express = require("express");
const { createIssue , getIssues ,getIssueById , getNearbyIssues,updateIssueStatus,toggleUpvote,} = require("../controllers/issueController");
const { protect ,authorize} = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { addComment, getComments } = require("../controllers/commentController");
const validate = require("../middleware/validate");
const { issueSchema, statusSchema, commentSchema } = require("../validators/schemas");

const router = express.Router();

// router.post("/", protect, createIssue);
router.post("/", protect, upload.array("images", 3), validate(issueSchema), createIssue);
router.get("/", getIssues);
router.get("/nearby", getNearbyIssues);
router.get("/:id", getIssueById);
// router.patch("/:id/status", protect, authorize("staff", "admin"), updateIssueStatus);
router.patch("/:id/status", protect, authorize("staff", "admin"), validate(statusSchema), updateIssueStatus);
router.post("/:id/upvote", protect, toggleUpvote);
// router.post("/:id/comments", protect, addComment);
router.post("/:id/comments", protect, validate(commentSchema), addComment);
router.get("/:id/comments", getComments);

module.exports = router;