const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const router = express.Router();
const { protectUser, protectAdmin } = require("../middleware/authMiddleware");
const {
  getPosts,
  getMyPending,
  getPendingPosts,
  getApprovedPosts,
  approvePost,
  rejectPost,
  createPost,
  toggleVote,
  deletePost,
} = require("../controllers/forumPostController");

const forumUploadPath = "/app/uploads/forum";
if (!fs.existsSync(forumUploadPath)) {
  fs.mkdirSync(forumUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, forumUploadPath),
  filename: (req, file, cb) => cb(null, `forum-${Date.now()}.tmp`),
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const processImage = async (req, res, next) => {
  if (!req.file) return next();
  try {
    const finalName = req.file.filename.replace(".tmp", ".webp");
    const outputPath = path.join(forumUploadPath, finalName);
    await sharp(req.file.path)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outputPath);
    fs.unlinkSync(req.file.path);
    req.file.filename = finalName;
    next();
  } catch (err) {
    next(err);
  }
};

// Public
router.get("/", getPosts);

// Auth required
router.get("/my-pending", protectUser, getMyPending);
router.post("/", protectUser, upload.single("image"), processImage, createPost);
router.patch("/:id/vote", protectUser, toggleVote);
router.delete("/:id", protectUser, deletePost);

// Admin only
router.get("/admin/pending", protectUser, protectAdmin, getPendingPosts);
router.get("/admin/approved", protectUser, protectAdmin, getApprovedPosts);
router.patch("/:id/approve", protectUser, protectAdmin, approvePost);
router.delete("/:id/reject", protectUser, protectAdmin, rejectPost);

module.exports = router;
