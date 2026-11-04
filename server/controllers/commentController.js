const Comment = require("../models/Comment");
const Issue = require("../models/Issue");

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const comment = await Comment.create({
      issue: issue._id,
      user: req.user._id,
      text,
    });

    await comment.populate("user", "name");

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid issue id" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ issue: req.params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({ count: comments.length, comments });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid issue id" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addComment, getComments };