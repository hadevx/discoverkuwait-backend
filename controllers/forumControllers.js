const asyncHandler = require("../middleware/asyncHandler");
const Topic = require("../models/topicModel");
const Comment = require("../models/commentModel");

// =======================
// Get all topics (with pagination & filters)
// =======================
/* const getTopics = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword ? { title: { $regex: req.query.keyword, $options: "i" } } : {};
  const category = req.query.category ? { category: req.query.category } : {};

  const filters = { ...keyword, ...category };
  const count = await Topic.countDocuments(filters);

  const topics = await Topic.find(filters)
    .populate("author", "name avatar isAdmin")
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Admin topics first
  topics.sort((a, b) => (b.author.isAdmin ? 1 : 0) - (a.author.isAdmin ? 1 : 0));

 

  res.json({
    topics,

    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
}); */
const getTopics = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword ? { title: { $regex: req.query.keyword, $options: "i" } } : {};
  const category = req.query.category ? { category: req.query.category } : {};

  const filters = { ...keyword, ...category };

  // Count total topics for pagination
  const count = await Topic.countDocuments(filters);

  const topics = await Topic.aggregate([
    { $match: filters },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "topic",
        as: "comments",
      },
    },
    {
      $addFields: {
        commentCount: { $size: "$comments" },
      },
    },
    {
      $lookup: {
        from: "users",
        let: { authorId: "$author" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$authorId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
              username: 1,
              avatar: 1,
              isAdmin: 1,
              isVerified: 1,
            },
          },
        ],
        as: "author",
      },
    },
    { $unwind: "$author" },
    { $sort: { "author.isAdmin": -1, createdAt: -1 } },
    { $skip: pageSize * (page - 1) },
    { $limit: pageSize },
    {
      $project: {
        comments: 0, // remove full comments array
      },
    },
  ]);

  res.json({
    topics,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// =======================
// Get single topic by ID (with comments & replies)
// =======================
const getTopicById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const topic = await Topic.findById(id).populate(
    "author",
    "name avatar isAdmin username isVerified"
  );
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const comments = await Comment.find({ topic: id })
    .populate("author", "name avatar isAdmin username isVerified")
    .lean();

  res.json({ ...topic.toObject(), comments });
});

// =======================
// Create a topic
// =======================
const createTopic = asyncHandler(async (req, res) => {
  const { description, category } = req.body;

  if (req.user.isBlocked) {
    return res.status(403).json({ message: "You're blocked. Please contact support." });
  }
  if (!description || !category) return res.status(400).json({ message: "Please add all fields" });

  const topic = await Topic.create({
    author: req.user._id,
    description,
    category,
  });

  res.status(201).json(topic);
});

// =======================
// Update a topic
// =======================
const updateTopic = asyncHandler(async (req, res) => {
  const { topicId } = req.params;
  const { description, category } = req.body;

  if (req.user.isBlocked) {
    return res.status(403).json({ message: "You're blocked. Please contact support." });
  }
  const topic = await Topic.findById(topicId);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  if (topic.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  // topic.title = title || topic.title;
  topic.description = description || topic.description;
  topic.category = category || topic.category;

  const updatedTopic = await topic.save();
  res.json(updatedTopic);
});

// =======================
// Delete a topic
// =======================
const deleteTopic = asyncHandler(async (req, res) => {
  const { topicId } = req.params;

  const topic = await Topic.findById(topicId);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  if (topic.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  await topic.deleteOne();
  res.json({ message: "Topic deleted successfully" });
});

// =======================
// Toggle topic status (open/closed)
// =======================
const toggleTopicStatus = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  topic.isClosed = !topic.isClosed;
  await topic.save();

  res.json({ message: `Topic ${topic.isClosed ? "closed" : "opened"}`, topic });
});

