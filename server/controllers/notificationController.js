const Notification = require("../models/Notification");

// Get logged-in user's notifications
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

// Mark one notification as read
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markAsRead };
