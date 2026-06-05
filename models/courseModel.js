const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");

const courseSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    badge: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    resources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

// ✅ Automatically generate slug from course code
courseSchema.pre("save", function (next) {
  if (this.isModified("code") || !this.slug) {
    this.slug = this.code.toLowerCase().replace(/\s+/g, "");
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