// =======================
// Create a comment
// =======================
const createComment = asyncHandler(async (req, res) => {
  const { text, parentComment } = req.body;
  const { id: topicId } = req.params;
  if (!req.user) {
    return res.status(401).json({ message: "You're not logged in." });
  }
  if (req.user.isBlocked) {
    return res.status(403).json({ message: "You're blocked. Please contact support." });
  }

  const topic = await Topic.findById(topicId);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  if (topic.isClosed)
    return res.status(403).json({ message: "Topic is closed. No new comments allowed." });

  // Create new comment document
  const comment = await Comment.create({
    topic: topicId,
    author: req.user._id,
    text,
    parentComment,
  });

  // Populate author for frontend
  const populatedComment = await Comment.findById(comment._id)
    .populate("author", "name avatar")
    .lean();

  res.status(201).json(populatedComment);
});

// =======================
// Delete comment
// =======================
const deleteComment = asyncHandler(async (req, res) => {
  const { topicId, commentId } = req.params;

  console.log(topicId);
  console.log(commentId);
  // ✅ Check if topic exists
  const topic = await Topic.findById(topicId);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  // ✅ Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  // ✅ Ensure the comment belongs to the same topic
  if (comment.topic.toString() !== topicId)
    return res.status(400).json({ message: "Comment does not belong to this topic" });

  // ✅ Check authorization
  if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin)
    return res.status(403).json({ message: "Not authorized to delete this comment" });

  // ✅ Recursive helper to delete nested replies
  const deleteRepliesRecursively = async (parentId) => {
    const replies = await Comment.find({ parentComment: parentId });
    for (const reply of replies) {
      await deleteRepliesRecursively(reply._id); // recursively delete children
      await reply.deleteOne(); // then delete itself
    }
  };

  // ✅ Delete all nested replies first
  await deleteRepliesRecursively(comment._id);

  // ✅ Delete the original comment
  await comment.deleteOne();

  res.json({ message: "Comment and all nested replies deleted successfully" });
});

// =======================
// Admin functions
// =======================
const adminDeleteTopic = asyncHandler(async (req, res) => {
  const { topicId } = req.params;

  const topic = await Topic.findById(topicId);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  await topic.deleteOne();
  res.json({ message: "Topic deleted by admin" });
});

const adminDeleteComment = asyncHandler(async (req, res) => {
  const { topicId, commentId } = req.params;

  // ✅ Check topic exists
  const topic = await Topic.findById(topicId);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  // ✅ Admin check
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admin only" });

  // ✅ Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  // ✅ Ensure the comment belongs to the topic
  if (comment.topic.toString() !== topicId)
    return res.status(400).json({ message: "Comment does not belong to this topic" });

  // ✅ Delete nested replies recursively
  const deleteRepliesRecursively = async (parentId) => {
    const replies = await Comment.find({ parentComment: parentId });
    for (const reply of replies) {
      await deleteRepliesRecursively(reply._id);
      await reply.deleteOne();
    }
  };

  await deleteRepliesRecursively(comment._id);

  // ✅ Delete original comment
  await comment.deleteOne();

  res.json({ message: "Comment and all nested replies deleted by admin" });
});

const likeTopic = asyncHandler(async (req, res) => {
  const { id } = req.params; // topic ID
  const userId = req.user._id; // from auth middleware

  const topic = await Topic.findById(id);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const alreadyLiked = topic.likes.includes(userId);

  if (alreadyLiked) {
    return res.status(400).json({ message: "You already liked this topic" });
  }

  topic.likes.push(userId);
  await topic.save();

  res.status(200).json({ message: "Topic liked successfully", likesCount: topic.likes.length });
});
const toggleLikeTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const topic = await Topic.findById(id);
  if (!topic) return res.status(404).json({ message: "Topic not found" });

  const alreadyLiked = topic.likes.includes(userId);

  if (alreadyLiked) {
    topic.likes = topic.likes.filter((u) => u.toString() !== userId.toString());
  } else {
    topic.likes.push(userId);
  }

  await topic.save();

  res.status(200).json({
    liked: !alreadyLiked,
    likesCount: topic.likes.length,
  });
});

module.exports = {
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
  likeTopic,
  toggleLikeTopic,
};
