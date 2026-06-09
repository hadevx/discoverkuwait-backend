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

const { protectUser, protectAdmin, protectUnblocked } = require("../middleware/authMiddleware.js");

router.get("/", getTopics);

router.get("/:id", getTopicById);

router.post("/", protectUser, protectUnblocked, createTopic);

router.put("/:topicId", protectUser, protectUnblocked, updateTopic);

router.delete("/:topicId", protectUser, deleteTopic);

router.post("/:id/comments", protectUser, protectUnblocked, createComment);

router.delete("/:topicId/comments/:commentId", protectUser, deleteComment);

router.patch("/:id/close", protectUser, protectAdmin, toggleTopicStatus);

router.delete("/admin/:topicId", protectUser, protectAdmin, adminDeleteTopic);

router.delete("/admin/:topicId/comments/:commentId", protectUser, protectAdmin, adminDeleteComment);

// router.put("/:id/like", protectUser, likeTopic);
router.put("/:id/like", protectUser, protectUnblocked, toggleLikeTopic);

module.exports = router;
