const asyncHandler = require("../middleware/asyncHandler");
const Quiz = require("../models/quizModel");

// Public — active exams only
const getQuizzes = asyncHandler(async (req, res) => {
  const exams = await Quiz.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(exams);
});

// Admin — all exams
const getAllQuizzes = asyncHandler(async (req, res) => {
  const exams = await Quiz.find({}).sort({ createdAt: -1 });
  res.json(exams);
});

const getQuizById = asyncHandler(async (req, res) => {
  const exam = await Quiz.findById(req.params.id);
  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }
  res.json(exam);
});

const validateExamBody = (body, res) => {
  const { title, questions } = body;
  if (!title?.ar?.trim() || !title?.en?.trim()) {
    res.status(400);
    throw new Error("Exam title in both Arabic and English is required");
  }
  if (!Array.isArray(questions) || questions.length < 1 || questions.length > 5) {
    res.status(400);
    throw new Error("An exam must have between 1 and 5 questions");
  }
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.category) { res.status(400); throw new Error(`Question ${i + 1}: category is required`); }
    if (!q.question?.ar?.trim() || !q.question?.en?.trim()) { res.status(400); throw new Error(`Question ${i + 1}: question text in both languages is required`); }
    if (!Array.isArray(q.options) || q.options.length !== 4) { res.status(400); throw new Error(`Question ${i + 1}: exactly 4 options are required`); }
    if (q.answer === undefined || q.answer < 0 || q.answer > 3) { res.status(400); throw new Error(`Question ${i + 1}: answer must be 0–3`); }
    if (!q.explanation?.ar?.trim() || !q.explanation?.en?.trim()) { res.status(400); throw new Error(`Question ${i + 1}: explanation in both languages is required`); }
  }
};

const createQuiz = asyncHandler(async (req, res) => {
  const { title, questions, isActive, difficulty } = req.body;
  validateExamBody(req.body, res);
  const exam = await Quiz.create({ title, questions, isActive: isActive ?? true, difficulty: difficulty ?? "medium" });
  res.status(201).json(exam);
});

const updateQuiz = asyncHandler(async (req, res) => {
  const exam = await Quiz.findById(req.params.id);
  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }
  const { title, questions, isActive, difficulty } = req.body;
  if (title !== undefined || questions !== undefined) {
    validateExamBody({ title: title ?? exam.title, questions: questions ?? exam.questions }, res);
  }
  if (title !== undefined) exam.title = title;
  if (questions !== undefined) exam.questions = questions;
  if (isActive !== undefined) exam.isActive = isActive;
  if (difficulty !== undefined) exam.difficulty = difficulty;
  const updated = await exam.save();
  res.json(updated);
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const exam = await Quiz.findById(req.params.id);
  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }
  await exam.deleteOne();
  res.json({ message: "Exam removed" });
});

const toggleActiveQuiz = asyncHandler(async (req, res) => {
  const exam = await Quiz.findById(req.params.id);
  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }
  exam.isActive = !exam.isActive;
  const updated = await exam.save();
  res.json(updated);
});

module.exports = { getQuizzes, getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, toggleActiveQuiz };
