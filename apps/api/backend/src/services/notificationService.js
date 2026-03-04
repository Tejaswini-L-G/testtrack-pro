const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
let ioInstance;
let userSockets;

function initSocket(io, sockets) {
  ioInstance = io;
  userSockets = sockets;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


async function sendNotification({
  userId,
  type,
  title,
  message,
  referenceId,
  link,
  emailTemplate
}){
  // 1️⃣ Get user + preferences
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preference: true }
  });

  if (!user) return;

  let pref = user.preference;

  // 2️⃣ If no preferences exist → create default
  if (!pref) {
    pref = await prisma.notificationPreference.create({
      data: { userId }
    });
  }

  // 3️⃣ Decide delivery type
  let sendEmail = false;
  let sendInApp = false;

  switch (type) {
    case "BUG_ASSIGNED":
      sendEmail = pref.bugAssignedEmail;
      sendInApp = pref.bugAssignedInApp;
      break;

    case "STATUS_CHANGED":
      sendEmail = pref.statusChangedEmail;
      sendInApp = pref.statusChangedInApp;
      break;

    case "COMMENT":
      sendEmail = pref.commentEmail;
      sendInApp = pref.commentInApp;
      break;

    case "TEST_ASSIGNED":
      sendEmail = pref.testAssignedEmail;
      sendInApp = pref.testAssignedInApp;
      break;

    case "RETEST":
      sendEmail = pref.retestEmail;
      sendInApp = pref.retestInApp;
      break;
  }
  const now = new Date();
const currentTime = now.toTimeString().slice(0, 5); // HH:MM

if (pref.quietHoursStart && pref.quietHoursEnd) {

  if (
    currentTime >= pref.quietHoursStart &&
    currentTime <= pref.quietHoursEnd
  ) {
    sendEmail = false; // 🚫 Disable email during quiet hours
  }
}

  // 4️⃣ Create In-App Notification
  if (sendInApp) {
  const notification = await prisma.notification.create({
  data: {
    userId,
    type,
    title,
    message,
    referenceId,
    link
  }
});
  
const io = require("../server").io || null;
if (ioInstance && userSockets) {
  const socketId = userSockets.get(userId);

  if (socketId) {
    ioInstance.to(socketId).emit("new_notification", notification);
  }
}
  }

  // 5️⃣ Send Email Notification
  if (sendEmail) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: title,
      html: emailTemplate || `<p>${message}</p>`
    });
  }
}

module.exports = { sendNotification, initSocket };