const asyncHandler = require("../middleware/asyncHandler");
const Course = require("../models/courseModel");
const User = require("../models/userModel");

const createCourse = asyncHandler(async (req, res) => {
  const { name, code, image } = req.body;
  const course = await Course.create({ name, code, image });
  res.status(201).json(course);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedCourse = await Course.findByIdAndDelete(id);

  if (!deletedCourse) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.status(200).json(deletedCourse);
});

// Update
const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, code, badge, image, isFeatured, isClosed, isPaid } = req.body;

  const course = await Course.findById(id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Update fields only if provided
  if (name !== undefined) course.name = name;
  if (badge !== undefined) course.badge = badge;
  if (code) course.code = code;
  if (image !== undefined) course.image = image;
  if (isFeatured !== undefined) course.isFeatured = isFeatured;
  if (isClosed !== undefined) course.isClosed = isClosed;
  if (isPaid !== undefined) course.isPaid = isPaid;

  const updatedCourse = await course.save();
  res.json(updatedCourse);
});

const getCourses = async (req, res) => {
  const pageSize = 50; // categories per page
  const page = Number(req.query.pageNumber) || 1;

  // Optional search
  const keyword = req.query.keyword ? { code: { $regex: req.query.keyword, $options: "i" } } : {};

  // Count total matching categories
  const count = await Course.countDocuments({ ...keyword });

  // Fetch paginated categories
  const courses = await Course.find({ ...keyword })
    .sort({ code: 1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    courses,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
};

const getFeaturedCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isFeatured: true }).limit(4);
  res.json(courses);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.status(200).json(course);
});

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).sort({ code: 1 }); // 1 = ascending, -1 = descending
  res.status(200).json(courses);
});

const toggleLikeCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "course not found" });

  const alreadyLiked = course.likes.includes(userId);

  if (alreadyLiked) {
    course.likes = course.likes.filter((u) => u.toString() !== userId.toString());
  } else {
    course.likes.push(userId);
  }

  await course.save();

  res.status(200).json({
    liked: !alreadyLiked,
    likesCount: course.likes.length,
  });
});

// ✅ Add all courses to the user's purchasedCourses after successful PayPal payment
const purchaseAllCourses = asyncHandler(async (req, res) => {
  const { orderId, userId } = req.body;

  // Validate input
  if (!userId || !orderId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Fetch all courses (you can filter if needed, e.g. only paid ones)
  const allCourses = await Course.find({}, "_id");

  // Merge new courses with existing ones without duplicates
  const existingCourses = user.purchasedCourses.map((id) => id.toString());
  const newCourses = allCourses
    .map((c) => c._id.toString())
    .filter((id) => !existingCourses.includes(id));

  user.purchasedCourses.push(...newCourses);

  await user.save();

  console.log(`✅ User ${user.name} purchased all courses via PayPal order ${orderId}`);

  res.status(200).json({
    message: "All courses added to purchasedCourses",
    totalPurchased: user.purchasedCourses.length,
  });
});

const removeAllCoursesFromUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.purchasedCourses = [];
  await user.save();

  console.log(`❌ All courses removed from user ${user.name}`);

  res.status(200).json({
    message: "All courses removed from user",
    totalPurchased: 0,
  });
});

module.exports = {
  createCourse,
  deleteCourse,
  updateCourse,
  getCourses,
  getFeaturedCourses,
  getCourseById,
  getAllCourses,
  toggleLikeCourse,
  purchaseAllCourses,
  removeAllCoursesFromUser,
};
