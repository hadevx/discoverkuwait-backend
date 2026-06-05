const mongoose = require("mongoose");

const bilingualSchema = new mongoose.Schema(
  { ar: { type: String, required: true, trim: true }, en: { type: String, required: true, trim: true } },
  { _id: false },
);

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["dialect", "history", "geography", "traditions", "landmarks"],
    },
    question: { type: bilingualSchema, required: true },
    options: {
      type: [
        new mongoose.Schema(
          { ar: { type: String, required: true, trim: true }, en: { type: String, required: true, trim: true } },
          { _id: false },
        ),
      ],
      validate: { validator: (v) => v.length === 4, message: "Each question must have exactly 4 options" },
    },
    answer: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: bilingualSchema, required: true },
  },
  { _id: false },
);

const examSchema = new mongoose.Schema(
  {
    title: { type: bilingualSchema, required: true },
    questions: {
      type: [questionSchema],
      validate: { validator: (v) => v.length >= 1 && v.length <= 5, message: "An exam must have between 1 and 5 questions" },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Quiz", examSchema);
