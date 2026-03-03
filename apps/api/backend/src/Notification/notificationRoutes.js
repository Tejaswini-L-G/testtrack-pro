const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
}); // adjust path if needed
const jwt = require("jsonwebtoken");

// 🔹 GET All Notifications
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const notifications = await prisma.notification.findMany({
      where: { userId: decoded.id },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    res.json(notifications);
  } catch (err) {
    console.error("FETCH NOTIFICATIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// 🔹 GET Unread Count
router.get("/unread-count", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const count = await prisma.notification.count({
      where: {
        userId: decoded.id,
        isRead: false
      }
    });

    res.json({ count });
  } catch (err) {
    console.error("UNREAD COUNT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
});

// 🔹 Mark Single as Read
router.patch("/:id/read", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });

    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error("MARK READ ERROR:", err);
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

// 🔹 Mark All as Read
router.patch("/mark-all-read", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await prisma.notification.updateMany({
      where: {
        userId: decoded.id,
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("MARK ALL READ ERROR:", err);
    res.status(500).json({ message: "Failed to update notifications" });
  }
});

module.exports = router;