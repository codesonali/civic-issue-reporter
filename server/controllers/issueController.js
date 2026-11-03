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

module.exports = { createIssue };