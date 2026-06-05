const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  governorate: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  block: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  house: {
    type: String,
    required: true,
  },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
