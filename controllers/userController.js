const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const { sendRestPasswordEmail } = require("../utils/emailService");
const crypto = require("crypto");

// Points per governorate — mirrors the frontend GOVERNORATES data
const GOVERNORATE_POINTS = {
  jahra: 120,
  capital: 150,
  hawalli: 110,
  farwaniya: 100,
  mubarak: 130,
  ahmadi: 140,
};

// @desc    Login user & get token
// @route   POST /api/users/login
// @access  public
const loginUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    // guest progress fields
    exploredAreas,
    votedWords,
    submittedWords,
    completedQuizzes,
    quizGamesPlayed,
    quizBestScore,
    quizBestTotal,
    quizTotalCorrect,
    streak,
    bestStreak,
    lastQuizDate,
  } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // ── Merge guest progress if sent ──
  if (Array.isArray(exploredAreas) && exploredAreas.length > 0) {
    user.exploredAreas = [...new Set([...user.exploredAreas, ...exploredAreas])];
  }
  if (Array.isArray(votedWords) && votedWords.length > 0) {
    user.votedWords = [...new Set([...user.votedWords, ...votedWords])];
  }
  if (Array.isArray(completedQuizzes) && completedQuizzes.length > 0) {
    user.completedQuizzes = [...new Set([...user.completedQuizzes, ...completedQuizzes])];
  }
  if (Array.isArray(submittedWords) && submittedWords.length > 0) {
    const existingIds = new Set(user.submittedWords.map((w) => w.id));
    const newWords = submittedWords.filter((w) => !existingIds.has(w.id));
    user.submittedWords = [...user.submittedWords, ...newWords];
  }

  user.quizGamesPlayed = Math.max(user.quizGamesPlayed, quizGamesPlayed ?? 0);
  user.quizBestScore = Math.max(user.quizBestScore, quizBestScore ?? 0);
  user.quizBestTotal = Math.max(user.quizBestTotal, quizBestTotal ?? 0);
  user.quizTotalCorrect = Math.max(user.quizTotalCorrect, quizTotalCorrect ?? 0);
  user.streak = Math.max(user.streak, streak ?? 0);
  user.bestStreak = Math.max(user.bestStreak, bestStreak ?? 0);

  if (lastQuizDate && (!user.lastQuizDate || lastQuizDate > user.lastQuizDate)) {
    user.lastQuizDate = lastQuizDate;
  }

  await user.save();

  generateToken(res, user);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    isAdmin: user.isAdmin,
    isBlocked: user.isBlocked,
    createdAt: user.createdAt,
    streak: user.streak,
    bestStreak: user.bestStreak,
    lastQuizDate: user.lastQuizDate,
    quizGamesPlayed: user.quizGamesPlayed,
    quizTotalCorrect: user.quizTotalCorrect,
    quizBestScore: user.quizBestScore,
    quizBestTotal: user.quizBestTotal,
    exploredAreas: user.exploredAreas,
    votedWords: user.votedWords,
    submittedWords: user.submittedWords,
    completedQuizzes: user.completedQuizzes,
    nameLastUpdated: user.nameLastUpdated,
  });
});
// @desc    Record a finished quiz on the logged-in user
// @route   POST /api/users/quiz-result
// @access  Private
const recordQuizResult = asyncHandler(async (req, res) => {
  const { score, total, quizId } = req.body;

  if (
    typeof score !== "number" ||
    typeof total !== "number" ||
    total <= 0 ||
    score < 0 ||
    score > total ||
    !quizId
  ) {
    res.status(400);
    throw new Error("Invalid quiz result");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // ── Streak (one increment per calendar day) ──
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  if (user.lastQuizDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().slice(0, 10);

    user.streak = user.lastQuizDate === yKey ? (user.streak || 0) + 1 : 1;
    user.lastQuizDate = today;
    user.bestStreak = Math.max(user.bestStreak || 0, user.streak);
  }

  // ── Aggregate stats ──
  user.quizGamesPlayed = (user.quizGamesPlayed || 0) + 1;
  user.quizTotalCorrect = (user.quizTotalCorrect || 0) + score;
  user.points = (user.points || 0) + score * 10; // 10 = POINTS.perCorrectAnswer

  // ── Best run, compared by percentage ──
  const prevPct = user.quizBestTotal ? user.quizBestScore / user.quizBestTotal : 0;
  if (score / total >= prevPct) {
    user.quizBestScore = score;
    user.quizBestTotal = total;
  }

  // ── Completed list (no duplicates) ──
  if (!user.completedQuizzes.includes(quizId)) {
    user.completedQuizzes.push(quizId);
  }

  await user.save();

  res.status(200).json({
    streak: user.streak,
    bestStreak: user.bestStreak,
    lastQuizDate: user.lastQuizDate,
    quizGamesPlayed: user.quizGamesPlayed,
    quizTotalCorrect: user.quizTotalCorrect,
    quizBestScore: user.quizBestScore,
    quizBestTotal: user.quizBestTotal,
    points: user.points,
    completedQuizzes: user.completedQuizzes,
  });
});
// @desc    Login user & get token
// @route   POST /api/admin/login
// @access  public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  if (!user.isAdmin) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  generateToken(res, user);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
  });
});
const getLatestUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, "name username")
    .sort({ createdAt: -1 }) // newest first
    .limit(20);

  res.status(200).json(users);
});
// @desc    Register user
// @route   POST /api/users
// @access  public
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    streak,
    bestStreak,
    lastQuizDate,
    quizGamesPlayed,
    quizTotalCorrect,
    quizBestScore,
    quizBestTotal,
    exploredAreas,
    votedWords,
    submittedWords,
    completedQuizzes,
  } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone: req.body.phone || "",
    streak: streak || 0,
    bestStreak: bestStreak || 0,
    lastQuizDate: lastQuizDate || null,
    quizGamesPlayed: quizGamesPlayed || 0,
    quizTotalCorrect: quizTotalCorrect || 0,
    quizBestScore: quizBestScore || 0,
    quizBestTotal: quizBestTotal || 0,
    exploredAreas: exploredAreas || [],
    votedWords: votedWords || [],
    submittedWords: submittedWords || [],
    completedQuizzes: completedQuizzes || [],
  });

  if (!user) {
    res.status(400);
    throw new Error("User creation failed");
  }

  generateToken(res, user);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    points: user.points,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    isBlocked: user.isBlocked,
    isVIP: user.isVIP,
    streak: user.streak,
    bestStreak: user.bestStreak,
    lastQuizDate: user.lastQuizDate,
    quizGamesPlayed: user.quizGamesPlayed,
    quizTotalCorrect: user.quizTotalCorrect,
    quizBestScore: user.quizBestScore,
    quizBestTotal: user.quizBestTotal,
    exploredAreas: user.exploredAreas,
    votedWords: user.votedWords,
    submittedWords: user.submittedWords,
    completedQuizzes: user.completedQuizzes,
    createdAt: user.createdAt,
    nameLastUpdated: user.nameLastUpdated,
  });
});
// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out successfully" });
});

