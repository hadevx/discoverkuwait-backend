const express = require("express");
const router = express.Router();
const { protectUser, protectAdmin } = require("../middleware/authMiddleware");
const {
  getQuizzes,
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  toggleActiveQuiz,
} = require("../controllers/quizController");

router.get("/admin", protectUser, protectAdmin, getAllQuizzes);
router.get("/", getQuizzes);
router.post("/", protectUser, protectAdmin, createQuiz);

router.get("/:id", getQuizById);
router.put("/:id", protectUser, protectAdmin, updateQuiz);
router.delete("/:id", protectUser, protectAdmin, deleteQuiz);
router.patch("/:id/toggle", protectUser, protectAdmin, toggleActiveQuiz);

module.exports = router;
