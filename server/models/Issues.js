const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["pothole", "streetlight", "garbage", "water", "drainage", "other"],
      required: [true, "Category is required"],
    },
    images: [String],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: [true, "Location is required"],
      },
    },
    address: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["reported", "acknowledged", "in_progress", "resolved", "rejected"],
      default: "reported",
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

issueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Issue", issueSchema);