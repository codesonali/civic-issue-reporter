const cloudinary = require("../config/cloudinary");
const Upvote = require("../models/Upvote");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "civic-issues" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};
const Issue = require("../models/Issue");

const createIssue = async (req, res) => {
  try {
  const { title, description, category, longitude, latitude, address } = req.body;

  if (!title || !description || !category || longitude === undefined || latitude === undefined) {
    return res.status(400).json({
      message: "Title, description, category, longitude and latitude are required",
    });
  }

  const images = [];
  for (const file of req.files || []) {
    const result = await uploadToCloudinary(file.buffer);
    images.push(result.secure_url);
  }

  const issue = await Issue.create({
    title,
    description,
    category,
    address,
    images,
    location: {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)],
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
const getNearbyIssues = async (req, res) => {
  try {
    const longitude = Number(req.query.longitude);
    const latitude = Number(req.query.latitude);
    const radius = Number(req.query.radius) || 2000;

    if (Number.isNaN(longitude) || Number.isNaN(latitude)) {
      return res.status(400).json({ message: "Valid longitude and latitude are required" });
    }

    const issues = await Issue.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: radius,
        },
      },
    })
      .populate("reporter", "name")
      .limit(50);

    res.json({ count: issues.length, issues });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const allowedTransitions = {
  reported: ["acknowledged", "rejected"],
  acknowledged: ["in_progress", "rejected"],
  in_progress: ["resolved"],
  resolved: [],
  rejected: [],
};

const updateIssueStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (!allowedTransitions[issue.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${issue.status} to ${status}`,
      });
    }

    if (status === "rejected" && !note) {
      return res.status(400).json({ message: "A reason is required to reject an issue" });
    }

    issue.status = status;
    issue.statusHistory.push({ status, changedBy: req.user._id, note });
    await issue.save();

    res.json({ message: "Status updated", issue });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid issue id" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const toggleUpvote = async (req, res) => {
try {
const issue = await Issue.findById(req.params.id);
if (!issue) {
return res.status(404).json({ message: "Issue not found" });
}

const existing = await Upvote.findOne({ user: req.user._id, issue: issue._id });

if (existing) {
await existing.deleteOne();
issue.upvoteCount = Math.max(0, issue.upvoteCount - 1);
await issue.save();
return res.json({ message: "Upvote removed", upvoteCount: issue.upvoteCount, upvoted: false });
}

await Upvote.create({ user: req.user._id, issue: issue._id });
issue.upvoteCount += 1;
await issue.save();

res.json({ message: "Issue upvoted", upvoteCount: issue.upvoteCount, upvoted: true });
} catch (error) {
if (error.name === "CastError") {
return res.status(400).json({ message: "Invalid issue id" });
}
res.status(500).json({ message: "Server error", error: error.message });
}
};

module.exports = { createIssue ,getIssues , getIssueById ,getNearbyIssues , updateIssueStatus ,toggleUpvote,};