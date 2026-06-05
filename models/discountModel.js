const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  discountBy: {
    type: Number,
    required: true,
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
});

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;
