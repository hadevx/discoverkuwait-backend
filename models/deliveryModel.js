const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  timeToDeliver: {
    type: String,
    default: "today",
    required: true,
  },
  shippingFee: {
    type: Number,
    default: 0,
    required: true,
  },
  minDeliveryCost: {
    type: Number,
    default: 0,
    requried: true,
  },
});

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
