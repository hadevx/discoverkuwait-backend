const express = require("express");
const router = express.Router();
const { protectUser, protectAdmin } = require("../middleware/authMiddleware");

const { updateStoreStatus, getStoreStatus } = require("../controllers/storeController");

/* /api/update-store-status */
router.put("/", protectUser, protectAdmin, updateStoreStatus);
router.get("/", getStoreStatus);

module.exports = router;
