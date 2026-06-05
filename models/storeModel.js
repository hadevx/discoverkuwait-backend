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
    price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
