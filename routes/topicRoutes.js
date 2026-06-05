const express = require("express");
const router = express.Router();

const {
  createTopic,
  getTopics,
  getTopicById,
  createComment,
  deleteComment,
  updateTopic,
  deleteTopic,
  toggleTopicStatus,
  adminDeleteTopic,
  adminDeleteComment,
  toggleLikeTopic,
} = require("../controllers/forumControllers.js");

const { protectUser, protectAdmin } = require("../middleware/authMiddleware.js");

router.get("/", getTopics);

router.get("/:id", getTopicById);

router.post("/", protectUser, createTopic);

router.put("/:topicId", protectUser, updateTopic);

router.delete("/:topicId", protectUser, deleteTopic);

router.post("/:id/comments", protectUser, createComment);

router.delete("/:topicId/comments/:commentId", protectUser, deleteComment);

router.patch("/:id/close", protectUser, protectAdmin, toggleTopicStatus);

router.delete("/admin/:topicId", protectUser, protectAdmin, adminDeleteTopic);

router.delete("/admin/:topicId/comments/:commentId", protectUser, protectAdmin, adminDeleteComment);

// router.put("/:id/like", protectUser, likeTopic);
router.put("/:id/like", protectUser, toggleLikeTopic);

module.exports = router;
