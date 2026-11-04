const Issue = require("../models/Issue");

const getStats = async (req, res) => {
  try {
    const [byCategory, byStatus, resolution, topOpen] = await Promise.all([
      Issue.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Issue.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      Issue.aggregate([
        { $match: { status: "resolved" } },
        { $unwind: "$statusHistory" },
        { $match: { "statusHistory.status": "resolved" } },
        {
          $project: {
            hours: {
              $divide: [
                { $subtract: ["$statusHistory.changedAt", "$createdAt"] },
                1000 * 60 * 60,
              ],
            },
          },
        },
        { $group: { _id: null, avgHours: { $avg: "$hours" }, resolvedCount: { $sum: 1 } } },
      ]),

      Issue.find({ status: { $in: ["reported", "acknowledged", "in_progress"] } })
        .sort({ upvoteCount: -1 })
        .limit(5)
        .select("title category status upvoteCount"),
    ]);

    res.json({
      byCategory,
      byStatus,
      avgResolutionHours: resolution[0] ? Math.round(resolution[0].avgHours * 10) / 10 : null,
      resolvedCount: resolution[0] ? resolution[0].resolvedCount : 0,
      topOpenIssues: topOpen,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getStats };