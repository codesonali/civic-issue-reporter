const Issue = require("../models/Issue");

const createIssue = async (req, res) => {
  try {
    const { title, description, category, longitude, latitude, address } = req.body;

    if (!title || !description || !category || longitude === undefined || latitude === undefined) {
      return res.status(400).json({
        message: "Title, description, category, longitude and latitude are required",
      });
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      address,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      reporter: req.user._id,
    });

    res.status(201).json({ message: "Issue reported successfully", issue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getIssues = async (req, res) => {
  try {
    const { category, status } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const issues = await Issue.find(filter)
      .populate("reporter", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Issue.countDocuments(filter);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      issues,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("reporter", "name");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ issue });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid issue id" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createIssue ,getIssues , getIssueById};