const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Admin logged out successfully" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, avatar, address } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (name && name !== user.name) {
    if (user.nameLastUpdated) {
      const daysSince =
        (Date.now() - new Date(user.nameLastUpdated).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        res.status(400);
        throw new Error("Name can only be changed once every 7 days");
      }
    }
    user.name = name;
    user.nameLastUpdated = new Date();
  }

  user.email = email || user.email;
  if (phone !== undefined) user.phone = phone;
  if (address && typeof address === "object") {
    user.address = {
      governorate: address.governorate ?? user.address.governorate,
      city: address.city ?? user.address.city,
      block: address.block ?? user.address.block,
      street: address.street ?? user.address.street,
      house: address.house ?? user.address.house,
    };
  }
  if (!user.isAdmin && avatar !== undefined) {
    user.avatar = avatar;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    createdAt: updatedUser.createdAt,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    address: updatedUser.address,
    avatar: updatedUser.avatar,
    isAdmin: updatedUser.isAdmin,
    nameLastUpdated: updatedUser.nameLastUpdated,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 50; // number of users per page
  const page = Number(req.query.pageNumber) || 1;

  // Optional search by name or email
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: "i" } },
          { email: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
    : {};

  // Count total users matching the search
  const count = await User.countDocuments({ ...keyword });

  // Paginate + sort newest first
  const users = await User.find({ ...keyword })
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    users,
    page,
    pages: Math.ceil(count / pageSize), // total pages
    total: count, // total users
  });
});

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    // If user is not found, respond with 404
    res.status(404);
    throw new Error("User not found");
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error("Cannot delete admin user");
  }

  await User.findByIdAndDelete({ _id: user._id });
  res.status(200).json({ message: "User deleted successfully" });
});

