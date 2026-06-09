const express = require("express");
const router = express.Router();
const { protectUser, protectAdmin } = require("../middleware/authMiddleware");
const { registerLimiter, loginLimiter } = require("../utils/registerLimit");
const User = require("../models/userModel");
const {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateAddress,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  loginAdmin,
  forgetPassword,
  resetPassword,
  getLatestUsers,
  toggleBlockUser,
  getBlockStatus,
  recordQuizResult,
  setVerified,
  updateProgress,
  updateCompletedQuizes,
  getLeaderboard,
} = require("../controllers/userController");
const {
  registerValidation,
  loginValidation,
  addressValidation,
} = require("../middleware/validateMiddleware");

/* /api/users */

// Client routes
router.post("/login", loginValidation, loginUser);
router.post("/register", registerValidation, registerUser);
router.post("/quiz-result", protectUser, recordQuizResult);
router.put("/progress", protectUser, updateProgress);
router.put("/completed-quizes", protectUser, updateCompletedQuizes);
router.put("/address", protectUser, addressValidation, updateAddress);
router.get("/profile", protectUser, getUserProfile);
router.get("/latest", getLatestUsers);
router.get("/leaderboard", getLeaderboard);
router.put("/profile", protectUser, updateUserProfile);
router.post("/logout", logoutUser);

// Admin routes
router.post("/admin", loginLimiter, loginValidation, loginAdmin);
// router.get("/governorates", getGovernorates);
router.get("/", protectUser, protectAdmin, getUsers);
router.put("/:id", protectUser, updateUser);
router.delete("/:id", protectUser, protectAdmin, deleteUser);
router.get("/:id", getUserById);
router.patch("/:id", protectUser, protectAdmin, toggleBlockUser);
router.patch("/verify/:id", protectUser, protectAdmin, setVerified);
router.get("/block-status/:id", protectUser, getBlockStatus);

router.post("/admin/logout", logoutUser);

router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
// Follow/unfollow a user
// router.post("/:id/follow", protectUser, toggleFollow);

router.put("/add-course/:userId", protectUser, protectAdmin, async (req, res) => {
  try {
    const { courseId } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if course already exists
    const alreadyAdded = user.purchasedCourses.some((c) => c.toString() === courseId.toString());
    if (alreadyAdded) return res.status(400).json({ message: "Course already purchased" });

    // Add course
    user.purchasedCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: "Course added successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/remove-course/:userId", protectUser, protectAdmin, async (req, res) => {
  try {
    const { courseId } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if course exists
    const courseIndex = user.purchasedCourses.findIndex(
      (c) => c.toString() === courseId.toString(),
    );

    if (courseIndex === -1) {
      return res.status(400).json({ message: "Course not found in user purchases" });
    }

    // Remove course
    user.purchasedCourses.splice(courseIndex, 1);
    await user.save();

    res.status(200).json({ message: "Course removed successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
