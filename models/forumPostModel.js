const mongoose = require("mongoose");

const forumPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    imageName: { type: String },
    caption: { type: String, default: "" },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ForumPost", forumPostSchema);
