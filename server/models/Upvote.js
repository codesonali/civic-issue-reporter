const mongoose = require("mongoose");

const upvoteSchema = new mongoose.Schema(
{
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},
issue: {
type: mongoose.Schema.Types.ObjectId,
ref: "Issue",
required: true,
},
},
{ timestamps: true }
);

upvoteSchema.index({ user: 1, issue: 1 }, { unique: true });

module.exports = mongoose.model("Upvote", upvoteSchema);