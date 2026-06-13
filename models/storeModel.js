const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "active",
      required: true,
    },
    banner: {
      type: String,
      default: "",
    },
    bannerBg: {
      type: String,
      default: "#18181b",
    },
    bannerTextColor: {
      type: String,
      default: "#ffffff",
    },
    price: {
      type: Number,
      default: 0,
    },
    quizEnabled: { type: Boolean, default: true },
    forumEnabled: { type: Boolean, default: true },
    dictionaryEnabled: { type: Boolean, default: true },
    leaderboardEnabled: { type: Boolean, default: true },
    pointsPerCorrectAnswer: { type: Number, default: 10 },
    forumAutoApprove: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
