const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCourse,
  getNumberOfProducts,
} = require("../controllers/productController");
const { protectUser, protectAdmin } = require("../middleware/authMiddleware");

// /api/products
router.get("/", getProducts);
router.get("/all", getNumberOfProducts);

router.post("/", protectUser, protectAdmin, createProduct);

router.put("/:id", protectUser, protectAdmin, updateProduct);

router.delete("/:id", protectUser, protectAdmin, deleteProduct);

router.get("/course/:courseId", getProductsByCourse);

module.exports = router;
