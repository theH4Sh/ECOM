const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const isVerified = require("../middleware/isVerified");
const { getNotifications, markAsRead } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", requireAuth, isVerified, getNotifications);
router.patch("/read/:id", requireAuth, isVerified, markAsRead);

module.exports = router;
