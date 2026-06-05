const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const sharp = require("sharp");
const Course = require("../models/courseModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const { protectUser } = require("../middleware/authMiddleware");
// Make sure uploads folder exists inside container
const uploadPath = "/app/uploads";
const categoryUploadPath = "/app/uploads/categories";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
if (!fs.existsSync(categoryUploadPath)) {
  fs.mkdirSync(categoryUploadPath, { recursive: true });
}

// Multer storage config
/* const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const course = await Course.findById(req.query.course);
    console.log(course?.code?.replace(/\s+/g, ""));

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // clean numeric timestamp
    const safeName = file.originalname.replace(/\s+/g, "-"); // replace spaces
    cb(null, `${timestamp}-${safeName}`);
  },
}); */
/* const getCourse = async(req,res)=>{
   const course = await Course.findById(req.query.course);
    console.log(course?.code?.replace(/\s+/g, ""));
    const formattedCourse = course?.code?.replace(/\s+/g, "");
    return
} */
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const course = await Course.findById(req.query.course);
    console.log(course?.code?.replace(/\s+/g, ""));
    const formattedCourse = course?.code?.replace(/\s+/g, "");
    const courseFolder = path.join(uploadPath, formattedCourse);

    if (!fs.existsSync(courseFolder)) {
      fs.mkdirSync(courseFolder, { recursive: true });
    }

    cb(null, courseFolder);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${timestamp}-${safeName}`);
  },
});

// Only allow PDFs, DOCs, and PowerPoints
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, Word, and PowerPoint files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// download a resource
router.get("/download/:id", protectUser, async (req, res) => {
  const { id } = req.params;

  // 🔒 Blocked user check (early exit)
  const currentUser = await User.findById(req.user._id).select("isBlocked");
  if (currentUser.isBlocked) {
    return res.status(403).json({
      message: "Your account is blocked. Access denied.",
    });
  }

  const resource = await Product.findById(id).populate("course");
  if (!resource) return res.status(404).json({ message: "Resource not found" });

  /*  if (resource.isClosed) {
    return res.status(403).json({ message: "You have no access" });
  } */

  let hasAccess = true; // default to true for free courses

  if (resource.course.isPaid) {
    const user = await User.findById(req.user._id).select("purchasedCourses");
    hasAccess = user.purchasedCourses.some((c) => c.toString() === resource.course._id.toString());
  }

  if (resource.course.isClosed) {
    return res.status(403).json({ message: "This course is closed." });
  }

  if (!hasAccess) {
    return res.status(403).json({ message: "You don’t have access to this paid course." });
  }

  // Serve file
  const courseFolder = resource.course.code.replace(/\s+/g, "");
  const fileName = resource.file?.publicId;

  const filePath = path.join("/app/uploads", courseFolder, fileName);
  console.log(filePath);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

  res.download(filePath);
});

// Route: Upload PDF or WORD
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const course = await Course.findById(req.query.course);
    console.log(course?.code?.replace(/\s+/g, ""));
    const formattedCourse = course?.code?.replace(/\s+/g, "");
    const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${formattedCourse}/${
      req.file.filename
    }`;

    res.json({
      message: "File uploaded successfully",
      file: {
        fileUrl: fullUrl,
        publicId: req.file.filename,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "File upload failed", error: err.message });
  }
});

// Multer storage for categories
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, categoryUploadPath),
  filename: (req, file, cb) => {
    const name = path.parse(file.originalname).name.replace(/\s+/g, "-").toLowerCase();
    const ext = path.extname(file.originalname);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});
const uploadCategory = multer({ storage: categoryStorage });

/* ----------------- Category Image (single) ----------------- */
router.post("/category", uploadCategory.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const optimizedName = `optimized-${req.file.filename}.webp`;
    const outputPath = path.join(categoryUploadPath, optimizedName);

    await sharp(req.file.path).resize({ width: 800 }).webp({ quality: 80 }).toFile(outputPath);

    fs.unlinkSync(req.file.path);

    res.json({
      message: "Category image uploaded",
      image: {
        imageUrl: `${req.protocol}://${req.get("host")}/uploads/categories/${optimizedName}`,
        publicId: optimizedName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image processing failed", error: err.message });
  }
});

module.exports = router;
