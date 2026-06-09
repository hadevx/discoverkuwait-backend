const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    address: {
      governorate: { type: String, default: "" },
      city: { type: String, default: "" },
      block: { type: String, default: "" },
      street: { type: String, default: "" },
      house: { type: String, default: "" },
    },
    avatar: { type: String, default: "" },
    points: { type: Number, default: 0 },
    isAdmin: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, default: false },
    isVIP: { type: Boolean, default: false },

    // ── Progress ──
    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    lastQuizDate: { type: String, default: null },

    quizGamesPlayed: { type: Number, default: 0 },
    quizTotalCorrect: { type: Number, default: 0 },
    quizBestScore: { type: Number, default: 0 },
    quizBestTotal: { type: Number, default: 0 },

    nameLastUpdated: { type: Date, default: null },
    quizScores: { type: mongoose.Schema.Types.Mixed, default: {} },

    exploredAreas: [{ type: String }],
    votedWords: [{ type: String }],
    completedQuizzes: [{ type: String }],

    submittedWords: [
      {
        id: { type: String },
        word: { type: String },
        meaningAr: { type: String },
        meaningEn: { type: String },
        isApproved: { type: Boolean },
        date: { type: String },
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
