const express = require("express");
const router = express.Router();
const { protectUser, protectAdmin, optionalAuth, protectUnblocked } = require("../middleware/authMiddleware");

const {
  createWord,
  getWords,
  getAllWords,
  getMyWords,
  getWordById,
  updateWord,
  deleteWord,
  approveWord,
  likeWord,
} = require("../controllers/wordsController");

router.get("/admin", protectUser, protectAdmin, getAllWords);
router.get("/mine", protectUser, getMyWords);
router.post("/:id/like", protectUser, protectUnblocked, likeWord);
router.get("/", optionalAuth, getWords);
router.post("/", protectUser, protectUnblocked, createWord);

router.get("/:id", getWordById);
router.put("/:id", protectUser, protectAdmin, updateWord);
router.delete("/:id", protectUser, protectAdmin, deleteWord);
router.patch("/:id/approve", protectUser, protectAdmin, approveWord);

module.exports = router;
