const asyncHandler = require("../middleware/asyncHandler");
const ForumPost = require("../models/forumPostModel");
const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");

// GET /api/forum?page=1  — approved posts only
const getPosts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    ForumPost.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name avatar"),
    ForumPost.countDocuments({ isApproved: true }),
  ]);

  res.json({ posts, total, page, pages: Math.ceil(total / limit) });
});

// GET /api/forum/my-pending  — current user's unapproved posts
const getMyPending = asyncHandler(async (req, res) => {
  const posts = await ForumPost.find({ author: req.user._id, isApproved: false })
    .sort({ createdAt: -1 })
    .populate("author", "name avatar");
  res.json(posts);
});

// GET /api/forum/admin/pending  — admin: all unapproved posts
const getPendingPosts = asyncHandler(async (req, res) => {
  const posts = await ForumPost.find({ isApproved: false })
    .sort({ createdAt: -1 })
    .populate("author", "name avatar")
    .populate("votes", "name avatar");
  res.json(posts);
});

// GET /api/forum/admin/approved  — admin: all approved posts
const getApprovedPosts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    ForumPost.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name avatar")
      .populate("votes", "name avatar"),
    ForumPost.countDocuments({ isApproved: true }),
  ]);

  res.json({ posts, total, page, pages: Math.ceil(total / limit) });
});

// PATCH /api/forum/:id/approve  — admin: approve a post
const approvePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.isApproved = true;
  await post.save();
  res.json({ message: "Post approved" });
});

// DELETE /api/forum/:id/reject  — admin: reject + delete a post
const rejectPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.imageName) {
    const filePath = path.join("/app/uploads/forum", post.imageName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await post.deleteOne();
  res.json({ message: "Post rejected" });
});

// POST /api/forum  (requires auth + image upload)
const createPost = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Image is required" });

  const { caption = "" } = req.body;
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/forum/${req.file.filename}`;

  const post = await ForumPost.create({
    author: req.user._id,
    imageUrl,
    imageName: req.file.filename,
    caption,
    isApproved: false,
  });

  await post.populate("author", "name avatar");

  // Update streak — posting counts as daily activity
  const user = await User.findById(req.user._id);
  let streakData = { streak: 0, bestStreak: 0, lastQuizDate: null };
  if (user) {
    const today = new Date().toISOString().slice(0, 10);
    if (user.lastQuizDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().slice(0, 10);
      user.streak = user.lastQuizDate === yKey ? (user.streak || 0) + 1 : 1;
      user.lastQuizDate = today;
      user.bestStreak = Math.max(user.bestStreak || 0, user.streak);
      await user.save();
    }
    streakData = { streak: user.streak, bestStreak: user.bestStreak, lastQuizDate: user.lastQuizDate };
  }

  res.status(201).json({ ...post.toObject(), ...streakData });
});

// PATCH /api/forum/:id/vote  (requires auth)
const toggleVote = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const userId = req.user._id.toString();
  const idx = post.votes.findIndex((v) => v.toString() === userId);

  if (idx === -1) {
    post.votes.push(req.user._id);
  } else {
    post.votes.splice(idx, 1);
  }

  await post.save();
  res.json({ votes: post.votes.length, voted: idx === -1 });
});

// DELETE /api/forum/:id  (requires auth, own post or admin)
const deletePost = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const isAuthor = post.author.toString() === req.user._id.toString();
  const isAdmin = req.role === "admin";

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({ message: "Not authorized" });
  }

  if (post.imageName) {
    const filePath = path.join("/app/uploads/forum", post.imageName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await post.deleteOne();
  res.json({ message: "Post deleted" });
});

module.exports = {
  getPosts,
  getMyPending,
  getPendingPosts,
  getApprovedPosts,
  approvePost,
  rejectPost,
  createPost,
  toggleVote,
  deletePost,
};
