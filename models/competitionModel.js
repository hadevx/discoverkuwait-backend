const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema(
  {
    isOpen: { type: Boolean, default: false },
    endDate: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Competition", competitionSchema);
