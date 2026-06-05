const express = require("express");
const axios = require("axios");

const router = express.Router();
const { createPayment, verifyPayment } = require("../controllers/paymentController");

/* /api/payment */

// Create Payment
router.post("/create", createPayment);

// Verify Payment
router.get("/verify/:tapId", verifyPayment);

module.exports = router;
