const asyncHandler = require("../middleware/asyncHandler");
const Word = require("../models/wordModel");

const createWord = asyncHandler(async (req, res) => {
  const { kuwaitiWord, arabicMeaning, englishMeaning, example, category, isApproved } = req.body;

  if (!kuwaitiWord || !arabicMeaning || !englishMeaning || !category) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const existingWord = await Word.findOne({ kuwaitiWord: kuwaitiWord.trim() });
  if (existingWord) {
    res.status(400);
    throw new Error("This word already exists in the dictionary");
  }

  const isAdmin = req.user?.isAdmin;

  const word = await Word.create({
    kuwaitiWord: kuwaitiWord.trim(),
    arabicMeaning: arabicMeaning.trim(),
    englishMeaning: englishMeaning.trim(),
    example: example?.trim() || "",
    category,
    user: req.user._id,
    // Admins can set approval explicitly; regular users always start pending
    isApproved: isAdmin ? (isApproved ?? true) : false,
  });
  res.status(201).json(word);
});

// Public — approved only
const getWords = asyncHandler(async (req, res) => {
  const words = await Word.find({ isApproved: true })
    .sort({ createdAt: -1 })
    .populate("user", "name");

  const userId = req.user?._id?.toString();
  const out = words.map((w) => {
    const obj = w.toObject();
    obj.likesCount = w.likes.length;
    obj.likedByMe = userId ? w.likes.some((id) => id.toString() === userId) : false;
    return obj;
  });
  res.json(out);
});

// Admin — all words regardless of approval
const getAllWords = asyncHandler(async (req, res) => {
  const words = await Word.find({})
    .sort({ createdAt: -1 })
    .populate("user", "name")
    .populate("likes", "name");
  res.json(words);
});

const getWordById = asyncHandler(async (req, res) => {
  const word = await Word.findById(req.params.id)
    .populate("user", "name email")
    .populate("likes", "name email");
  if (!word) {
    res.status(404);
    throw new Error("Word not found");
  }
  res.json(word);
});

const updateWord = asyncHandler(async (req, res) => {
  const { kuwaitiWord, arabicMeaning, englishMeaning, example, category, isApproved } = req.body;

  const word = await Word.findById(req.params.id);
  if (!word) {
    res.status(404);
    throw new Error("Word not found");
  }

  word.kuwaitiWord = kuwaitiWord || word.kuwaitiWord;
  word.arabicMeaning = arabicMeaning || word.arabicMeaning;
  word.englishMeaning = englishMeaning || word.englishMeaning;
  word.example = example ?? word.example;
  word.category = category || word.category;
  if (isApproved !== undefined) word.isApproved = isApproved;

  const updatedWord = await word.save();
  res.json(updatedWord);
});

const deleteWord = asyncHandler(async (req, res) => {
  const word = await Word.findById(req.params.id);
  if (!word) {
    res.status(404);
    throw new Error("Word not found");
  }
  await word.deleteOne();
  res.json({ message: "Word removed" });
});

const approveWord = asyncHandler(async (req, res) => {
  const word = await Word.findById(req.params.id);
  if (!word) {
    res.status(404);
    throw new Error("Word not found");
  }
  word.isApproved = !word.isApproved;
  const updatedWord = await word.save();
  res.json(updatedWord);
});

const likeWord = asyncHandler(async (req, res) => {
  const word = await Word.findById(req.params.id);
  if (!word) {
    res.status(404);
    throw new Error("Word not found");
  }

  const userId = req.user._id;
  const alreadyLiked = word.likes.includes(userId);

  if (alreadyLiked) {
    word.likes = word.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    word.likes.push(userId);
  }

  const updatedWord = await word.save();
  res.json({ likes: updatedWord.likes, liked: !alreadyLiked });
});

const getMyWords = asyncHandler(async (req, res) => {
  const words = await Word.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(words);
});

module.exports = {
  createWord,
  getWords,
  getAllWords,
  getMyWords,
  getWordById,
  updateWord,
  deleteWord,
  approveWord,
  likeWord,
};
