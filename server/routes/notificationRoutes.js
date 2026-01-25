const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { getNotifications, markAsRead } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", requireAuth, getNotifications);
router.patch("/read/:id", requireAuth, markAsRead);

module.exports = router;
