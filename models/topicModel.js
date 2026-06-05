const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    isClosed: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pinned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
