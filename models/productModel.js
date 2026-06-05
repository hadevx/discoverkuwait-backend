const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    file: {
      url: { type: String, required: true }, // Cloud storage URL (S3, Cloudinary, etc.)
      publicId: { type: String }, // If managed in Cloudinary/S3
    },
    type: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    description: {
      type: String,
    },
    size: {
      type: Number,
    },
    price: {
      type: Number,
      // required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    discountBy: {
      type: Number,
      default: 0, // 0.05 = 5%
    },
    discountedPrice: {
      type: Number,
      default: 0, // calculated price after discount
    },
    hasDiscount: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
