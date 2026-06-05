const express = require("express");
const router = express.Router();
const { protectUser, protectAdmin } = require("../middleware/authMiddleware");
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDeliverd,
  getOrders,
  getUserOrders,
  updateOrderToCanceled,
  checkStock,
  getOrderStats,
  getRevenueStats,
} = require("../controllers/orderControllers");

// http:localhost:4001/api/orders
router.get("/user-orders/:id", getUserOrders);
router.post("/check-stock", checkStock);
router.get("/stats", protectUser, protectAdmin, getOrderStats);
router.get("/revenu", protectUser, protectAdmin, getRevenueStats);
router.post("/", protectUser, addOrderItems);
router.get("/", protectUser, protectAdmin, getOrders);

router.get("/mine", protectUser, getMyOrders);
router.get("/:id", protectUser, getOrderById);
router.get("/admin/:id", protectUser, protectAdmin, getOrderById);
router.route("/:id/pay").put(protectUser, updateOrderToPaid);
router.route("/:id/deliver").put(protectUser, protectAdmin, updateOrderToDeliverd);
router.route("/:id/cancel").put(protectUser, protectAdmin, updateOrderToCanceled);

module.exports = router;
