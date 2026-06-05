// models/Comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
