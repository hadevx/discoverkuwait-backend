const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    kuwaitiWord: { type: String, required: true, trim: true, unique: true },
    arabicMeaning: { type: String, required: true, trim: true },
    englishMeaning: { type: String, required: true, trim: true },
    pronunciation: { type: String, trim: true, default: "" },
    example: { type: String, trim: true, default: "" },
    category: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Word", wordSchema);
