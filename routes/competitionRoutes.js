const express = require("express");
const router = express.Router();
const { getStatus, updateStatus } = require("../controllers/competitionController");
const { protectUser, protectAdmin } = require("../middleware/authMiddleware");

router.get("/", getStatus);
router.patch("/", protectUser, protectAdmin, updateStatus);

module.exports = router;