const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Toggle the current block status
  user.isBlocked = !user.isBlocked;

  await user.save();

  res.status(200).json({
    message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    user,
  });
});
const setVerified = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Toggle the current block status
  user.isVerified = !user.isVerified;

  await user.save();

  res.status(200).json({
    message: `User ${user.isVerfied ? "Verified" : "unverified"} successfully`,
    user,
  });
});
const getBlockStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user.isBlocked);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const { name, email, isAdmin } = req.body;

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = Boolean(isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save();

  const resetURL = `${process.env.FRONTEND_URL}/admin/reset-password/${resetToken}`;
  await sendRestPasswordEmail(
    process.env.ADMIN_EMAIL,
    "Password Reset Request",
    `
  Hello,

  We received a request to reset your password.  
  If you made this request, please click the link below to set a new password:

  ${resetURL}

  If you did not request a password reset, please ignore this email.  
  For security, this link will expire in 15 minutes.

  Best regards,  
  AUKNOTES
  `,
  );

  res.json({ message: "Reset link sent to email" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const updateProgress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const {
    exploredAreas,
    quizGamesPlayed,
    quizBestScore,
    quizBestTotal,
    quizTotalCorrect,
    streak,
    bestStreak,
    lastQuizDate,
    votedWords,
    submittedWords,
    completedQuizzes,
    quizScores,
  } = req.body;

  // ── exploredAreas: union only (governorates can't be un-explored) ──
  if (Array.isArray(exploredAreas)) {
    user.exploredAreas = [...new Set([...user.exploredAreas, ...exploredAreas])];
  }
  // ── votedWords: overwrite so un-votes are reflected ──
  if (Array.isArray(votedWords)) {
    user.votedWords = votedWords;
  }
  if (Array.isArray(completedQuizzes)) {
    user.completedQuizzes = [...new Set([...user.completedQuizzes, ...completedQuizzes])];
  }
  if (quizScores && typeof quizScores === "object") {
    user.quizScores = { ...(user.quizScores ?? {}), ...quizScores };
    user.markModified("quizScores");
  }
  if (Array.isArray(submittedWords)) {
    const existingIds = new Set(user.submittedWords.map((w) => w.id));
    const newWords = submittedWords.filter((w) => !existingIds.has(w.id));
    user.submittedWords = [...user.submittedWords, ...newWords];
  }

  // ── Numbers: take the higher value ──
  user.quizGamesPlayed = Math.max(user.quizGamesPlayed, quizGamesPlayed ?? 0);
  user.quizBestScore = Math.max(user.quizBestScore, quizBestScore ?? 0);
  user.quizBestTotal = Math.max(user.quizBestTotal, quizBestTotal ?? 0);
  user.quizTotalCorrect = Math.max(user.quizTotalCorrect, quizTotalCorrect ?? 0);
  user.streak = Math.max(user.streak, streak ?? 0);
  user.bestStreak = Math.max(user.bestStreak, bestStreak ?? 0);

  // ── Date: keep whichever is more recent ──
  if (lastQuizDate) {
    if (!user.lastQuizDate || lastQuizDate > user.lastQuizDate) {
      user.lastQuizDate = lastQuizDate;
    }
  }

  const saved = await user.save();

  res.status(200).json({
    exploredAreas: saved.exploredAreas,
    quizGamesPlayed: saved.quizGamesPlayed,
    quizBestScore: saved.quizBestScore,
    quizBestTotal: saved.quizBestTotal,
    quizTotalCorrect: saved.quizTotalCorrect,
    streak: saved.streak,
    bestStreak: saved.bestStreak,
    lastQuizDate: saved.lastQuizDate,
    votedWords: saved.votedWords,
    submittedWords: saved.submittedWords,
    completedQuizzes: saved.completedQuizzes,
    quizScores: saved.quizScores,
  });
});

// @desc    Update the logged-in user's completed quizzes
// @route   PUT /api/users/quizzes
// @access  Private
const updateCompletedQuizes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { completedQuizzes } = req.body;

  if (Array.isArray(completedQuizzes)) {
    user.completedQuizzes = completedQuizzes;
  }

  const saved = await user.save();

  res.status(200).json({
    completedQuizzes: saved.completedQuizzes,
  });
});

// @desc    Get top users sorted by computed total points
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find({ isBlocked: false, isAdmin: false })
    .select("name avatar quizTotalCorrect submittedWords votedWords exploredAreas")
    .lean();

  const scored = users.map((u) => {
    const quizPoints = (u.quizTotalCorrect || 0) * 10;
    const contributionPoints = (u.submittedWords?.length || 0) * 15;
    const votePoints = (u.votedWords?.length || 0) * 2;
    const explorePoints = (u.exploredAreas || []).reduce(
      (sum, id) => sum + (GOVERNORATE_POINTS[id] || 0),
      0,
    );
    return {
      _id: u._id,
      name: u.name,
      avatar: u.avatar || null,
      totalPoints: quizPoints + contributionPoints + votePoints + explorePoints,
    };
  });

  scored.sort((a, b) => b.totalPoints - a.totalPoints);
  res.json(scored);
});

// @desc    Update the logged-in user's address
// @route   PUT /api/users/address
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const { governorate, city, block, street, house } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.address = {
    governorate: governorate ?? user.address.governorate,
    city: city ?? user.address.city,
    block: block ?? user.address.block,
    street: street ?? user.address.street,
    house: house ?? user.address.house,
  };

  const saved = await user.save();
  res.status(200).json({ address: saved.address });
});

module.exports = {
  updateCompletedQuizes,
  updateAddress,
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  getLatestUsers,
  loginAdmin,
  forgetPassword,
  resetPassword,
  logoutAdmin,
  recordQuizResult,
  toggleBlockUser,
  getBlockStatus,
  updateProgress,
  setVerified,
  getLeaderboard,
};
