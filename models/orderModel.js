const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true }, // product name at order time
        qty: { type: Number, required: true },
        image: [
          {
            url: { type: String, required: true },
            publicId: String,
          },
        ],
        price: { type: Number, required: true }, // price at order time
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },

        // 🔹 Variant details
        variantId: { type: mongoose.Schema.Types.ObjectId }, // reference to Product.variants._id
        variantColor: { type: String },
        variantSize: { type: String }, // which size was chosen
        variantImage: [
          {
            url: { type: String, required: true },
            publicId: String,
          },
        ],
      },
    ],
    shippingAddress: {
      governorate: { type: String, required: true },
      city: { type: String, required: true },
      block: { type: String, required: true },
      street: { type: String, required: true },
      house: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
