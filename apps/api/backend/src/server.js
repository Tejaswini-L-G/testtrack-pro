const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("./Passport");
const upload = require("./upload");
const path = require("path");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const cron = require("node-cron");
const xlsx = require("xlsx");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const { execFile } = require("child_process");
const logAction = require("./utils/logAction");
const getUserIdFromToken = require("./utils/getUserFromToken");
const { sendNotification } = require("./services/notificationService");
const notificationRoutes = require("./Notification/notificationRoutes");
const { generateExecutionPdf } = require("./services/reportPdfService");
const requirePermission = require("./middleware/requirePermission");
const apiKeyRoutes = require("./routes/apiKeys");
// or your existing path
const githubWebhook = require("./routes/githubWebhook");


const app = express();
app.use(passport.initialize());
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
app.use(express.json());

app.use("/integrations", githubWebhook);
app.use("/api/keys", apiKeyRoutes);
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));



app.use("/api/notifications", notificationRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
  message: {
    error: "Too many requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api", apiLimiter);

cron.schedule("* * * * *", async () => {

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0,5);

  const schedules = await prisma.reportSchedule.findMany({
    where: { isActive: true },
    include: { user: true }
  });

  for (const sched of schedules) {

    if (
      sched.frequency === "WEEKLY" &&
      sched.dayOfWeek === currentDay &&
      sched.time === currentTime
    ) {

      try {

        const reportData = await generateTestExecutionData(sched.userId);

        const pdfPath = await generateExecutionPdf(reportData);

        await sendEmail(
          sched.user.email,
          "Weekly Test Report",
          "<h3>Your report is attached</h3>",
          pdfPath
        );

        await prisma.reportScheduleHistory.create({
          data: {
            scheduleId: sched.id,
            status: "SUCCESS",
            message: "Report sent with PDF"
          }
        });

      } catch (error) {

        await prisma.reportScheduleHistory.create({
          data: {
            scheduleId: sched.id,
            status: "FAILED",
            message: error.message
          }
        });

      }

    }

  }

});


async function generateTestExecutionData(userId) {

  const executions = await prisma.testExecution.findMany({
    where: {
      executedById: userId
    },
    include: {
      testRun: true,
      executedBy: true,
      steps: true
    }
  });

  const total = executions.length;

  let passed = 0;
  let failed = 0;
  let inProgress = 0;

  executions.forEach(exec => {
    if (exec.status === "Passed") passed++;
    else if (exec.status === "Failed") failed++;
    else inProgress++;
  });

  const passRate =
    total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

  /* 🔹 STEP BREAKDOWN */

  let stepPass = 0;
  let stepFail = 0;
  let stepBlocked = 0;
  let stepSkipped = 0;

  executions.forEach(exec => {

    exec.steps.forEach(step => {

      if (step.status === "Pass") stepPass++;
      else if (step.status === "Fail") stepFail++;
      else if (step.status === "Blocked") stepBlocked++;
      else if (step.status === "Skipped") stepSkipped++;

    });

  });

  /* 🔹 EXECUTION BY TESTER */

  const testerStats = {};

  executions.forEach(exec => {

    const name = exec.executedBy?.name || "Unknown";

    if (!testerStats[name]) {
      testerStats[name] = 0;
    }

    testerStats[name]++;

  });

  /* 🔹 EXECUTION BY RUN */

  const runStats = {};

  executions.forEach(exec => {

    const run = exec.testRun?.name || "Standalone";

    if (!runStats[run]) {
      runStats[run] = 0;
    }

    runStats[run]++;

  });

  return {
    total,
    passed,
    failed,
    inProgress,
    passRate,

    stepPass,
    stepFail,
    stepBlocked,
    stepSkipped,

    testerStats,
    runStats,

    executions
  };
}

async function generateTestExecutionReport(userId) {

  const executions = await prisma.testExecution.findMany({
    where: { executedById: userId }
  });

  const total = executions.length;
  const passed = executions.filter(e => e.status === "Passed").length;
  const failed = executions.filter(e => e.status === "Failed").length;

  const passRate = ((passed / total) * 100).toFixed(1);

  return `
    <h2>Weekly Test Execution Summary</h2>
    <p>Total Executed: ${total}</p>
    <p>Passed: ${passed}</p>
    <p>Failed: ${failed}</p>
    <p>Pass Rate: ${passRate}%</p>
  `;
}

async function getDeveloperReportData() {

  const bugs = await prisma.bug.findMany({
    include: { assignedTo: true }
  });

  const devStats = {};

  for (const bug of bugs) {

    const dev = bug.assignedTo?.name || "Unassigned";

    if (!devStats[dev]) {
      devStats[dev] = {
        assigned: 0,
        resolved: 0,
        reopened: 0,
        resolutionTimes: []
      };
    }

    const s = devStats[dev];

    s.assigned++;

    if (bug.status === "Resolved" || bug.status === "Closed") {
      s.resolved++;

      if (bug.fixedAt) {
        const days =
          Math.floor((bug.fixedAt - bug.createdAt) /
            (1000 * 60 * 60 * 24));

        s.resolutionTimes.push(days);
      }
    }

    if (bug.status === "Reopened") s.reopened++;
  }

  return Object.entries(devStats).map(([developer, s]) => {

    const avg =
      s.resolutionTimes.length
        ? (s.resolutionTimes.reduce((a, b) => a + b, 0) /
          s.resolutionTimes.length).toFixed(2)
        : 0;

    const reopenRate =
      s.resolved
        ? ((s.reopened / s.resolved) * 100).toFixed(2)
        : 0;

    const quality =
      s.assigned
        ? ((s.resolved / s.assigned) * 100).toFixed(2)
        : 0;

    return {
      developer,
      assigned: s.assigned,
      resolved: s.resolved,
      avgResolutionDays: avg,
      reopenRate,
      fixQuality: quality
    };
  });
}








const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

async function generateTestCaseId() {

  const year = new Date().getFullYear();

  const last = await prisma.testCase.findFirst({
    where: {
      testCaseId: {
        startsWith: `TC-${year}-`
      }
    },
    orderBy: {
      testCaseId: "desc"
    }
  });

  let next = 1;

  if (last) {
    const parts = last.testCaseId.split("-");
    next = parseInt(parts[2]) + 1;
  }

  return `TC-${year}-${String(next).padStart(5, "0")}`;
}

app.use(express.json());



const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, html, attachmentPath = null) {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  // Attach PDF if provided
  if (attachmentPath) {
    mailOptions.attachments = [
      {
        filename: "report.pdf",
        path: attachmentPath
      }
    ];
  }

  await transporter.sendMail(mailOptions);

}

function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

const createAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role   // ⭐ ADD THIS
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};


const createRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};



// Home route
app.get("/", (req, res) => {
  res.send("TestTrack Pro Backend is running 🚀");
});

app.get("/api/me", async (req, res) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, role: true },
    });

    res.json(user);

  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});





app.get("/users", authenticate, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.json(users);

  } catch (err) {
    console.error("FETCH USERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.get("/api/users", async (req, res) => {
  try {

    const { role } = req.query;

    const users = await prisma.user.findMany({
      where: role ? { role } : {},
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 👉 PASTE REGISTER API BELOW THIS LINE
app.post("/register", async (req, res) => {
  try {
    // ✅ NEW: accept role
    let { name, email, password, role } = req.body;
    email = email.toLowerCase().trim();

    // ✅ NEW: validate role
    const allowedRoles = ["tester", "developer", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars, uppercase, lowercase, number, special char",
      });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const verifyToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ CREATE USER FIRST (role added)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,              // ✅ NEW (THIS FIXES EVERYTHING)
        verifyToken,
        isVerified: false,
        passwordHistory: [hashed],
      },
    });


    await prisma.notificationPreference.create({
  data: {
    userId: user.id
  }
});

    // ✅ SEND RESPONSE IMMEDIATELY
    res.json({
      message:
        "Registration successful! Please check your email to verify your account.",
    });
     
    // 📩 TRY SENDING EMAIL (FAILURE WON'T AFFECT USER NOW)
    try {
      const link = `${process.env.FRONTEND_URL}/verify/${verifyToken}`;

      await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Welcome to TestTrack Pro 🎉",
  html: `
    <div style="font-family: Arial; padding:20px;">
      <h2>Welcome to TestTrack Pro</h2>
      <p>Hi ${name},</p>

      <p>Thank you for creating your account.</p>

      <p>Please confirm your email address to activate your account.</p>

      <p>
        <a href="${link}" 
           style="display:inline-block;padding:10px 20px;
           background:#4f46e5;color:white;
           text-decoration:none;border-radius:5px;">
           Confirm Email Address
        </a>
      </p>

      <hr style="margin-top:20px;" />

      <p style="font-size:12px;color:#777;">
        If you did not create this account, you can safely ignore this email.
      </p>

      <p style="font-size:12px;color:#777;">
        TestTrack Pro Team
      </p>
    </div>
  `
});

      
      
    } catch (mailErr) {
      console.error("EMAIL SEND FAILED:", mailErr);
    }
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password, remember } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  // ✅ Check user first
  if (!user) {
    return res.status(401).json({ message: "Invalid login" });
  }

  if (!user.active) {
    return res.status(403).json({
      message: "Account is deactivated. Contact admin."
    });
  }

  // ✅ Email verification
  if (!user.isVerified) {
    return res.status(403).json({ message: "Verify email first" });
  }

  // ✅ Account lock check
  if (user.lockUntil && user.lockUntil > new Date()) {
    return res.status(403).json({ message: "Account locked. Try later." });
  }

  // ✅ Password check
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const attempts = user.failedAttempts + 1;

    await prisma.user.update({
      where: { email },
      data: {
        failedAttempts: attempts,
        lockUntil:
          attempts >= 5
            ? new Date(Date.now() + 15 * 60 * 1000)
            : null,
      },
    });

    return res.status(401).json({ message: "Invalid login" });
  }

  // ✅ Create tokens
  const accessToken = createAccessToken(user);
  const refreshToken = remember ? createRefreshToken(user) : null;

  await prisma.user.update({
    where: { email },
    data: {
      failedAttempts: 0,
      refreshToken,
    },
  });

  res.json({
  accessToken,
  refreshToken,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});
});


app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Always respond success (prevent email enumeration)
    if (!user) {
      return res.json({
        message: "If this email exists, a reset link has been sent."
      });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetExpiry: new Date(Date.now() + 3600000)
      }
    });

    const link = `${process.env.FRONTEND_URL}/reset/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request - TestTrack Pro",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>Password Reset</h2>

          <p>Hello,</p>

          <p>We received a request to reset your password.</p>

          <p>
            <a href="${link}" 
              style="display:inline-block;
              padding:10px 20px;
              background:#4f46e5;
              color:white;
              text-decoration:none;
              border-radius:5px;">
              Reset Password
            </a>
          </p>

          <p>This link will expire in 1 hour.</p>

          <hr />

          <p style="font-size:12px;color:#777;">
            If you did not request this, you can ignore this email.
          </p>
        </div>
      `
    });

    res.json({
      message: "If this email exists, a reset link has been sent."
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed to process request" });
  }
});



app.post("/change-password", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔥 USE ID FROM TOKEN (NOT req.user.email)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashed }
    });

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);

    await prisma.user.update({
      where: { email: decoded.email },
      data: {
        isVerified: true,
        verifyToken: null
      }
    });

    res.redirect(process.env.FRONTEND_URL);
  } catch {
    res.send("Verification link expired");
  }
});


app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "If you got this, Nodemailer works!"
    });
    res.send("Email sent!");
  } catch (err) {
    console.error("TEST EMAIL ERROR:", err);
    res.status(500).send("Email failed");
  }
});


app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (user.refreshToken !== refreshToken)
    return res.status(403).json({ message: "Invalid session" });

  res.json({ accessToken: createAccessToken(user) });
});


app.post("/logout-all", async (req, res) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: { refreshToken: null }
  });

  res.json({ message: "Logged out everywhere" });
});


app.post("/simple-reset", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reset failed" });
  }
});

// ======================
// OAUTH ROUTES
// ======================

// GOOGLE LOGIN
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${req.user.token}`
    );
  }
);

// GITHUB LOGIN
app.get("/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get("/auth/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${req.user.token}`
    );
  }
);





app.post("/change-password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const email = req.user.email;

    const user = await prisma.user.findUnique({ where: { email } });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    // 🔁 Prevent reuse of last 5 passwords
    if (user.passwordHistory?.length) {
      for (const oldHash of user.passwordHistory.slice(-5)) {
        const reused = await bcrypt.compare(newPassword, oldHash);
        if (reused) {
          return res
            .status(400)
            .json({ message: "Cannot reuse last 5 passwords" });
        }
      }
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashed,
        passwordHistory: {
          push: hashed,
        },
      },
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed to change password" });
  }
});

app.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // ✅ Generate new access token
    const newAccessToken = createAccessToken(user);

    res.json({ accessToken: newAccessToken });

  } catch {
    res.status(403).json({ message: "Refresh token expired" });
  }
});

app.post("/logout-all", authenticate, async (req, res) => {

  await prisma.user.update({
    where: { id: req.user.id },
    data: { refreshToken: null }
  });

  res.json({ message: "Logged out from all devices" });
});

app.put("/testcases/bulk-update", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "tester") {
      return res.status(403).json({ message: "Only testers allowed" });
    }

    const { testCaseIds, updates } = req.body;

    const result = await prisma.testCase.updateMany({
      where: {
        id: { in: testCaseIds },
        isDeleted: false
      },
      data: {
        ...updates,
        version: { increment: 1 },
        updatedAt: new Date()
      }
    });

    res.json({
      message: "Bulk update successful",
      updatedCount: result.count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Bulk update failed" });
  }
});

app.put("/admin/testcases/bulk-permanent", authenticate, async (req, res) => {
  const { ids } = req.body;

  await prisma.testCase.deleteMany({
    where: { id: { in: ids } }
  });

  res.json({ message: "Deleted successfully" });
});

app.put("/admin/testcases/bulk-restore", authenticate, async (req, res) => {
  const { ids } = req.body;

  await prisma.testCase.updateMany({
    where: { id: { in: ids } },
    data: { isDeleted: false }
  });

  res.json({ message: "Restored successfully" });
});




// 🔥 BULK DELETE TEST CASES (SOFT DELETE)
app.put("/testcases/bulk-delete", authenticate, async (req, res) => {
  try {
    // Only tester allowed
    if (req.user.role !== "tester") {
      return res.status(403).json({ message: "Only testers can delete test cases" });
    }

    const { testCaseIds } = req.body;

    if (!testCaseIds || testCaseIds.length === 0) {
      return res.status(400).json({ message: "No test case IDs provided" });
    }

    const result = await prisma.testCase.updateMany({
      where: {
        id: { in: testCaseIds },
        isDeleted: false
      },
      data: {
        isDeleted: true
      }
    });

    res.json({
      message: "Bulk delete successful",
      deletedCount: result.count
    });

  } catch (err) {
    console.error("BULK DELETE ERROR:", err);
    res.status(500).json({ message: "Failed to bulk delete test cases" });
  }
});

app.put("/testcases/bulk-status", authenticate, async (req, res) => {
  try {
    const { testCaseIds, status } = req.body;

    if (!testCaseIds?.length)
      return res.status(400).json({ message: "No test case IDs provided" });

    const result = await prisma.testCase.updateMany({
      where: {
        id: { in: testCaseIds },
        isDeleted: false
      },
      data: { status },
    });

    res.json({
      message:
        result.count === 0
          ? "No changes applied (same status)"
          : "Status updated successfully",
      updatedCount: result.count
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
});




app.put("/testcases/bulk-priority", authenticate, async (req, res) => {
  try {
    const { testCaseIds, priority } = req.body;

    if (!testCaseIds?.length)
      return res.status(400).json({ message: "No test case IDs provided" });

    const result = await prisma.testCase.updateMany({
      where: {
        id: { in: testCaseIds },
        isDeleted: false
      },
      data: { priority },
    });

    if (result.count === 0) {
      return res.status(404).json({
        message: "No test cases updated — check IDs"
      });
    }

    res.json({
      message: "Priority updated successfully",
      updatedCount: result.count
    });

  } catch (err) {
    console.error("BULK PRIORITY ERROR:", err);
    res.status(500).json({ message: "Failed to update priority" });
  }
});

app.put("/testcases/bulk-severity", authenticate, async (req, res) => {
  try {
    const { testCaseIds, severity } = req.body;

    if (!testCaseIds?.length)
      return res.status(400).json({ message: "No test case IDs provided" });

    const result = await prisma.testCase.updateMany({
      where: {
        id: { in: testCaseIds },
        isDeleted: false
      },
      data: { severity },
    });

    res.json({
      message:
        result.count === 0
          ? "No changes applied"
          : "Severity updated successfully",
      updatedCount: result.count
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update severity" });
  }
});

app.put("/testcases/bulk-assignee", authenticate, async (req, res) => {
  try {
    const { testCaseIds, assignedTesterId } = req.body;

    if (!testCaseIds?.length)
      return res.status(400).json({ message: "No test case IDs provided" });

    const result = await prisma.testCase.updateMany({
      where: {
        id: { in: testCaseIds },
        isDeleted: false
      },
      data: { assignedTesterId },
    });

    res.json({
      message:
        result.count === 0
          ? "No changes applied"
          : "Assignee updated successfully",
      updatedCount: result.count
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update assignee" });
  }
});

app.put("/testcases/bulk-module", authenticate, async (req, res) => {
  const { testCaseIds, module } = req.body;

  const result = await prisma.testCase.updateMany({
    where: { id: { in: testCaseIds }, isDeleted: false },
    data: { module }
  });

  res.json({
    message: `${result.count} test cases moved to module "${module}"`
  });
});

app.put("/testcases/bulk-suite", authenticate, async (req, res) => {
  try {
    const { testCaseIds, suiteId } = req.body;

    if (!suiteId)
      return res.status(400).json({ message: "Suite not selected" });

    // ✅ Check suite exists
    const suite = await prisma.testSuite.findUnique({
      where: { id: suiteId }
    });

    if (!suite) {
      return res.status(400).json({
        message: "Selected suite not found"
      });
    }

    const result = await prisma.testCase.updateMany({
      where: {
        id: { in: testCaseIds },
        isDeleted: false
      },
      data: { suiteId }
    });

    res.json({
      message: `${result.count} test cases moved to "${suite.name}"`
    });

  } catch (err) {
    console.error("Bulk suite error:", err);
    res.status(500).json({
      message: "Failed to move test cases"
    });
  }
});




app.post("/testcases/export/csv", authenticate, async (req, res) => {
  try {
    const { testCaseIds } = req.body;

    const testCases = await prisma.testCase.findMany({
      where: {
        id: { in: testCaseIds },
        isDeleted: false
      }
    });

    const header = [
      "TestCaseID",
      "Title",
      "Module",
      "Priority",
      "Severity",
      "Type",
      "Status"
    ];

    const rows = testCases.map(tc => [
      tc.testCaseId,
      tc.title,
      tc.module,
      tc.priority,
      tc.severity,
      tc.type,
      tc.status
    ]);

    const csv =
      [header, ...rows].map(r => r.join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=testcases.csv"
    );

    res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export failed" });
  }
});



app.post("/testcases/export/excel", authenticate, async (req, res) => {
  try {
    const { testCaseIds } = req.body;

    const testCases = await prisma.testCase.findMany({
      where: {
        id: { in: testCaseIds },
        isDeleted: false
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(testCases);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "TestCases");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=testcases.xlsx"
    );

    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export failed" });
  }
});



app.post("/testcases/import/json", authenticate, async (req, res) => {
  try {
    const testCases = req.body;

    // 🔴 Must be array
    if (!Array.isArray(testCases)) {
      return res.status(400).json({
        message:
          "Invalid JSON format. Expected an array of test cases."
      });
    }

    // 🔴 Validate each test case
    for (const tc of testCases) {

      if (!tc.title || !tc.module) {
        return res.status(400).json({
          message:
            "Invalid JSON format. Each test case must include at least 'title' and 'module'."
        });
      }

      if (tc.steps && !Array.isArray(tc.steps)) {
        return res.status(400).json({
          message:
            "Invalid JSON format. 'steps' must be an array."
        });
      }
    }

    // ✅ If validation passed → insert data
    let createdCount = 0;

    for (const tc of testCases) {

      await prisma.testCase.create({
        data: {
          testCaseId:
            "TC-" + Date.now() + "-" + Math.floor(Math.random() * 1000),

          title: tc.title,
          description: tc.description || "",
          module: tc.module,
          priority: tc.priority || "Medium",
          severity: tc.severity || "Major",
          type: tc.type || "Functional",
          status: tc.status || "Draft",
          createdById: req.user.id,

          steps: {
            create: (tc.steps || []).map((s, i) => ({
              stepNumber: s.stepNumber || i + 1,
              action: s.action || "",
              expected: s.expected || ""
            }))
          }
        }
      });

      createdCount++;
    }

    res.json({
      message: `${createdCount} test cases imported successfully`
    });

  } catch (err) {
    console.error("JSON IMPORT ERROR:", err);
    res.status(500).json({ message: "Import failed" });
  }
});


app.post("/testcases", authenticate,  async (req, res) => {
  try {
    if (req.user.role !== "tester") {
      return res.status(403).json({ message: "Only testers can create test cases" });
    }

    const {
      title,
      description,
      module,
      priority,
      severity,
      type,
      status,
      preconditions,
      impactIfFails,          // ✅ ADD
  testDataRequirements,   // ✅ ADD
  cleanupSteps, 
     projectId,
postconditions,



      testData,
      environment,
      steps
    } = req.body;

    // ✅ Ignore deleted test cases
    const testCaseId = await generateTestCaseId();
    if (!projectId) {
      return res.status(400).json({
        message: "Project is required"
      });
    }

    const newTestCase = await prisma.testCase.create({
      data: {
        testCaseId,
        title,
        description,
        module,
        priority,
        severity,
        type,
        status,
        preconditions,
        postconditions,
        testData,
        environment,
        impactIfFails,
  testDataRequirements,
 
  cleanupSteps,
  project: {
  connect: { id: projectId }
},
        

        createdBy: {
          connect: { id: req.user.id }
        },

        steps: {
          create: steps.map((step, index) => ({
            stepNumber: index + 1,
            action: step.action,
            testData: step.testData,
            expected: step.expected
          }))
        }
      },
      include: { steps: true }
    });

if (req.body.customValues) {

  for (const fieldId in req.body.customValues) {

    await prisma.testCaseCustomValue.create({
      data: {
        value: req.body.customValues[fieldId],
        fieldId,
        testCaseId: newTestCase.id
      }
    });

  }
}

    res.json(newTestCase);

  } catch (err) {
    console.error("TEST CASE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/testcases/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "tester") {
      return res.status(403).json({ message: "Only testers can edit test cases" });
    }

    const testCaseId = req.params.id;

    const existing = await prisma.testCase.findUnique({
      where: { id: testCaseId },
      include: { steps: true }
    });

   const { changeLog } = req.body;

if (!changeLog || changeLog.trim() === "") {
  return res.status(400).json({
    message: "Change summary is required"
  });
}



    if (!existing) {
      return res.status(404).json({ message: "Test case not found" });
    }

    // ✅ SAVE OLD VERSION (CORRECT WAY)
    await prisma.testCaseVersion.create({
      data: {
        testCaseId: existing.id,
        version: existing.version,
        changeLog: req.body.changeLog || "Test case updated",
        snapshot: {
  title: existing.title,
  description: existing.description,
  module: existing.module,
  priority: existing.priority,
  severity: existing.severity,
  type: existing.type,
  status: existing.status,
  steps: existing.steps,
  version: existing.version
}
  // 👈 FULL JSON SNAPSHOT
      }
    });


    

    const {
      title,
      description,
      module,
      priority,
      severity,
      type,
      status,
      preconditions,
postconditions,
impactIfFails,
  testDataRequirements,
  environment,
  cleanupSteps,

      steps
    } = req.body;

    // Delete old steps
    await prisma.testStep.deleteMany({
      where: { testCaseId }
    });

    // Update test case
    const updated = await prisma.testCase.update({
      where: { id: testCaseId },
      data: {
        title,
        description,
        module,
        priority,
        severity,
        type,
        status,
        preconditions,
postconditions,

        version: { increment: 1 },

        steps: {
          create: steps.map((step, index) => ({
            stepNumber: index + 1,
            action: step.action,
            testData: step.testData,
            expected: step.expected
          }))
        }
      },
      include: { steps: true }
    });

    res.json(updated);

  } catch (err) {
    console.error("EDIT TEST CASE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/testcases/:id/clone", authenticate, async (req, res) => {
  try {
    const { includeAttachments } = req.body;

    const original = await prisma.testCase.findUnique({
      where: { id: req.params.id },
      include: {
        steps: true,
        attachments: true,
      },
    });

    if (!original)
      return res.status(404).json({ message: "Test case not found" });

    const cloned = await prisma.testCase.create({
      data: {
        testCaseId:
          "TC-" +
          new Date().getFullYear() +
          "-" +
          Date.now().toString().slice(-5),

        title: original.title + " (Copy)",
        description: original.description,
        module: original.module,
        priority: original.priority,
        severity: original.severity,
        type: original.type,
        status: "Draft",

        createdBy: {
  connect: { id: req.user.id }
},

        steps: {
          create: original.steps.map((s) => ({
            stepNumber: s.stepNumber,
            action: s.action,
            testData: s.testData,
            expected: s.expected,
          })),
        },

        attachments: includeAttachments
          ? {
              create: original.attachments.map((a) => ({
                fileName: a.fileName,
                fileType: a.fileType,
                filePath: a.filePath,
                uploadedById: req.user.id,
              })),
            }
          : undefined,
      },
    });

    res.json({
      message: "Test case cloned successfully",
      id: cloned.id,
    });

  } catch (err) {
    console.error("Clone error:", err);
    res.status(500).json({ message: "Clone failed" });
  }
});





app.delete("/testcases/:id", authenticate, async (req, res) => {
  try {
    // Tester or Admin only
    if (!["tester", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const testCase = await prisma.testCase.findUnique({
      where: { id: req.params.id }
    });

    if (!testCase || testCase.isDeleted) {
      return res.status(404).json({ message: "Test case not found" });
    }

    await prisma.testCase.update({
      where: { id: req.params.id },
      data: {
        isDeleted: true
      }
    });

    res.json({ message: "Test case deleted (soft delete)" });

  } catch (err) {
    console.error("DELETE TEST CASE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get("/testcases/:id", authenticate, async (req, res) => {
  try {
    const testCase = await prisma.testCase.findUnique({
  where: { id: req.params.id },
  include: {
    steps: true,
    attachments: {
      where: { isDeleted: false },
    },

    TestCaseCustomValue: {
          include: {
            field: true
          }
        },
    createdBy: {
      select: {
        id: true,
        name: true
      }
    }
  }
});


    if (!testCase || testCase.isDeleted) {
      return res.status(404).json({ message: "Test case not found" });
    }

    res.json(testCase);
  } catch (err) {
    console.error("GET TEST CASE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/testcases", authenticate, async (req, res) => {
  const { projectId } = req.query;
  const testCases = await prisma.testCase.findMany({
  where: {  projectId,
    isDeleted: false },
  include: {
    steps: true,
    attachments: true,
    TestCaseCustomValue: {
  include: {
    field: true
  }
},
    createdBy: {
      select: {
        id: true,
        name: true
      }
    }
  },
  orderBy: { testCaseId: "desc" }
});


  res.json(testCases);
});


app.put("/testcases/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "tester") {
      return res.status(403).json({ message: "Only testers allowed" });
    }

    const { title, description, module, priority, severity, type, status } = req.body;

    const updated = await prisma.testCase.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        module,
        priority,
        severity,
        type,
        status,
        version: { increment: 1 },
        updatedAt: new Date()
      },
      include: { steps: true }
    });

    res.json(updated);
  } catch (err) {
    console.error("UPDATE TEST CASE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put(
  "/testsuites/:suiteId/add-testcases",
  authenticate,
  async (req, res) => {
    try {
      if (req.user.role !== "tester") {
        return res
          .status(403)
          .json({ message: "Only testers allowed" });
      }

      const { suiteId } = req.params;
      const { testCaseIds } = req.body;

      const suite = await prisma.testSuite.findUnique({
  where: { id: suiteId }
});

if (!suite) {
  return res.status(404).json({ message: "Suite not found" });
}

      const result = await prisma.testCase.updateMany({
        where: {
          id: { in: testCaseIds },
          projectId: suite.projectId, 
          isDeleted: false,
        },
        data: {
          suiteId,
        },
      });

      res.json({
        message: "Test cases added to suite",
        updatedCount: result.count,
      });
    } catch (err) {
      console.error("ADD TO SUITE ERROR:", err);
      res.status(500).json({ message: "Failed to add test cases to suite" });
    }
  }
);

app.post(
  "/attachments",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { testCaseId, testStepId } = req.body;

      const attachment = await prisma.attachment.create({
        data: {
          fileName: req.file.originalname,
          fileType: req.file.mimetype,
          filePath: req.file.path,
          testCaseId: testCaseId || null,
          testStepId: testStepId || null,
          uploadedById: req.user.id,
        },
      });

      res.json(attachment);
    } catch (err) {
      console.error("ATTACHMENT ERROR:", err);
      res.status(500).json({ message: "Failed to upload attachment" });
    }
  }
);


app.post("/testcases/:id/attachments", authenticate, upload.single("file"), async (req, res) => {
  try {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const attachment = await prisma.attachment.create({
    data: {
      fileName: req.file.originalname,     // required
      fileType: req.file.mimetype,         // required
     
        filePath: req.file.path, // stored file name
      testCaseId: req.params.id,
       uploadedById: req.user.id,
    },
  });

  res.json(attachment);

} catch (err) {
  console.error("ATTACHMENT ERROR:", err);
  res.status(500).json({ message: "Failed to upload attachment" });
}

});


app.delete("/attachments/:id", authenticate, async (req, res) => {
  await prisma.attachment.update({
    where: { id: req.params.id },
    data: { isDeleted: true },
  });

  res.json({ message: "Attachment deleted" });
});

app.post("/testcases/:id/template", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "tester") {
      return res.status(403).json({ message: "Only testers can create templates" });
    }

    const testCase = await prisma.testCase.findUnique({
      where: { id: req.params.id },
      include: { steps: true },
    });

    if (!testCase) {
      return res.status(404).json({ message: "Test case not found" });
    }

    const template = await prisma.testCaseTemplate.create({
      data: {
        name: testCase.title,
        description: testCase.description,
        module: testCase.module,
        priority: testCase.priority,
        severity: testCase.severity,
        type: testCase.type,
        createdById: req.user.id,

        steps: {
          create: testCase.steps.map(step => ({
            stepNumber: step.stepNumber,
            action: step.action,
            testData: step.testData,
            expected: step.expected,
          }))
        }
      },
      include: { steps: true }
    });

    res.json(template);
  } catch (err) {
    console.error("TEMPLATE ERROR:", err);
    res.status(500).json({ message: "Failed to create template" });
  }
});

app.get("/templates", authenticate, async (req, res) => {
  try {
    const templates = await prisma.testCaseTemplate.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(templates);
  } catch (err) {
    console.error("TEMPLATE FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch templates" });
  }
});



app.post("/templates/:id/create-testcase", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "tester") {
      return res.status(403).json({ message: "Only testers can create test cases" });
    }

    const template = await prisma.testCaseTemplate.findUnique({
      where: { id: req.params.id },
      include: { steps: true },
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const testCaseId = await generateTestCaseId();

    const testCase = await prisma.testCase.create({
      data: {
        testCaseId,
        title: template.name,
        description: template.description,
        module: template.module,
        priority: template.priority,
        severity: template.severity,
        type: template.type,
        status: "Draft",
        createdBy: {
  connect: { id: req.user.id }
},

        steps: {
          create: template.steps.map(step => ({
            stepNumber: step.stepNumber,
            action: step.action,
            testData: step.testData,
            expected: step.expected
          }))
        }
      },
      include: { steps: true }
    });

    res.json(testCase);
  } catch (err) {
    console.error("CREATE FROM TEMPLATE ERROR:", err);
    res.status(500).json({ message: "Failed to create test case from template" });
  }
});





app.post(
  "/testcases/import/preview",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath = req.file.path;
      const ext = req.file.originalname.split(".").pop();

      let testCases = [];

      if (ext === "csv") {
        const csv = fs.readFileSync(filePath, "utf8");
        const rows = csv.split("\n").map(r => r.split(","));

        testCases = rows.slice(1).map(row => ({
          title: row[0],
          module: row[1],
          priority: row[2],
          severity: row[3],
          type: row[4],
          status: row[5],
        }));
      }

      if (ext === "xlsx") {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        testCases = jsonData.map(row => ({
          title: row.Title,
          module: row.Module,
          priority: row.Priority,
          severity: row.Severity,
          type: row.Type,
          status: row.Status,
        }));
      }

      fs.unlinkSync(filePath);

      res.json({
        message: "Preview successful",
        totalTestCases: testCases.length,
        preview: testCases,
      });

    } catch (err) {
      console.error("IMPORT PREVIEW ERROR:", err);
      res.status(500).json({ message: "Preview failed" });
    }
  }
);


app.post("/testcases/import/confirm", authenticate, async (req, res) => {
  try {
    const { testCases } = req.body;
   const {  projectId } = req.body;

if (!projectId) {
  return res.status(400).json({
    message: "Project ID is required for import"
  });
}

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        message: "No valid test cases to import"
      });
    }

    let createdCount = 0;

    for (const tc of testCases) {

      // 🔴 Skip invalid objects
      if (!tc || typeof tc !== "object") continue;

      await prisma.testCase.create({
        data: {
          testCaseId:
            "TC-" +
            new Date().getFullYear() +
            "-" +
            Date.now().toString().slice(-5),

          // ⭐ REQUIRED FIELDS WITH DEFAULTS
          title: tc.title?.trim() || "Untitled Test Case",
          description: tc.description || "",
          module: tc.module || "General",

          priority: tc.priority || "Medium",
          severity: tc.severity || "Major",
          type: tc.type || "Functional",
          status: tc.status || "Draft",
project: {
      connect: { id: projectId }
    },
         
    createdBy: {
  connect: { id: req.user.id }
},

          // ⭐ SAFE STEP CREATION
          steps: {
            create: Array.isArray(tc.steps)
              ? tc.steps.map((s, i) => ({
                  stepNumber: s?.stepNumber || i + 1,
                  action: s?.action || "",
                  expected: s?.expected || ""
                }))
              : []
          }
        }
      });

      createdCount++;
    }

    res.json({
      message: `${createdCount} test cases imported successfully`
    });

  } catch (err) {
    console.error("IMPORT CONFIRM ERROR:", err);
    res.status(500).json({
      message: "Import failed due to invalid data format"
    });
  }
});

app.get("/dashboard/tester", authenticate, async (req, res) => {
  try {
    const total = await prisma.testCase.count({
      where: { isDeleted: false },
    });

    const draft = await prisma.testCase.count({
      where: { status: "Draft", isDeleted: false },
    });

    const approved = await prisma.testCase.count({
      where: { status: "Approved", isDeleted: false },
    });

    res.json({
      total,
      draft,
      approved,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
});

app.get("/testcases/:id/versions", authenticate, async (req, res) => {
  try {

    const versions = await prisma.testCaseVersion.findMany({
      where: { testCaseId: req.params.id },
      orderBy: { version: "desc" }
    });

    res.json(versions);

  } catch (err) {
    console.error("VERSION LIST ERROR:", err);
    res.status(500).json({ message: "Failed to fetch versions" });
  }
});

app.get("/versions/:versionId", authenticate, async (req, res) => {
  try {

    const version = await prisma.testCaseVersion.findUnique({
      where: { id: req.params.versionId }
    });

    if (!version)
      return res.status(404).json({ message: "Version not found" });

    res.json(version);

  } catch (err) {
    console.error("VERSION DETAIL ERROR:", err);
    res.status(500).json({ message: "Failed to fetch version" });
  }
});







app.post("/suites", authenticate, async (req, res) => {
  try {
    const { name, description, module, parentId,projectId } = req.body;

    const suite = await prisma.testSuite.create({
      data: {
        name,
        description,
        module,
        project: {
      connect: { id: projectId }
    },

          parent: parentId
      ? { connect: { id: parentId } }
      : undefined,

    createdBy: {
      connect: { id: req.user.id }
    }
      },
    });

    res.json(suite);
  } catch (err) {
    console.error("CREATE SUITE ERROR:", err);
    res.status(500).json({ message: "Failed to create suite" });
  }
});



app.put("/testcases/:id/assign-suite", authenticate, async (req, res) => {
  try {
    const { suiteId } = req.body;

    const updated = await prisma.testCase.update({
      where: { id: req.params.id },
      data: { suiteId },
    });

    res.json(updated);
  } catch (err) {
    console.error("ASSIGN SUITE ERROR:", err);
    res.status(500).json({ message: "Failed to assign suite" });
  }
});

app.put("/suites/:id", authenticate, async (req, res) => {
  try {
    const { name, description, module, parentId } = req.body;

    const updated = await prisma.testSuite.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        module,
        parent: parentId
    ? { connect: { id: parentId } }
    : { disconnect: true }
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("UPDATE SUITE ERROR:", error);
    res.status(500).json({ message: "Failed to update suite" });
  }
});

app.delete("/suites/:id", authenticate, async (req, res) => {
  try {
    await prisma.testSuite.update({
      where: { id: req.params.id },
      data: { isDeleted: true },
    });

    res.json({ message: "Suite deleted successfully" });
  } catch (error) {
    console.error("DELETE SUITE ERROR:", error);
    res.status(500).json({ message: "Failed to delete suite" });
  }
});

app.put("/suites/:id/assign", authenticate, async (req, res) => {
  try {
    const { testCaseIds } = req.body;

    await prisma.testCase.updateMany({
      where: {
        id: { in: testCaseIds },
      },
      data: {
        suiteId: req.params.id,
      },
    });

    res.json({ message: "Test cases assigned to suite" });
  } catch (error) {
    console.error("ASSIGN ERROR:", error);
    res.status(500).json({ message: "Failed to assign test cases" });
  }
});

app.get("/suites/:id", authenticate, async (req, res) => {
  try {
    const suite = await prisma.testSuite.findUnique({
      where: { id: req.params.id },
      include: {
        testCases: {
          where: { isDeleted: false },
        },
      },
    });

    res.json(suite);
  } catch (error) {
    console.error("FETCH SUITE DETAIL ERROR:", error);
    res.status(500).json({ message: "Failed to fetch suite" });
  }
});

app.get("/testsuites", authenticate, async (req, res) => {
  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({ message: "Project is required" });
  }

  const suites = await prisma.testSuite.findMany({
    where: {
      isDeleted: false,
      projectId,   // 🔥 ADD THIS
    },
    select: {
      id: true,
      name: true
    },
    orderBy: { name: "asc" }
  });

  res.json(suites);
});

app.get("/templates/categories", authenticate, async (req, res) => {
  const categories = await prisma.testCaseTemplate.findMany({
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" }
  });

  res.json(categories.map(c => c.category));
});

app.get("/templates", authenticate, async (req, res) => {
  const { category } = req.query;

  const templates = await prisma.testCaseTemplate.findMany({
    where: {
      category: category || undefined,
      isGlobal: true
    },
    include: { steps: true },
    orderBy: { name: "asc" }
  });

  res.json(templates);
});

app.post("/templates", authenticate, async (req, res) => {
  const {
    name,
    description,
    module,
    priority,
    severity,
    type,
    category,
    steps
  } = req.body;

  const template = await prisma.testCaseTemplate.create({
    data: {
      name,
      description,
      module,
      priority,
      severity,
      type,
      category,
      isGlobal: true,
      createdById: req.user.id,

      steps: {
        create: steps || []
      }
    }
  });

  res.json(template);
});

app.put("/templates/:id", authenticate, async (req, res) => {
  try {
    const { category } = req.body;

    const updated = await prisma.testCaseTemplate.update({
      where: { id: req.params.id },
      data: { category },
    });

    res.json(updated);

  } catch (err) {
    console.error("Template update error:", err);
    res.status(500).json({ message: "Failed to update template" });
  }
});

app.get("/admin/testcases", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { projectId } = req.query;

  const testCases = await prisma.testCase.findMany({
    where: {
      projectId: projectId,
      isDeleted: false
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(testCases);
});


app.put(
  "/admin/testcases/:id/restore",
  authenticate,
  async (req, res) => {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    await prisma.testCase.update({
      where: { id: req.params.id },
      data: { isDeleted: false },
    });

    res.json({ message: "Test case restored" });
  }
);

app.delete(
  "/admin/testcases/:id/permanent",
  authenticate,
  async (req, res) => {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    await prisma.testCase.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Test case permanently deleted" });
  }
);

app.get("/admin/testcases/deleted", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({ message: "ProjectId required" });
  }

  const deleted = await prisma.testCase.findMany({
    where: {
      projectId,
      isDeleted: true
    },
    orderBy: {
      updatedAt: "desc"
    }
  });

  res.json(deleted);
});


app.post("/api/executions/start", async (req, res) => {
  try {
    const { testCaseId, userId, testRunId } = req.body;

    if (!testCaseId || !userId) {
      return res.status(400).json({
        error: "testCaseId and userId required"
      });
    }

    const execution = await prisma.testExecution.create({
      data: {
        testCaseId,
        executedById: userId,
        
        testRunId: testRunId || null,   // ⭐ IMPORTANT
        status: "InProgress"
      }
    });

    res.json(execution);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/executions/step", async (req, res) => {
  try {
    const {
      executionId,
      stepNumber,
      action,
      expected,
      actual,
      status
    } = req.body;

    const step = await prisma.executionStep.create({
      data: {
        executionId,
        stepNumber,
        action,
        expected,
        actual,
        status
      }
    });

    res.json(step);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/executions/complete", async (req, res) => {
  try {
    const { executionId, finalStatus } = req.body;

    const execution = await prisma.testExecution.update({
      where: { id: executionId },
      data: {
        status: finalStatus,
        completedAt: new Date()
      }
    });

    res.json(execution);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/executions/:id", async (req, res) => {
  try {
    const execution = await prisma.testExecution.findUnique({
      where: { id: req.params.id },
      include: { steps: true }
    });

    res.json(execution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all test cases for tester
app.get("/api/testcases", async (req, res) => {
  try {
    const testCases = await prisma.testCase.findMany({
      include: { steps: true },
      where: { status: "Approved" } // Only executable
    });

    res.json(testCases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/testcases/:id", async (req, res) => {
  try {
    const testCase = await prisma.testCase.findUnique({
      where: { id: req.params.id },
      include: { steps: true }
    });

    if (!testCase) {
      return res.status(404).json({ message: "Test case not found" });
    }

    res.json(testCase);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/execution/save", async (req, res) => {
  try {
    const { executionId, steps } = req.body;

    if (!executionId) {
      return res.status(400).json({ message: "Execution ID missing" });
    }

    if (!Array.isArray(steps)) {
      return res.status(400).json({ message: "Steps missing" });
    }

    for (const step of steps) {
      await prisma.executionStep.upsert({
        where: {
          executionId_stepNumber: {
            executionId,
            stepNumber: step.stepNumber,
          },
        },
        update: {
          actual: step.actual,
          status: step.status,
          notes: step.notes
        },
        create: {
          executionId,
          stepNumber: step.stepNumber,
          action: step.action,
          expected: step.expected,
          actual: step.actual,
          status: step.status,
          notes: step.notes
        },
      });
    }

    res.json({ message: "Progress saved" });

  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});




app.post(
  "/api/execution/upload",
  upload.single("file"),
  async (req, res) => {

    try {

      const { testCaseId, stepNumber } = req.body;

      const evidence = await prisma.executionEvidence.create({
        data: {
          testCaseId,
          stepNumber: parseInt(stepNumber),
          filePath: req.file.filename,
          fileType: req.file.mimetype,
        },
      });

      res.json(evidence);  // ✅ REQUIRED

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.post("/api/testruns", async (req, res) => {
  try {

    const {
  name,
  description,
  startDate,
  endDate,
  testCaseIds,
  testerIds,
  projectId,
  milestoneId     // 🔥 ADD
} = req.body;

if (!projectId) {
  return res.status(400).json({ message: "Project is required" });
}

    const run = await prisma.testRun.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
          projectId, 
          milestoneId: milestoneId || null,

        testCases: {
          create: testCaseIds.map(id => ({
            testCaseId: id
          }))
        },

        assignments: {
          create: testerIds.map(id => ({
            testerId: id
          }))
        }
      }
    });

     for (const testerId of testerIds) {
      await sendNotification({
        userId: testerId,
        type: "TEST_ASSIGNED",
        title: `New Test Run Assigned`,
        message: `You have been assigned to test run: ${run.name}`,
        referenceId: run.id
      });
    }

    res.json(run);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/testruns", async (req, res) => {
  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({ message: "Project is required" });
  }

  const runs = await prisma.testRun.findMany({
     where: { projectId }, 
    include: {
      
      testCases: true,
      assignments: true
    }
  });

  res.json(runs);
});

app.get("/api/testruns/:id/progress", async (req, res) => {

  const runId = req.params.id;

  // Total test cases in run
  const total = await prisma.testRunCase.count({
    where: { testRunId: runId }
  });

  // Completed executions for this run
  const completed = await prisma.testExecution.count({
    where: {
      testRunId: runId,
      completedAt: { not: null }
    }
  });

  const progress =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  res.json({ total, completed, progress });

});


app.get("/api/testruns/my/:testerId", async (req, res) => {

  const runs = await prisma.testRun.findMany({
    where: {
      assignments: {
        some: { testerId: req.params.testerId }
      }
    },
    include: {
      testCases: true
    }
  });

  res.json(runs);
});


app.get("/api/testruns/:id", async (req, res) => {

  const run = await prisma.testRun.findUnique({
    where: { id: req.params.id },
    include: {
      testCases: true,
      assignments: {
        include: {
          tester: true
        }

      }
    }
  });

  res.json(run);
});

app.put("/api/testruns/:id", async (req, res) => {

  const {
    name,
    description,
    startDate,
    endDate,
    testCaseIds,
    testerIds
  } = req.body;

  const id = req.params.id;

  // Remove old assignments
  await prisma.testRunCase.deleteMany({
    where: { testRunId: id }
  });

  await prisma.testRunAssignment.deleteMany({
    where: { testRunId: id }
  });

  // Update run + add new relations
  const updated = await prisma.testRun.update({
    where: { id },
    data: {
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),

      testCases: {
        create: testCaseIds.map(tcId => ({
          testCaseId: tcId
        }))
      },

      assignments: {
        create: testerIds.map(tid => ({
          testerId: tid
        }))
      }
    }
  });

  res.json(updated);
});


app.delete("/api/testruns/:id", async (req, res) => {

  const id = req.params.id;

  // Remove relations first
  await prisma.testRunCase.deleteMany({
    where: { testRunId: id }
  });

  await prisma.testRunAssignment.deleteMany({
    where: { testRunId: id }
  });

  // Delete run
  await prisma.testRun.delete({
    where: { id }
  });

  res.json({ success: true });
});


app.get("/api/my-runs/:testerId", async (req, res) => {

  const testerId = req.params.testerId;

  const runs = await prisma.testRun.findMany({
    where: {
      projectId: req.query.projectId,
      assignments: {
        some: { testerId }
      }
    },
    include: {
      assignments: true,
      testCases: true
    }
  });

  res.json(runs);
});



app.get("/api/executions/by-run/:runId", async (req, res) => {

  const executions = await prisma.testExecution.findMany({
    where: { testRunId: req.params.runId }
  });

  res.json(executions);

});

app.get("/api/testruns/:id/executions", async (req, res) => {

  const executions = await prisma.testExecution.findMany({
    where: { testRunId: req.params.id },
    orderBy: { startedAt: "desc" }
  });

  // Fetch tester details manually
  const userIds = executions.map(e => e.executedById);

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true }
  });

  const userMap = {};
  users.forEach(u => userMap[u.id] = u.name);

  const result = executions.map(e => ({
    ...e,
    testerName: userMap[e.executedById] || "Unknown"
  }));

  res.json(result);

});

app.get("/api/testruns/:id/executions", async (req, res) => {

  const runId = req.params.id;

  const executions = await prisma.testExecution.findMany({
    where: { testRunId: runId },
    orderBy: { startedAt: "desc" }
  });

  if (executions.length === 0) return res.json([]);

  // ⭐ Get testers
  const testerIds = executions
    .map(e => e.executedById)
    .filter(Boolean);

  const testers = await prisma.user.findMany({
    where: { id: { in: testerIds } },
    select: { id: true, name: true }
  });

  const testerMap = {};
  testers.forEach(t => {
    testerMap[t.id] = t.name;
  });

  // ⭐ Add tester name + time taken
  const result = executions.map(exec => {

    let timeTaken = null;

    if (exec.completedAt) {
      const diff =
        new Date(exec.completedAt) - new Date(exec.startedAt);

      const seconds = Math.floor(diff / 1000);
      const mins = Math.floor(seconds / 60);
      const hrs = Math.floor(mins / 60);

      timeTaken = `${hrs}h ${mins % 60}m ${seconds % 60}s`;
    }

    return {
      ...exec,
      testerName: testerMap[exec.executedById] || "Unknown",
      timeTaken
    };
  });

  res.json(result);

});

app.get("/api/executions/my/:testerId", async (req, res) => {

  const testerId = req.params.testerId;

  const executions = await prisma.testExecution.findMany({
    where: { executedById: testerId },

    orderBy: { startedAt: "desc" }
  });

  res.json(executions);

});

app.get("/api/executions/run/:runId/:testerId", async (req, res) => {

  const { runId, testerId } = req.params;

  const executions = await prisma.testExecution.findMany({
    where: {
      testRunId: runId,
      executedById: testerId
    },
    orderBy: { startedAt: "desc" }
  });

  res.json(executions);

});

app.post("/api/bugs", upload.single("evidence"), async (req, res) => {

  const {
    title,
    description,
    severity,
    priority,
    testCaseId,
    runId,
    stepNumber,
    reportedById ,
    stepsToReproduce,
expectedBehavior,
actualBehavior,
type,
 projectId, 
environment,
affectedVersion  // ⭐ REQUIRED
  } = req.body;

const count = await prisma.bug.count();

  const bugId = `BUG-${new Date().getFullYear()}-${String(
    count + 1
  ).padStart(5, "0")}`;


  const bug = await prisma.bug.create({
    data: {
      bugId, 
      title,
      description,
      severity,
      priority,
      testCaseId,
      runId,
      projectId,
      stepNumber: parseInt(stepNumber),
       evidencePath: req.file?.filename,
     reportedById: reportedById,
      stepsToReproduce,
    expectedBehavior,
    actualBehavior,
    type,
    environment,
    affectedVersion   // ⭐ LINK TO TESTER
    }
  });

  res.json(bug);

});

app.get("/api/bugs", async (req, res) => {
  try {
    const {
      projectId,
      priority,
      assignedTo,
      sort
    } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "projectId required" });
    }

    const where = { projectId };

    // ⭐ Priority Filter
    if (priority) {
      where.priority = priority;
    }

    // ⭐ Unassigned Filter
    if (assignedTo === "null") {
      where.assignedToId = null;
    }

    // ⭐ Assigned To Specific User
    if (assignedTo && assignedTo !== "null") {
      where.assignedToId = assignedTo;
    }

    // ⭐ Sorting
    let orderBy = { createdAt: "desc" };

    if (sort === "recent") {
  orderBy = { createdAt: "desc" };
}

    const bugs = await prisma.bug.findMany({
      where,
      orderBy,
      include: {
        assignedTo: true
      }
    });

    res.json(bugs);

  } catch (err) {
    console.error("BUG FETCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/bugs/my/:testerId", async (req, res) => {

  const testerId = req.params.testerId;
   const { projectId } = req.query;

  const bugs = await prisma.bug.findMany({
    where: {
      reportedById: testerId,
      projectId
    },
     include: {
      assignedTo: true   // ⭐ MUST BE HERE
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(bugs);

});

app.get("/api/bugs/export", async (req, res) => {
  const { projectId } = req.query;

  const bugs = await prisma.bug.findMany({
    
     where: { projectId },
    orderBy: { createdAt: "desc" }
  });

  // CSV header
  let csv =
    "Bug ID,Title,Description,Severity,Priority,Status,Test Case,Run,Reported By,Created At\n";

  // Rows
  bugs.forEach(bug => {
    csv += `${bug.bugId || ""},"${bug.title}","${bug.description}",${bug.severity},${bug.priority},${bug.status},${bug.testCaseId || ""},${bug.runId || ""},${bug.reportedById || ""},${bug.createdAt}\n`;
  });





  res.header("Content-Type", "text/csv");
  res.attachment("bug_reports.csv");
  res.send(csv);
});



app.get("/api/executions/history/:testCaseId", async (req, res) => {

  const testCaseId = req.params.testCaseId;

  const executions = await prisma.testExecution.findMany({
    where: { testCaseId },
    orderBy: { startedAt: "desc" }
  });

  res.json(executions);

});

app.get("/api/executions/details/:id", async (req, res) => {

  const execution = await prisma.testExecution.findUnique({
    where: { id: req.params.id },
    include: { steps: true }
  });

  res.json(execution);

});


app.post("/suites/:id/execute", authenticate, async (req, res) => {

  try {

    const suiteId = req.params.id;
    const { mode } = req.body;

    // Get suite + test cases
    const suite = await prisma.testSuite.findUnique({
      where: { id: suiteId },
      include: { testCases: true }
    });

    if (!suite) {
      return res.status(404).json({
        message: "Suite not found"
      });
    }

    if (suite.testCases.length === 0) {
      return res.status(400).json({
        message: "No test cases in suite"
      });
    }

    // 🔥 Create Test Run from suite
    const run = await prisma.testRun.create({
      data: {
        name: `${suite.name} Execution`,
        description: `Execution of suite: ${suite.name}`,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        status: "InProgress",

        testCases: {
          create: suite.testCases.map(tc => ({
            testCaseId: tc.id
          }))
        }
      }
    });

    res.json({
      runId: run.id,
      mode
    });

  } catch (err) {
    console.error("SUITE EXECUTION ERROR:", err);
    res.status(500).json({
      message: "Failed to execute suite"
    });
  }
});

app.get("/suites/:id", authenticate, async (req, res) => {
  try {

    const suite = await prisma.testSuite.findFirst({
      where: { id: req.params.id , isArchived: false }
    });

    if (!suite) {
      return res.status(404).json({ message: "Suite not found" });
    }

    res.json(suite);

  } catch (err) {
    console.error("FETCH SUITE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch suite" });
  }
});



app.get("/api/suites/:suiteId/report", async (req, res) => {
  try {

    const { suiteId } = req.params;

    // 1️⃣ Get all test cases in suite
    const cases = await prisma.testCase.findMany({
      where: { suiteId }
    });

    if (cases.length === 0) {
      return res.json({
        total: 0,
        passed: 0,
        failed: 0,
        blocked: 0,
        skipped: 0,
        executions: []
      });
    }

    const caseIds = cases.map(c => c.id);

    // 2️⃣ Get executions for those test cases
    const executions = await prisma.testExecution.findMany({
      where: {
        testCaseId: { in: caseIds }
      },
      include: {
        executedBy: true   // if relation exists
      },
      orderBy: { startedAt: "desc" }
    });

    // 3️⃣ Calculate summary
    const summary = {
      total: executions.length,
      passed: executions.filter(e => e.status === "Passed").length,
      failed: executions.filter(e => e.status === "Failed").length,
      blocked: executions.filter(e => e.status === "Blocked").length,
      skipped: executions.filter(e => e.status === "Skipped").length
    };

    res.json({
      ...summary,
      executions
    });

  } catch (err) {
    console.error("SUITE REPORT ERROR:", err);
    res.status(500).json({ message: "Failed to get report" });
  }
});



app.put("/api/suites/:suiteId/reorder", async (req, res) => {

  const { suiteId } = req.params;
  const { orderedIds } = req.body;
  // orderedIds = array of testCaseIds in new order

  try {

    const updates = orderedIds.map((id, index) =>
      prisma.testCase.update({
        where: { id },
        data: { order: index + 1 }
      })
    );

    await Promise.all(updates);

    res.json({ message: "Order updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reorder failed" });
  }

});

app.get("/api/suites/:suiteId/testcases", async (req, res) => {

  const { suiteId } = req.params;

  try {

    const cases = await prisma.testCase.findMany({
     where: {
  suiteId: suiteId
},
      orderBy: { order: "asc" }   // ⭐ ADD HERE
    });

    res.json(cases);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load suite cases" });
  }

});





app.post("/api/suites/:suiteId/clone", authenticate, async (req, res) => {
  const { suiteId } = req.params;

  try {

    // 1️⃣ Get original suite
    const original = await prisma.testSuite.findUnique({
      where: { id: suiteId }
    });

    if (!original) {
      throw new Error("Suite not found");
    }

    // 2️⃣ Get original test cases
    const cases = await prisma.testCase.findMany({
      where: { suiteId },
      include: { steps: true },
      orderBy: { order: "asc" }
    });

    const result = await prisma.$transaction(async (tx) => {

      // 3️⃣ Create cloned suite
      const newSuite = await tx.testSuite.create({
        data: {
          name: original.name + " (Copy)",
          description: original.description,
          module: original.module,
          parentId: original.parentId,
          projectId: original.projectId,
          createdById: req.user.id
        }
      });

      for (const tc of cases) {

        // 🔹 Generate unique testCaseId without DB lookup
        const newTestCaseId =
          "TC-" + Date.now() + "-" + Math.floor(Math.random() * 10000);

        const newCase = await tx.testCase.create({
          data: {
            testCaseId: newTestCaseId,
            title: tc.title,
            description: tc.description,
            module: tc.module,
            priority: tc.priority,
            severity: tc.severity,
            type: tc.type,
            status: tc.status,
            preconditions: tc.preconditions,
            suiteId: newSuite.id,
            projectId: original.projectId,
            createdById: tc.createdById || req.user.id,
            order: tc.order
          }
        });

        if (tc.steps && tc.steps.length > 0) {
          await tx.testStep.createMany({
            data: tc.steps.map(step => ({
              testCaseId: newCase.id,
              stepNumber: step.stepNumber,
              action: step.action,
              expected: step.expected,
              testData: step.testData
            }))
          });
        }

      }

      return newSuite;

    });

    res.json({
      message: "Suite cloned successfully",
      suite: result
    });

  } catch (err) {
    console.error("CLONE ERROR:", err);
    res.status(500).json({ message: "Clone failed" });
  }
});

app.put("/api/suites/:suiteId/archive", async (req, res) => {

  const { suiteId } = req.params;

  try {

    await prisma.testSuite.update({
      where: { id: suiteId },
      data: { isArchived: true }
    });

    res.json({ message: "Suite archived" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Archive failed" });
  }

});

app.put("/api/suites/:suiteId/restore", async (req, res) => {

  const { suiteId } = req.params;

  try {

    await prisma.testSuite.update({
      where: { id: suiteId },
      data: { isArchived: false }
    });

    res.json({ message: "Suite restored" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Restore failed" });
  }

});

app.get("/suites", authenticate, async (req, res) => {
  try {

    const archived = req.query.archived === "true";
    const { projectId } = req.query;

    const suites = await prisma.testSuite.findMany({
      where: {
        projectId,
        isArchived: archived,
        isDeleted: false
      },
      include: {
        parent: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // 🔥 manually count testcases
    const suitesWithCount = await Promise.all(
      suites.map(async (suite) => {

        const count = await prisma.testCase.count({
          where: {
            suiteId: suite.id,
            isDeleted: false
          }
        });

        return {
          ...suite,
          _count: { testCases: count }
        };

      })
    );

    res.json(suitesWithCount);

  } catch (err) {
    console.error("FETCH SUITES ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch suites"
    });
  }
});




app.get("/dashboard/developer", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const assigned = await prisma.bug.count({
      where: { assignedToId: userId }
    });

    const inProgress = await prisma.bug.count({
      where: {
        assignedToId: userId,
        status: "In Progress"
      }
    });

    const fixed = await prisma.bug.count({
      where: {
        assignedToId: userId,
        status: "Fixed"
      }
    });

    const retest = await prisma.bug.count({
      where: {
        assignedToId: userId,
        status: "Pending Retest"
      }
    });

    res.json({
      assigned,
      inProgress,
      fixed,
      retest
    });

  } catch (err) {
    console.error("DEV DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Failed to load developer stats" });
  }
});



app.get("/developer/issues", authenticate, async (req, res) => {

  const userId = req.user.id;

  const issues = await prisma.bug.findMany({
    where: {
      assignedToId: userId
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(issues);

});

app.get("/api/reports", authenticate, async (req, res) => {

  const runs = await prisma.testRun.findMany({
    orderBy: { createdAt: "desc" }
  });

  res.json(runs);

});


app.get("/api/users/developers", async (req, res) => {

  const developers = await prisma.user.findMany({
    where: { role: "developer" },
    select: { id: true, name: true, email: true }
  });

  res.json(developers);

});

app.put("/api/bugs/:id/assign", async (req, res) => {
  try {
    const { developerId } = req.body;

    // 1️⃣ Update bug
    const bug = await prisma.bug.update({
      where: { id: req.params.id },
      data: { assignedToId: developerId },
      include: { assignedTo: true }
    });

    // 2️⃣ Send notification to assigned developer
    await sendNotification({
      userId: developerId,
      type: "BUG_ASSIGNED",
      title: `New bug ${bug.bugId || bug.id} assigned to you`,
      referenceId: bug.id,
      message: `Bug "${bug.title}" has been assigned to you.`,
      link: `/bugs/${bug.id}`,
      emailTemplate: `
        <h2>New Bug Assigned</h2>
        <p>You have been assigned bug <strong>${bug.bugId || bug.id}</strong></p>
        <p>${bug.title}</p>
      `
      
    });

    res.json(bug);

  } catch (err) {
    console.error("ASSIGN BUG ERROR:", err);
    res.status(500).json({ message: "Failed to assign bug" });
  }
});


app.put("/api/bugs/:id/status", async (req, res) => {
  try {
    const bugId = req.params.id;
    const { status, fixNotes, commitLink,branchName, resolutionNote } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    const payload = token
      ? JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      : null;

    const role = payload?.role;

    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
      include: {
        assignedTo: true,
        reportedBy: true
      }
    });

    if (!bug) return res.status(404).json({ message: "Bug not found" });

    // ROLE PERMISSIONS
    const devActions = ["In Progress", "Fixed", "Won't Fix", "Duplicate"];
    const testerActions = ["Verified", "Reopened", "Closed"];

    if (role === "developer" && !devActions.includes(status)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (role === "tester" && !testerActions.includes(status)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updateData = { status };

    if (status === "In Progress") {
      updateData.startedAt = new Date();
    }

    if (status === "Fixed") {
      updateData.fixNotes = fixNotes || null;
      updateData.commitLink = commitLink || null;
      updateData.branchName = branchName || null;
      updateData.fixedAt = new Date();
    }

    if (status === "Won't Fix") {
      updateData.resolutionNote = resolutionNote || null;
    }

    const updatedBug = await prisma.bug.update({
      where: { id: bugId },
      data: updateData
    });

    // 🔔 NOTIFICATIONS SECTION

    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === "fixed" && bug.reportedById) {
      await sendNotification({
        userId: bug.reportedById,
        type: "RETEST",
        title: `Bug ${bug.bugId || bug.id} ready for verification`,
        message: `Developer marked this bug as Fixed.`,
        referenceId: bug.id
      });
    }

    if (normalizedStatus === "won't fix" && bug.reportedById) {
      await sendNotification({
        userId: bug.reportedById,
        type: "STATUS_CHANGED",
        title: `Bug ${bug.bugId || bug.id} marked Won't Fix`,
        message: `Developer marked this bug as Won't Fix.`,
        referenceId: bug.id
      });
    }

    if (normalizedStatus === "reopened" && bug.assignedToId) {
      await sendNotification({
        userId: bug.assignedToId,
        type: "STATUS_CHANGED",
        title: `Bug ${bug.bugId || bug.id} reopened`,
        message: `Tester reopened this bug.`,
        referenceId: bug.id
      });
    }

    res.json(updatedBug);

  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});
app.get("/api/bugs/assigned/:developerId", async (req, res) => {
  try {

    const { developerId } = req.params;

    const bugs = await prisma.bug.findMany({
      where: {
        assignedToId: developerId
      },
      include: {
        reportedBy: true,
        assignedTo: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(bugs);

  } catch (err) {
    console.error("FETCH ASSIGNED BUGS ERROR:", err);
    res.status(500).json({ message: "Failed to load assigned bugs" });
  }
});

app.post("/api/bugs/:bugId/comments", async (req, res) => {

  try {

    const { bugId } = req.params;
    const { content, parentId } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const authorId = payload.id;

    // ⭐ Extract @mentions
    const mentionUsernames = (content.match(/@[\w.]+/g) || [])
      .map(m => m.substring(1));

    // ⭐ Create comment
    const comment = await prisma.bugComment.create({
      data: {
        content,
        bugId,
        authorId,
        parentId,
        mentions: mentionUsernames
      },
      include: { author: true }
    });

    // ============================================
    // 🔔 SEND NOTIFICATIONS
    // ============================================

    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
      include: {
        assignedTo: true,
        reportedBy: true
      }
    });

    if (!bug) return res.json(comment);

    const recipients = new Set();

    // ✅ Assigned developer
    if (bug.assignedToId) {
      recipients.add(bug.assignedToId);
    }

    // ✅ Reporter
    if (bug.reportedById) {
      recipients.add(bug.reportedById);
    }

    // ✅ Mentioned users
    if (mentionUsernames.length > 0) {
      const mentionedUsers = await prisma.user.findMany({
        where: {
          name: { in: mentionUsernames }
        }
      });

      mentionedUsers.forEach(u => {
        recipients.add(u.id);
      });
    }

    // ❌ Remove author (no self notification)
    recipients.delete(authorId);

    // 🔔 Send notification to each
    for (const userId of recipients) {
      await sendNotification({
        userId,
        type: "COMMENT",
        title: `New comment on Bug ${bug.bugId || bug.id}`,
        message: `${comment.author.name} commented on this bug`,
        referenceId: bug.id
      });
    }

    res.json(comment);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to post comment" });
  }

});

app.get("/api/bugs/:bugId/comments", async (req, res) => {

  const { bugId } = req.params;

  const comments = await prisma.bugComment.findMany({
    where: { bugId },
    include: {
      author: true,
      replies: {
        include: { author: true }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  res.json(comments);
});



app.put("/api/comments/:id", async (req, res) => {

  const commentId = req.params.id;
  const { content } = req.body;

  const token = req.headers.authorization?.split(" ")[1];
  const payload = token
    ? JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    : null;

  const userId = payload?.id;

  const comment = await prisma.bugComment.findUnique({
    where: { id: commentId }
  });

  if (!comment)
    return res.status(404).json({ message: "Comment not found" });

  // ✅ Author only
  if (comment.authorId !== userId)
    return res.status(403).json({ message: "Not allowed" });

  // ✅ 5-minute rule
  const fiveMinutes = 5 * 60 * 1000;
  const timeDiff = Date.now() - new Date(comment.createdAt).getTime();

  if (timeDiff > fiveMinutes)
    return res.status(403).json({
      message: "Edit time expired (5 minutes)"
    });

  const updated = await prisma.bugComment.update({
    where: { id: commentId },
    data: { content }
  });

  res.json(updated);
});


app.delete("/api/comments/:id", async (req, res) => {

  const commentId = req.params.id;

  const token = req.headers.authorization?.split(" ")[1];
  const payload = token
    ? JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    : null;

  const userId = payload?.id;

  const comment = await prisma.bugComment.findUnique({
    where: { id: commentId }
  });

  if (!comment)
    return res.status(404).json({ message: "Comment not found" });

  if (comment.authorId !== userId)
    return res.status(403).json({ message: "Not allowed" });

  const fiveMinutes = 5 * 60 * 1000;
  const timeDiff = Date.now() - new Date(comment.createdAt).getTime();

  if (timeDiff > fiveMinutes)
    return res.status(403).json({
      message: "Delete time expired"
    });

  await prisma.bugComment.delete({
    where: { id: commentId }
  });

  res.json({ message: "Deleted" });
});


app.get("/api/bugs/export/assigned/:developerId", async (req, res) => {

  const developerId = req.params.developerId;

  const bugs = await prisma.bug.findMany({
    where: { assignedToId: developerId },
    orderBy: { createdAt: "desc" }
  });

  const csvHeader =
    "Bug ID,Title,Severity,Priority,Status,Reported By,Created At\n";

  const rows = bugs.map(b =>
    `${b.bugId || b.id},"${b.title}",${b.severity},${b.priority},${b.status},${b.reportedById || ""},${b.createdAt}`
  ).join("\n");

  const csv = csvHeader + rows;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=assigned-bugs.csv"
  );

  res.send(csv);
});


const ExcelJS = require("exceljs");

app.get("/api/bugs/export/excel/:developerId", async (req, res) => {

  const developerId = req.params.developerId;

  const bugs = await prisma.bug.findMany({
    where: { assignedToId: developerId },
    include: {
      assignedTo: true,
      reportedBy: true
    },
    orderBy: { createdAt: "desc" }
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Assigned Bugs");

  sheet.columns = [
    { header: "Bug ID", key: "bugId", width: 18 },
    { header: "Title", key: "title", width: 35 },
    { header: "Severity", key: "severity", width: 12 },
    { header: "Priority", key: "priority", width: 12 },
    { header: "Status", key: "status", width: 14 },
    { header: "Assigned To", key: "assigned", width: 20 },
    { header: "Reported By", key: "reported", width: 20 },
    { header: "Fix Notes", key: "fixNotes", width: 35 },
    { header: "Commit Link", key: "commitLink", width: 35 },
    { header: "Resolution", key: "resolutionNote", width: 30 },
    { header: "Attachment", key: "attachment", width: 35 },
    { header: "Created At", key: "createdAt", width: 20 }
  ];

  bugs.forEach(b => {
    sheet.addRow({
      bugId: b.bugId || b.id,
      title: b.title,
      severity: b.severity,
      priority: b.priority,
      status: b.status,
      assigned: b.assignedTo?.name || "",
      reported: b.reportedBy?.name || "",
      fixNotes: b.fixNotes || "",
      commitLink: b.commitLink || "",
      resolutionNote: b.resolutionNote || "",
      attachment: b.evidencePath || "",
      createdAt: b.createdAt
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=assigned-bugs.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});

// Server start



app.get("/api/bugs/export/pdf/:developerId", async (req, res) => {

  const developerId = req.params.developerId;

  const bugs = await prisma.bug.findMany({
    where: { assignedToId: developerId },
    include: {
      assignedTo: true,
      reportedBy: true
    },
    orderBy: { createdAt: "desc" }
  });

  const doc = new PDFDocument({ margin: 30 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=assigned-bugs.pdf"
  );

  doc.pipe(res);

  doc.fontSize(18).text("Assigned Bug Report", {
    align: "center"
  });

  doc.moveDown();

  bugs.forEach(b => {

    doc.fontSize(12).text(`Bug ID: ${b.bugId || b.id}`);
    doc.text(`Title: ${b.title}`);
    doc.text(`Severity: ${b.severity}`);
    doc.text(`Priority: ${b.priority}`);
    doc.text(`Status: ${b.status}`);
    doc.text(`Assigned To: ${b.assignedTo?.name || ""}`);
    doc.text(`Reported By: ${b.reportedBy?.name || ""}`);

    if (b.fixNotes)
      doc.text(`Fix Notes: ${b.fixNotes}`);

    if (b.commitLink)
      doc.text(`Commit: ${b.commitLink}`);

    if (b.resolutionNote)
      doc.text(`Resolution: ${b.resolutionNote}`);

    if (b.evidencePath)
      doc.text(`Attachment: ${b.evidencePath}`);

    doc.moveDown();
  });

  doc.end();
});


app.get("/api/admin/users", async (req, res) => {

  const users = await prisma.user.findMany();

  res.json(users);
});

app.get("/api/users/me", async (req, res) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Unauthorized" });

  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  res.json(user);

});

app.put("/api/admin/users/:id/deactivate", async (req, res) => {

  const id = req.params.id;

  await prisma.user.update({
    where: { id },
    data: { active: false }
  });

  const authHeader = req.headers.authorization;

  if (authHeader) {

    const token = authHeader.split(" ")[1];

    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    await logAction(
  payload.id,
  "Deactivate User",
  `User ID: ${req.params.id}`,
  "User"
);
  }

  res.json({ message: "User deactivated" });
});

app.put("/api/admin/users/:id/activate", async (req, res) => {

  const id = req.params.id;

  try {

    await prisma.user.update({
      where: { id },
      data: { active: true }
    });

    // ⭐ audit log
    const authHeader = req.headers.authorization;

    if (authHeader) {

      const token = authHeader.split(" ")[1];

      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );

      await logAction(
        payload.id,
        "Activate User",
        `User ID: ${id}`,
        "User"
      );

    }

    res.json({ message: "User activated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Activation failed" });
  }

});



app.post("/api/admin/users", async (req, res) => {

  const { name, email, password, role } = req.body;

  const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password, // hash in real app
      role,
      active: true
    }
  });
 const userId = getUserIdFromToken(req); // Implement this helper to extract user ID from token
  await logAction(userId, "Create User", "User", user.id);

  res.json(user);
});

app.put("/api/admin/users/:id", async (req, res) => {

  const { name, email, role } = req.body;
  const id = req.params.id;

  const updated = await prisma.user.update({
    where: { id },
    data: { name, email, role }
  });


const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    await logAction(
      payload.id,
      "Update User",
      `User ID: ${req.params.id}`,
      "User",
      req.params.id
    );
  }


  res.json(updated);
});

app.put("/api/admin/users/:id/activate", async (req, res) => {

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { active: true }
  });

  const userId = getUserIdFromToken(req);

  if (userId) {
    await logAction(
      userId,
      "Activate User",
      "User",
      user.id,
      `Activated user ${user.email}`
    );
  }

  res.json({ message: "User activated" });
});


app.post("/api/admin/roles", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create roles" });
    }

    const { name, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const role = await prisma.role.create({
      data: {
        name: name.trim().toLowerCase(),
        permissions: {
          create: permissions?.map(p => ({ name: p })) || []
        }
      },
      include: { permissions: true }
    });

    await logAction(
      req.user.id,
      "Create Role",
      "Role",
      role.id,
      `Created role ${name}`
    );

    res.json(role);

  } catch (err) {

    if (err.code === "P2002") {
      return res.status(400).json({ message: "Role already exists" });
    }

    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



app.put("/api/admin/roles/:id", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update roles" });
    }

    const { permissions } = req.body;
    const id = req.params.id;

    await prisma.permission.deleteMany({
      where: { roleId: id }
    });

    const role = await prisma.role.update({
      where: { id },
      data: {
        permissions: {
          create: permissions?.map(p => ({ name: p })) || []
        }
      },
      include: { permissions: true }
    });

    await logAction(
  req.user.id,
  "Update Role Permissions",
  "Role",
  role.id,
  `Permissions updated`
);

    res.json(role);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});





app.get("/api/permissions", async (req, res) => {

  const permissions = await prisma.permission.findMany({
    include: {
      role: true
    }
  });

  res.json(permissions);
});

app.get("/api/roles/:id/permissions", async (req, res) => {

  const roleId = req.params.id;

  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: {
      permissions: true
    }
  });

  res.json(role);
});



app.post("/api/admin/roles/:id/permissions", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can assign permissions" });
    }

    const roleId = req.params.id;
    const { permissions } = req.body;

    const created = await Promise.all(
      permissions.map(p =>
        prisma.permission.create({
          data: {
            name: p,
            roleId
          }
        })
      )
    );

    // ✅ AUDIT LOG
    await logAction(
      req.user.id,
      "Assign Permission",
      "Role",
      roleId,
      `Assigned permissions: ${permissions.join(", ")}`
    );

    res.json(created);

  } catch (err) {
    console.error("ASSIGN PERMISSION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/admin/permissions/:id", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can remove permissions" });
    }

    const id = req.params.id;

    // 🔍 Get permission before deleting (for audit log)
    const permission = await prisma.permission.findUnique({
      where: { id }
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    await prisma.permission.delete({
      where: { id }
    });

    // ✅ AUDIT LOG
    await logAction(
      req.user.id,
      "Remove Permission",
      "Role",
      permission.roleId,
      `Removed permission: ${permission.name}`
    );

    res.json({ message: "Permission deleted successfully" });

  } catch (err) {
    console.error("REMOVE PERMISSION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/admin/roles/:id", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete roles" });
    }

    const id = req.params.id;

    const usersUsingRole = await prisma.user.findMany({
  where: { roleId: id }
});

if (usersUsingRole.length > 0) {
  return res.status(400).json({
    message: "Cannot delete role assigned to users"
  });
}

    // 🔥 FIRST delete related permissions
    await prisma.permission.deleteMany({
      where: { roleId: id }
    });

    // 🔥 THEN delete role
    await prisma.role.delete({
      where: { id }
    });

    await logAction(
      req.user.id,
      "Delete Role",
      "Role",
      id,
      "Deleted role"
    );

    res.json({ message: "Role deleted successfully" });

  } catch (err) {
    console.error("DELETE ROLE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================================
   GET ALL ROLES WITH PERMISSIONS
========================================= */

app.get("/api/admin/roles", authenticate, async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: { permissions: true }
    });

    res.json(roles);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/admin/permissions", async (req, res) => {

  try {

    const permissions = await prisma.permission.findMany();

    res.json(permissions);

  } catch (err) {
    res.status(500).json({ message: "Failed to load permissions" });
  }

});

app.get("/api/admin/permissions/master", (req, res) => {

  const permissions = [

    // TESTER
    "create_test_case",
    "edit_test_case",
    "delete_test_case",
    "execute_test",
    "upload_attachment",
    "create_suite",
    "generate_reports",
    "comment_issue",
    "view_all_test_cases",
    "create_bug",
    "assign_bug",

    // DEVELOPER
    "view_reports",
    "view_assigned_issues",
    "update_issue_status",
    "add_fix_notes",
    "request_retest",
    "view_test_case_details",
    "link_commits",
    "view_dashboard",
    "export_reports",

    // ADMIN
    "manage_users",
    "manage_projects",
    "manage_roles",
    "view_audit_logs",
    "system_config",
    "backup_management"
  ];

  res.json(permissions);
});

app.post("/api/admin/seed-roles", async (req, res) => {

  // Clear existing
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();

  const tester = await prisma.role.create({
    data: {
      name: "Tester",
      permissions: {
        create: [
          { name: "create_test_case" },
          { name: "edit_test_case" },
          { name: "delete_test_case" },
          { name: "execute_test" },
          { name: "upload_attachment" },
          { name: "create_suite" },
          { name: "generate_reports" },
          { name: "comment_issue" },
          { name: "view_all_test_cases" },
          { name: "create_bug" },
          { name: "assign_bug" }
        ]
      }
    }
  });

  const developer = await prisma.role.create({
    data: {
      name: "Developer",
      permissions: {
        create: [
          { name: "view_reports" },
          { name: "view_assigned_issues" },
          { name: "update_issue_status" },
          { name: "add_fix_notes" },
          { name: "request_retest" },
          { name: "view_test_case_details" },
          { name: "link_commits" },
          { name: "view_dashboard" },
          { name: "export_reports" }
        ]
      }
    }
  });

  const admin = await prisma.role.create({
    data: {
      name: "Admin",
      permissions: {
        create: [
          { name: "manage_users" },
          { name: "manage_projects" },
          { name: "manage_roles" },
          { name: "view_audit_logs" },
          { name: "system_config" },
          { name: "backup_management" }
        ]
      }
    }
  });

  res.json({ message: "Roles seeded successfully" });
});


app.get("/api/reports/execution/:id/export/csv", async (req, res) => {

  const executions = await prisma.testExecution.findMany({
    where: { testRunId: req.params.id }
  });

  const { Parser } = require("json2csv");
  const parser = new Parser();

  const csv = parser.parse(executions);

  res.header("Content-Type", "text/csv");
  res.attachment("report.csv");
  res.send(csv);
});



app.get("/api/reports/execution/:id/export/excel", async (req, res) => {

  const executions = await prisma.testExecution.findMany({
    where: { testRunId: req.params.id }
  });

  const worksheet = XLSX.utils.json_to_sheet(executions);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  });

  res.attachment("report.xlsx");
  res.send(buffer);
});



app.get("/api/reports/execution/:id/export/pdf", async (req, res) => {

  const executions = await prisma.testExecution.findMany({
    where: { testRunId: req.params.id }
  });

  const doc = new PDFDocument();

  res.attachment("report.pdf");
  doc.pipe(res);

  doc.text("Execution Report");

  executions.forEach(e => {
    doc.text(`${e.testCaseId} — ${e.status}`);
  });

  doc.end();
});






// ==========================================================
// FR-RPT-001 : TEST EXECUTION REPORT
// ==========================================================



// ==========================================================
// EXECUTION REPORTS FOR ALL TEST RUNS
// ==========================================================

app.get("/api/reports/execution-by-run", async (req, res) => {
  try {

    const { projectId } = req.query;

if (!projectId) {
  return res.status(400).json({ message: "ProjectId required" });
}

    const runs = await prisma.testRun.findMany({
       where: { projectId },
      include: {
        TestExecution: {
          include: {
            executedBy: true
          }
        }
      }
    });

    if (!runs.length) {
      return res.status(404).json({
        message: "No test runs found"
      });
    }

    const reports = [];

    for (const run of runs) {

      const executions = run.TestExecution;

      if (!executions.length) continue;

      // 🔹 Fetch related test cases ONCE per run
      const testCases = await prisma.testCase.findMany({
        where: {
          id: { in: executions.map(e => e.testCaseId) }
        }
      });

      const testCaseMap = {};
      testCases.forEach(tc => {
        testCaseMap[tc.id] = tc;
      });

      let passed = 0;
      let failed = 0;
      let blocked = 0;
      let skipped = 0;

      const byTester = {};
      const byModule = {};
      const timeline = {};
      const failedDetails = [];
      const failedModules = {};

      for (const exec of executions) {

        const status = exec.status;
        const tester = exec.executedBy?.name || "Unknown";
        const module =
          testCaseMap[exec.testCaseId]?.module || "Unknown";

        // ✔ Status breakdown
        if (status === "Passed") passed++;
        else if (status === "Failed") failed++;
        else if (status === "Blocked") blocked++;
        else if (status === "Skipped") skipped++;

        // ✔ Execution by tester
        byTester[tester] = (byTester[tester] || 0) + 1;

        // ✔ Execution by module
        byModule[module] = (byModule[module] || 0) + 1;

        // ✔ Execution timeline
        const date = exec.startedAt.toISOString().split("T")[0];
        timeline[date] = (timeline[date] || 0) + 1;

        // ✔ Failed test details + failed modules
        if (status === "Failed") {

          failedDetails.push({
            testCaseId: exec.testCaseId,
            title: testCaseMap[exec.testCaseId]?.title,
            module,
            tester,
            executedAt: exec.startedAt
          });

          failedModules[module] =
            (failedModules[module] || 0) + 1;
        }
      }

      const total = executions.length;

      const passRate =
        total ? ((passed / total) * 100).toFixed(2) : 0;

      // ✔ Top failed modules
      const topFailedModules = Object.entries(failedModules)
        .sort((a, b) => b[1] - a[1])
        .map(([module, count]) => ({
          module,
          failures: count
        }));

      reports.push({
        testRunId: run.id,
        testRunName: run.name,
        period: {
          start: run.startDate,
          end: run.endDate
        },

        // ================= FR-RPT-001 =================

        totalExecuted: total,

        statusBreakdown: {
          passed,
          failed,
          blocked,
          skipped,
          passRate
        },

        executionByTester: byTester,
        executionByModule: byModule,
        executionTimeline: timeline,

        failedTestCases: failedDetails,
        topFailedModules
      });
    }

    res.json(reports);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error generating reports"
    });
  }
});








// ==========================================================
// FR-RPT-002 : BUG REPORT
// ==========================================================

app.get("/api/reports/bugs", async (req, res) => {
  try {

    const { projectId } = req.query;

if (!projectId) {
  return res.status(400).json({ message: "ProjectId required" });
}

    const bugs = await prisma.bug.findMany({
       where: { projectId },
      include: {
        assignedTo: true
      }
    });

    if (!bugs.length) {
      return res.status(404).json({
        message: "No bugs found"
      });
    }

    const byStatus = {};
    const bySeverity = {};
    const byPriority = {};
    const byDeveloper = {};
    const trend = {};
    const aging = [];
    const resolutionTimes = [];

    const now = new Date();

    for (const bug of bugs) {

      // ✔ Status count
      byStatus[bug.status] =
        (byStatus[bug.status] || 0) + 1;

      // ✔ Severity
      if (bug.severity) {
        bySeverity[bug.severity] =
          (bySeverity[bug.severity] || 0) + 1;
      }

      // ✔ Priority
      if (bug.priority) {
        byPriority[bug.priority] =
          (byPriority[bug.priority] || 0) + 1;
      }

      // ✔ By developer
      const dev =
        bug.assignedTo?.name || "Unassigned";

      byDeveloper[dev] =
        (byDeveloper[dev] || 0) + 1;

      // ✔ Trend over time (created date)
      const date = bug.createdAt
        .toISOString()
        .split("T")[0];

      trend[date] = (trend[date] || 0) + 1;

      // ✔ Aging (days open)
      if (bug.status !== "Closed" && bug.status !== "Resolved") {
        const daysOpen =
          Math.floor((now - bug.createdAt) / (1000 * 60 * 60 * 24));

        aging.push({
          bugId: bug.id,
          title: bug.title,
          daysOpen
        });
      }

      // ✔ Resolution time
      if (bug.fixedAt) {
        const days =
          Math.floor((bug.fixedAt - bug.createdAt) /
            (1000 * 60 * 60 * 24));

        resolutionTimes.push(days);
      }
    }

    const avgResolution =
      resolutionTimes.length
        ? (
            resolutionTimes.reduce((a, b) => a + b, 0) /
            resolutionTimes.length
          ).toFixed(2)
        : 0;

    res.json({
      totalBugs: bugs.length,

      bugsByStatus: byStatus,
      bugsBySeverity: bySeverity,
      bugsByPriority: byPriority,
      bugsByDeveloper: byDeveloper,

      bugTrend: trend,
      bugAging: aging,

      resolutionMetrics: {
        averageResolutionDays: avgResolution,
        resolvedCount: resolutionTimes.length
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error generating bug report"
    });
  }
});


// ==========================================================
// BUG REPORT EXPORT — CSV
// ==========================================================

app.get("/api/reports/bugs/export/csv", async (req, res) => {

  const bugs = await prisma.bug.findMany({
    include: { assignedTo: true }
  });

  const { Parser } = require("json2csv");

  const rows = bugs.map(b => ({
    id: b.id,
    title: b.title,
    status: b.status,
    severity: b.severity,
    priority: b.priority,
    developer: b.assignedTo?.name || "Unassigned",
    createdAt: b.createdAt,
    fixedAt: b.fixedAt
  }));

  const parser = new Parser();
  const csv = parser.parse(rows);

  res.header("Content-Type", "text/csv");
  res.attachment("bug-report.csv");
  res.send(csv);
});

// ==========================================================
// BUG REPORT EXPORT — EXCEL
// ==========================================================

const XLSX = require("xlsx");

app.get("/api/reports/bugs/export/excel", async (req, res) => {

  const bugs = await prisma.bug.findMany({
    include: { assignedTo: true }
  });

  const rows = bugs.map(b => ({
    ID: b.id,
    Title: b.title,
    Status: b.status,
    Severity: b.severity,
    Priority: b.priority,
    Developer: b.assignedTo?.name || "Unassigned",
    CreatedAt: b.createdAt,
    FixedAt: b.fixedAt
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Bug Report");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  });

  res.attachment("bug-report.xlsx");
  res.send(buffer);
});

// ==========================================================
// BUG REPORT EXPORT — PDF
// ==========================================================

const PDFDocument = require("pdfkit");

app.get("/api/reports/bugs/export/pdf", async (req, res) => {

  const bugs = await prisma.bug.findMany({
    include: { assignedTo: true }
  });

  const doc = new PDFDocument();

  res.attachment("bug-report.pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Bug Report", { align: "center" });
  doc.moveDown();

  bugs.forEach(b => {
    doc
      .fontSize(12)
      .text(`ID: ${b.id}`)
      .text(`Title: ${b.title}`)
      .text(`Status: ${b.status}`)
      .text(`Severity: ${b.severity}`)
      .text(`Priority: ${b.priority}`)
      .text(`Developer: ${b.assignedTo?.name || "Unassigned"}`)
      .text(`Created: ${b.createdAt}`)
      .moveDown();
  });

  doc.end();
});




// ==========================================================
// FR-RPT-003 : DEVELOPER PERFORMANCE REPORT
// ==========================================================

app.get("/api/reports/developer-performance", async (req, res) => {
  try {
    const { projectId } = req.query;

if (!projectId) {
  return res.status(400).json({ message: "ProjectId required" });
}

    const bugs = await prisma.bug.findMany({
      where: { projectId },
      include: { assignedTo: true }
    });

    if (!bugs.length) {
      return res.status(404).json({
        message: "No bugs found"
      });
    }

    const devStats = {};

    for (const bug of bugs) {

      const devName =
        bug.assignedTo?.name || "Unassigned";

      if (!devStats[devName]) {
        devStats[devName] = {
          assigned: 0,
          resolved: 0,
          reopened: 0,
          resolutionTimes: []
        };
      }

      const stats = devStats[devName];

      // ✔ Assigned
      stats.assigned++;

      // ✔ Resolved / Closed
      if (bug.status === "Resolved" || bug.status === "Closed") {
        stats.resolved++;

        if (bug.fixedAt) {
          const days =
            Math.floor((bug.fixedAt - bug.createdAt) /
              (1000 * 60 * 60 * 24));

          stats.resolutionTimes.push(days);
        }
      }

      // ✔ Reopened (if status = Reopened)
      if (bug.status === "Reopened") {
        stats.reopened++;
      }
    }

    // ================= FINAL METRICS =================

    const report = Object.entries(devStats).map(
      ([developer, s]) => {

        const avgResolution =
          s.resolutionTimes.length
            ? (
                s.resolutionTimes.reduce((a, b) => a + b, 0) /
                s.resolutionTimes.length
              ).toFixed(2)
            : 0;

        const reopenRate =
          s.resolved
            ? ((s.reopened / s.resolved) * 100).toFixed(2)
            : 0;

        const fixQuality =
          s.assigned
            ? ((s.resolved / s.assigned) * 100).toFixed(2)
            : 0;

        return {
          developer,
          assigned: s.assigned,
          resolved: s.resolved,
          avgResolutionDays: avgResolution,
          reopenRate,
          fixQuality
        };
      }
    );

    res.json(report);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error generating developer report"
    });
  }
});


// ==========================================================
// DEV PERFORMANCE EXPORT — CSV
// ==========================================================

app.get("/api/reports/developer-performance/export/csv", async (req, res) => {

  const data = await getDeveloperReportData(); // reuse logic

  const { Parser } = require("json2csv");
  const parser = new Parser();

  const csv = parser.parse(data);

  res.header("Content-Type", "text/csv");
  res.attachment("developer-performance.csv");
  res.send(csv);
});



app.get("/api/reports/developer-performance/export/excel", async (req, res) => {

  const data = await getDeveloperReportData();

  const sheet = XLSX.utils.json_to_sheet(data);
  const book = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(book, sheet, "Developer Report");

  const buffer = XLSX.write(book, {
    type: "buffer",
    bookType: "xlsx"
  });

  res.attachment("developer-performance.xlsx");
  res.send(buffer);
});


app.get("/api/reports/developer-performance/export/pdf", async (req, res) => {

  const data = await getDeveloperReportData();

  const doc = new PDFDocument();

  res.attachment("developer-performance.pdf");
  doc.pipe(res);

  doc.fontSize(18).text("Developer Performance Report", {
    align: "center"
  });

  doc.moveDown();

  data.forEach(d => {
    doc
      .fontSize(12)
      .text(`${d.developer}`)
      .text(`Assigned: ${d.assigned}`)
      .text(`Resolved: ${d.resolved}`)
      .text(`Avg Resolution: ${d.avgResolutionDays} days`)
      .text(`Reopen Rate: ${d.reopenRate}%`)
      .text(`Fix Quality: ${d.fixQuality}%`)
      .moveDown();
  });

  doc.end();
});


// ==========================================================
// FR-RPT-004 : TESTER PERFORMANCE REPORT
// ==========================================================

app.get("/api/reports/tester-performance", async (req, res) => {
  try {
    const { projectId } = req.query;

if (!projectId) {
  return res.status(400).json({ message: "ProjectId required" });
}

    const executions = await prisma.testExecution.findMany({
  where: {
    testRun: {
      projectId: projectId
    }
  },
  include: {
    executedBy: true
  }
});
    const bugs = await prisma.bug.findMany({
       where: { projectId },
      include: { reportedBy: true }
    });

    const assignments = await prisma.testRunAssignment.findMany({
  where: {
    testRun: {
      projectId: projectId
    }
  }
});

    const testerStats = {};

    // ================= EXECUTIONS =================

    for (const exec of executions) {

      const tester =
        exec.executedBy?.name || "Unknown";

      if (!testerStats[tester]) {
        testerStats[tester] = {
          executed: 0,
          passed: 0,
          bugsReported: 0,
          assigned: 0
        };
      }

      const s = testerStats[tester];

      s.executed++;

      if (exec.status === "Passed") s.passed++;
    }

    // ================= BUGS REPORTED =================

    for (const bug of bugs) {

      const tester =
        bug.reportedBy?.name || "Unknown";

      if (!testerStats[tester]) continue;

      testerStats[tester].bugsReported++;
    }

    // ================= ASSIGNMENTS =================

    for (const a of assignments) {

      const testerId = a.testerId;

      const testerEntry = executions.find(
        e => e.executedById === testerId
      );

      const tester =
        testerEntry?.executedBy?.name || "Unknown";

      if (!testerStats[tester]) continue;

      testerStats[tester].assigned++;
    }

    // ================= FINAL METRICS =================

    const report = Object.entries(testerStats).map(
      ([tester, s]) => {

        const bugRate =
          s.executed
            ? ((s.bugsReported / s.executed) * 100).toFixed(2)
            : 0;

        const efficiency =
          s.executed
            ? ((s.passed / s.executed) * 100).toFixed(2)
            : 0;

        const coverage =
  s.assigned > 0
    ? Math.min(
        ((s.executed / s.assigned) * 100),
        100
      ).toFixed(2)
    : 0;

        return {
          tester,
          executed: s.executed,
          bugsReported: s.bugsReported,
          bugDetectionRate: bugRate,
          efficiency,
          coverage
        };
      }
    );

    res.json(report);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error generating tester report"
    });
  }
});


// ==========================================================
// GET DASHBOARD WIDGETS FOR USER
// ==========================================================

app.get("/api/widgets/:userId", async (req, res) => {

  const widgets = await prisma.dashboardWidget.findMany({
    where: { userId: req.params.userId },
    orderBy: { position: "asc" }
  });

  res.json(widgets);
});

app.post("/api/widgets/reorder", async (req, res) => {

  const { widgets } = req.body;

  for (const w of widgets) {
    await prisma.dashboardWidget.update({
      where: { id: w.id },
      data: { position: w.position }
    });
  }

  res.json({ message: "Layout saved" });
});

app.post("/api/widgets", async (req, res) => {

  const { userId, type, title } = req.body;

  const count = await prisma.dashboardWidget.count({
    where: { userId }
  });

  const widget = await prisma.dashboardWidget.create({
    data: {
      userId,
      type,
      title,
      position: count
    }
  });

  res.json(widget);
});

app.post("/api/widgets/default", async (req, res) => {

  const { userId, role } = req.body;

  const existing = await prisma.dashboardWidget.count({
    where: { userId }
  });

  if (existing > 0) {
    return res.json({ message: "Already initialized" });
  }

  let widgets = [];

  // ================= TESTER =================

  if (role === "tester") {
  widgets = [
    { type: "list", title: "My Pending Tests" },
    { type: "list", title: "Recent Failures" },
    { type: "list", title: "Unread Notifications" },
    { type: "chart", title: "Execution Trend" },
    { type: "counter", title: "Bug Detection Rate" },
    { type: "table", title: "Recent Executions" }
  ];
}

if (role === "developer") {
  widgets = [
    { type: "list", title: "Assigned Bugs" },
    { type: "list", title: "Unread Notifications" },
    { type: "chart", title: "Bug Status Chart" },
    { type: "counter", title: "Fix Rate" },
    { type: "counter", title: "Reopen Rate" },
    { type: "table", title: "Recent Executions" }
  ];
}

if (role === "admin") {
  widgets = [
    { type: "counter", title: "Overall Execution" },
    { type: "counter", title: "Unread Notifications" },
    { type: "chart", title: "Execution Trend" },
    { type: "chart", title: "Bug Status Chart" },
    { type: "list", title: "Active Test Runs" },
    { type: "table", title: "Recent Executions" }
  ];
}

  const created = await prisma.dashboardWidget.createMany({
    data: widgets.map((w, i) => ({
      userId,
      type: w.type,
      title: w.title,
      position: i
    }))
  });

  res.json(created);
});

app.get("/api/widgets/data/counters/:userId", async (req, res) => {

  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) return res.json({});

  // ================= TESTER =================

  if (user.role === "tester") {

    const bugs = await prisma.bug.count({
      where: { reportedById: userId }
    });

    const executions = await prisma.testExecution.count({
      where: { executedById: userId }
    });

    return res.json({
      "Bug Detection Rate": bugs,
      "Overall Execution": executions
    });
  }

  // ================= DEVELOPER =================

  if (user.role === "developer") {

  const assigned = await prisma.bug.count({
    where: { assignedToId: userId }
  });

  const resolved = await prisma.bug.count({
    where: {
      assignedToId: userId,
      fixedAt: { not: null }   // ⭐ reliable indicator
    }
  });

  const open = assigned - resolved;

  return res.json({
    "Assigned Bugs": assigned,
    "Fix Rate": resolved,
    "Reopen Rate": open
  });
}
  

  // ================= ADMIN =================

  if (user.role === "admin") {

    const executions = await prisma.testExecution.count();

    const bugs = await prisma.bug.count();

    const runs = await prisma.testRun.count({
      where: { status: "Active" }
    });

    return res.json({
      "Overall Execution": executions,
      "Bug Status": bugs,
      "Active Test Runs": runs
    });
  }

  const unread = await prisma.notification.count({
  where: {
    userId,
    isRead: false
  }
});

return res.json({
  "Bug Detection Rate": bugs,
  "Overall Execution": executions,
  "Unread Notifications": unread
});

  res.json({});
});

app.get("/api/widgets/data/lists/:userId", async (req, res) => {

  const { userId } = req.params;

  // ⭐ YOU MISSED THIS
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) return res.json({});

  // ================= TESTER =================
  if (user.role === "tester") {

    const pendingRuns = await prisma.testRunAssignment.findMany({
      where: { testerId: userId },
      include: { testRun: true },
      take: 5
    });

    const failures = await prisma.testExecution.findMany({
      where: {
        executedById: userId,
        status: "Failed"
      },
      orderBy: { startedAt: "desc" },
      take: 5
    });

    const testCases = await prisma.testCase.findMany({
      where: { id: { in: failures.map(f => f.testCaseId) } }
    });

    const map = {};
    testCases.forEach(tc => (map[tc.id] = tc));

    return res.json({
      "My Pending Tests": pendingRuns.map(r => r.testRun.name),
      "Recent Failures": failures.map(f =>
        map[f.testCaseId]?.title || "Unknown"
      )
    });
  }

  // ================= DEVELOPER =================
  if (user.role === "developer") {

    const bugs = await prisma.bug.findMany({
      where: { assignedToId: userId },
      take: 5
    });

    return res.json({
      "Assigned Bugs": bugs.map(b => b.title)
    });
  }

  // ================= ADMIN =================
  if (user.role === "admin") {

    const runs = await prisma.testRun.findMany({
      where: { status: "Active" },
      take: 5
    });

    return res.json({
      "Active Test Runs": runs.map(r => r.name)
    });
  }

  const notifications = await prisma.notification.findMany({
  where: { userId, isRead: false },
  orderBy: { createdAt: "desc" },
  take: 5
});

lists["Unread Notifications"] =
  notifications.map(n => n.title);

  res.json({});
});

app.get("/api/widgets/data/trend/:userId", async (req, res) => {

  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) return res.json([]);

  let executions;

  // Tester → personal executions
  if (user.role === "tester") {
    executions = await prisma.testExecution.findMany({
      where: { executedById: userId }
    });
  }

  // Developer + Admin → team executions
  else {
    executions = await prisma.testExecution.findMany();
  }

  const timeline = {};

  executions.forEach(e => {
    const date = e.startedAt.toISOString().split("T")[0];
    timeline[date] = (timeline[date] || 0) + 1;
  });

  const data = Object.entries(timeline).map(([date, count]) => ({
    date,
    count
  }));

  res.json(data);
});
app.get("/api/widgets/data/table/:userId", async (req, res) => {

  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) return res.json([]);

  let recentExec;

  if (user.role === "tester") {
    recentExec = await prisma.testExecution.findMany({
      where: { executedById: userId },
      orderBy: { startedAt: "desc" },
      take: 5
    });
  } else {
    // Developer/Admin → show team executions
    recentExec = await prisma.testExecution.findMany({
      orderBy: { startedAt: "desc" },
      take: 5
    });
  }

  const testCases = await prisma.testCase.findMany({
    where: { id: { in: recentExec.map(e => e.testCaseId) } }
  });

  const map = {};
  testCases.forEach(tc => (map[tc.id] = tc));

  res.json(
    recentExec.map(e => ({
      name: map[e.testCaseId]?.title || "Unknown",
      status: e.status
    }))
  );
});


app.delete("/api/widgets/:id", async (req, res) => {

  await prisma.dashboardWidget.delete({
    where: { id: req.params.id }
  });

  res.json({ message: "Widget removed" });

});

app.get("/api/widgets/data/notifications/:userId", async (req, res) => {

  const { userId } = req.params;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  res.json(
    notifications.map(n => ({
      title: n.title,
      message: n.message,
      read: n.isRead
    }))
  );
});

app.put("/api/widgets/resize/:id", async (req, res) => {
  const { width } = req.body;

  const updated = await prisma.dashboardWidget.update({
    where: { id: req.params.id },
    data: { width }
  });

  res.json(updated);
});

app.get("/api/admin/projects", async (req, res) => {

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      }
    }
  });

  res.json(projects);
});
app.put("/api/admin/projects/:id", async (req, res) => {

  const { name, description } = req.body;

  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { name, description }
  });

  res.json(project);
});

app.post("/api/admin/projects", async (req, res) => {

  const { name, description } = req.body;

  const project = await prisma.project.create({
    data: {
      name,
      description
    }
  });

  // ✅ SAFE TOKEN EXTRACTION
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {

    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    await logAction(
      payload.id,
      "Create Project",
      `Project: ${name}`,
      "Project"
    );
  }

  res.json(project);
});


app.delete("/api/admin/projects/:id", async (req, res) => {

  const id = req.params.id;

  await prisma.project.delete({
    where: { id }
  });

  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    await logAction(
  payload.id,
  "Delete Project",
  `Project ID: ${id}`,
  "Project"
);
  }

  res.json({ message: "Project deleted" });
});

app.put("/api/admin/projects/:id/archive", async (req, res) => {

  const id = req.params.id;

  const project = await prisma.project.findUnique({
    where: { id }
  });

  const updated = await prisma.project.update({
    where: { id },
    data: { active: !project.active }
  });
 const userId = getUserIdFromToken(req);
 await logAction(userId, "Archive Project", "Project", id);

  res.json(updated);
});


app.get("/api/projects", authenticate, async (req, res) => {

  const role = req.user.role;

  let projects;

  if (role === "admin") {

    projects = await prisma.project.findMany({
      where: { active: true }
    });

  } else {

    projects = await prisma.project.findMany({
      where: {
        active: true,
        members: {
          some: {
            userId: req.user.id
          }
        }
      }
    });

  }

  res.json(projects);
});

app.post("/api/projects/:projectId/members", authenticate, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin allowed" });
  }

  const { projectId } = req.params;
  const { userId } = req.body;

  try {

    const member = await prisma.projectMember.create({
      data: {
        userId,
        projectId
      }
    });

    res.json(member);

  } catch (err) {
    res.status(400).json({ message: "Already assigned" });
  }
});


app.put("/api/admin/audit/archive-old", async (req, res) => {

  const { days = 90 } = req.body;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  await prisma.auditLog.updateMany({
    where: { createdAt: { lt: cutoff } },
    data: { isArchived: true }
  });

  res.json({ message: "Old logs archived" });

});

const { Parser } = require("json2csv");

app.get("/api/admin/audit/export", async (req, res) => {

  const logs = await prisma.auditLog.findMany({
    include: { user: true }
  });

  const fields = [
    "user.name",
    "user.email",
    "action",
    "entity",
    "entityId",
    "details",
    "createdAt"
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(logs);

  res.header("Content-Type", "text/csv");
  res.attachment("audit_logs.csv");
  res.send(csv);

});

app.delete("/api/admin/audit", async (req, res) => {

  await prisma.auditLog.deleteMany();

  res.json({ message: "All logs deleted" });

});






app.get("/api/admin/audit", async (req, res) => {

  const { search, user, action, from, to, archived } = req.query;

  const where = {};

  // ✅ Only filter if archived param exists
  if (archived !== undefined) {
    where.isArchived = archived === "true";
  }

  if (search) {
    where.OR = [
      { action: { contains: search, mode: "insensitive" } },
      { details: { contains: search, mode: "insensitive" } }
    ];
  }

  if (user) where.userId = user;
  if (action) where.action = action;

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const logs = await prisma.auditLog.findMany({
    where,
    include: {
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(logs);
});

app.put("/api/admin/audit/archive-selected", async (req, res) => {

  const { ids } = req.body;

  await prisma.auditLog.updateMany({
    where: {
      id: { in: ids }
    },
    data: {
      isArchived: true   // ⭐ THIS IS IMPORTANT
    }
  });

  res.json({ message: "Archived successfully" });
});




app.get("/api/admin/system-config", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed" });
    }

    let config = await prisma.systemConfig.findFirst();

    if (!config) {
      config = await prisma.systemConfig.create({ data: {} });
    }

    res.json(config);

  } catch (err) {
    res.status(500).json({ message: "Failed to load config" });
  }
});

app.put("/api/admin/system-config", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed" });
    }

    const updated = await prisma.systemConfig.updateMany({
      data: req.body
    });

    

    res.json({ message: "Configuration updated" });

  } catch (err) {
    res.status(500).json({ message: "Failed to update config" });
  }
});

app.get("/api/admin/system-status", async (req, res) => {
  try {

    const userCount = await prisma.user.count();
    const roleCount = await prisma.role.count();
    const bugCount = await prisma.bug.count();
    const testCaseCount = await prisma.testCase.count();

    const uptimeSeconds = process.uptime();

    res.json({
      status: "Running",
      database: "Connected",
      uptime: `${Math.floor(uptimeSeconds / 60)} minutes`,
      users: userCount,
      roles: roleCount,
      bugs: bugCount,
      testCases: testCaseCount,
      serverTime: new Date()
    });

  } catch (err) {
    res.status(500).json({
      status: "Error",
      database: "Disconnected"
    });
  }
});





const { exec } = require("child_process");

app.post("/api/admin/backup", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed" });
    }

    const backupsDir = path.join(process.cwd(), "backups");

    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir);
    }

    const fileName = `backup-${Date.now()}.sql`;
    const backupPath = path.join(backupsDir, fileName);

    const command = `pg_dump -U postgres -h localhost -p 5432 -d testtrack -f "${backupPath}"`;

    exec(command, {
      env: {
        ...process.env,
        PGPASSWORD: "Theju@2004"
      }
    }, (error, stdout, stderr) => {

      if (error) {
        console.log("❌ Backup failed:", error.message);
        console.log(stderr);
        return res.status(500).json({ message: "Backup failed" });
      }

      

      res.json({ message: "Backup created successfully" });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Backup error" });
  }
});
app.get("/api/admin/backups", authenticate, async (req, res) => {

  const backupsDir = path.join(process.cwd(), "backups")
  if (!fs.existsSync(backupsDir)) {
    return res.json([]);
  }

  const files = fs.readdirSync(backupsDir);

  const backups = files.map(file => {
    const filePath = path.join(backupsDir, file);
    const stats = fs.statSync(filePath);

    return {
      name: file,
      size: (stats.size / (1024 * 1024)).toFixed(2) + " MB",
      createdAt: stats.birthtime
    };
  });

  res.json(backups);
});

app.get("/api/admin/backups/download/:name", authenticate, (req, res) => {

  const filePath =  path.join(process.cwd(), "backups", req.params.name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath);
});

app.delete("/api/admin/backups/:name", authenticate, (req, res) => {

  const backupsDir = path.join(process.cwd(), "backups");
  const archiveDir = path.join(process.cwd(), "archived-backups");

  const filePath = path.join(backupsDir, req.params.name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir);
  }

  const archivePath = path.join(archiveDir, req.params.name);

  fs.renameSync(filePath, archivePath);

  res.json({ message: "Backup moved to archive" });
});

app.get("/api/admin/backups/archived", authenticate, (req, res) => {

  const archiveDir = path.join(process.cwd(), "archived-backups");

  if (!fs.existsSync(archiveDir)) {
    return res.json([]);
  }

  const files = fs.readdirSync(archiveDir);

  const backups = files.map(file => {
    const filePath = path.join(archiveDir, file);
    const stats = fs.statSync(filePath);

    return {
      name: file,
      size: (stats.size / (1024 * 1024)).toFixed(2) + " MB",
      createdAt: stats.birthtime
    };
  });

  res.json(backups);
});

app.post("/api/admin/backups/restore-file/:name", authenticate, (req, res) => {

  const backupsDir = path.join(process.cwd(), "backups");
  const archiveDir = path.join(process.cwd(), "archived-backups");

  const filePath = path.join(archiveDir, req.params.name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  const restorePath = path.join(backupsDir, req.params.name);

  fs.renameSync(filePath, restorePath);

  res.json({ message: "Backup restored to active list" });
});





cron.schedule("0 2 * * *", () => {
  console.log("Running auto backup...");

  const backupsDir = path.join(process.cwd(), "backups");

  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir);
  }

  const fileName = `auto-backup-${Date.now()}.sql`;
  const backupPath = path.join(backupsDir, fileName);

  const pgDumpPath = "C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe";

  const args = [
    "-U", "postgres",
    "-h", "localhost",
    "-p", "5432",
    "-d", "testtrack",
    "-f", backupPath
  ];

  execFile(pgDumpPath, args, {
    env: {
      ...process.env,
      PGPASSWORD: "Theju@2004"
    }
  }, (error) => {

    if (error) {
      console.log("Auto backup failed:", error.message);
      return;
    }

    console.log("Auto backup created:", backupPath);
  });
});

app.post("/api/admin/backups/restore/:name", authenticate, (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed" });
    }

    const filePath = path.join(process.cwd(), "backups", req.params.name);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Backup file not found" });
    }

    const command = `psql -U postgres -h localhost -p 5432 -d testtrack -f "${filePath}"`;

    exec(command, {
      env: {
        ...process.env,
        PGPASSWORD: "Theju@2004"
      }
    }, (error, stdout, stderr) => {

      if (error) {
        console.log("❌ Restore failed:", error.message);
        console.log(stderr);
        return res.status(500).json({ message: "Restore failed" });
      }

      console.log("✅ Database restored from:", filePath);

      res.json({ message: "Database restored successfully" });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Restore error" });
  }
});

app.delete("/api/admin/backups/permanent/:name", authenticate, (req, res) => {

  const archiveDir = path.join(process.cwd(), "archived-backups");
  const filePath = path.join(archiveDir, req.params.name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  fs.unlinkSync(filePath);

  res.json({ message: "Backup permanently deleted" });
});

app.get("/api/reports/execution", async (req, res) => {
  const { projectId, all } = req.query;

  const testCaseFilter =
    all === "true"
      ? {}
      : { projectId };

  const total = await prisma.testCase.count({
    where: testCaseFilter,
  });

  const passed = await prisma.testExecution.count({
    where: {
      status: "Passed",
      testCase: testCaseFilter
    },
  });

  res.json({
    total,
    passed,
    passRate: total
      ? ((passed / total) * 100).toFixed(2)
      : 0,
  });
});





app.get("/debug-assign-members", async (req, res) => {

  const users = await prisma.user.findMany();
  const project = await prisma.project.findFirst();

  for (const user of users) {
    await prisma.projectMember.upsert({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: project.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        projectId: project.id
      }
    });
  }

  res.json({ message: "All users assigned to default project" });
});

app.get("/api/projects/:id", authenticate, async (req, res) => {

  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: { id }
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
});



app.get("/api/admin/reports/cross-project", authenticate, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  try {

    const totalProjects = await prisma.project.count({
      where: { active: true }
    });

    const totalTestCases = await prisma.testCase.count();

    const totalRuns = await prisma.testRun.count();

    const totalBugs = await prisma.bug.count();

    const bugsByStatus = await prisma.bug.groupBy({
      by: ["status"],
      _count: { status: true }
    });

    const executions = await prisma.testExecution.groupBy({
      by: ["status"],
      _count: { status: true }
    });

    // Per Project Summary
    const projectSummary = await prisma.project.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            testCases: true,
            bugs: true,
            testRuns: true
          }
        }
      }
    });

    res.json({
      totalProjects,
      totalTestCases,
      totalRuns,
      totalBugs,
      bugsByStatus,
      executions,
      projectSummary
    });

  } catch (err) {
    console.error("Cross Project Report Error:", err);
    res.status(500).json({ message: "Failed to load report" });
  }
});

app.post("/api/projects/:projectId/custom-fields", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { name, type, required, options } = req.body;

  const field = await prisma.projectCustomField.create({
    data: {
      name,
      type,
      required,
      options: options ? JSON.stringify(options) : null,
      projectId: req.params.projectId
    }
  });

  res.json(field);
});

app.get("/api/projects/:projectId/custom-fields", authenticate, async (req, res) => {

  const fields = await prisma.projectCustomField.findMany({
    where: { projectId: req.params.projectId }
  });

  res.json(fields);
});

app.delete("/api/custom-fields/:id", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  await prisma.projectCustomField.delete({
    where: { id: req.params.id }
  });

  res.json({ message: "Deleted successfully" });
});

app.put("/api/custom-fields/:id", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { name, type, required, options } = req.body;

  const result = await prisma.projectCustomField.updateMany({
    where: { id: req.params.id },
    data: {
      name,
      type,
      required,
      options: options ? JSON.stringify(options) : null
    }
  });

  if (result.count === 0) {
    return res.status(404).json({ message: "Field not found" });
  }

  res.json({ message: "Updated successfully" });
});



app.post("/api/projects/:projectId/workflows", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { name, statuses } = req.body;

  const existing = await prisma.projectWorkflow.findFirst({
    where: {
      projectId: req.params.projectId,
      name
    }
  });

  if (existing) {
    const updated = await prisma.projectWorkflow.update({
      where: { id: existing.id },
      data: {
        statuses: JSON.stringify(statuses)
      }
    });
    return res.json(updated);
  }

  const workflow = await prisma.projectWorkflow.create({
    data: {
      name,
      statuses: JSON.stringify(statuses),
      projectId: req.params.projectId
    }
  });

  res.json(workflow);
});

app.get("/api/projects/:projectId/workflows/:name", authenticate, async (req, res) => {

  const workflow = await prisma.projectWorkflow.findFirst({
    where: {
      projectId: req.params.projectId,
      name: req.params.name
    }
  });

  res.json(workflow);
});

app.delete("/api/projects/:projectId/workflows/:name", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  await prisma.projectWorkflow.deleteMany({
    where: {
      projectId: req.params.projectId,
      name: req.params.name
    }
  });

  res.json({ message: "Workflow deleted" });
});


app.post("/api/projects/:projectId/modules", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { name } = req.body;

  const module = await prisma.projectModule.create({
    data: {
      name,
      projectId: req.params.projectId
    }
  });

  res.json(module);
});

app.get("/api/projects/:projectId/modules", authenticate, async (req, res) => {

  const modules = await prisma.projectModule.findMany({
    where: { projectId: req.params.projectId }
  });

  res.json(modules);
});

app.delete("/api/modules/:id", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  await prisma.projectModule.delete({
    where: { id: req.params.id }
  });

  res.json({ message: "Deleted" });
});


app.get("/api/projects/:projectId/environments", authenticate, async (req, res) => {
  const environments = await prisma.projectEnvironment.findMany({
    where: { projectId: req.params.projectId }
  });

  res.json(environments);
});

app.post("/api/projects/:projectId/environments", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { name } = req.body;

  const env = await prisma.projectEnvironment.create({
    data: {
      name,
      projectId: req.params.projectId
    }
  });

  res.json(env);
});

app.delete("/api/environments/:id", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  await prisma.projectEnvironment.delete({
    where: { id: req.params.id }
  });

  res.json({ message: "Deleted" });
});



app.post("/api/projects/:projectId/milestones", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { name, description, targetDate, targetPassRate } = req.body;

  const milestone = await prisma.projectMilestone.create({
    data: {
      name,
      description,
      targetDate: new Date(targetDate),
      targetPassRate: parseFloat(targetPassRate),
      projectId: req.params.projectId
    }
  });

  res.json(milestone);
});



app.delete("/api/milestones/:id", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  await prisma.projectMilestone.delete({
    where: { id: req.params.id }
  });

  res.json({ message: "Milestone deleted" });
});

app.put("/api/milestones/:id", authenticate, async (req, res) => {

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });

  const { name, description, targetDate, targetPassRate } = req.body;

  const updated = await prisma.projectMilestone.update({
    where: { id: req.params.id },
    data: {
      name,
      description,
      targetDate: new Date(targetDate),
      targetPassRate: Number(targetPassRate)
    }
  });

  res.json(updated);
});


app.get("/api/projects/:projectId/milestones", authenticate, async (req, res) => {

  const milestones = await prisma.projectMilestone.findMany({
    where: { projectId: req.params.projectId },
    include: {
      testRuns: {
        include: {
           testCases: true, 
          TestExecution: true
        }
      }
    }
  });

  const result = milestones.map(ms => {

    let total = 0;
    let passed = 0;

    ms.testRuns.forEach(run => {
      run.TestExecution.forEach(exec => {
        total++;
       if ((exec.status || "").toLowerCase() === "passed") passed++;
      });
    });

    const progress = total === 0 ? 0 : (passed / total) * 100;

    let health = "On Track";

    if (progress < ms.targetPassRate - 10)
      health = "At Risk";

    if (new Date() > new Date(ms.targetDate) && progress < ms.targetPassRate)
      health = "Delayed";

    return {
      ...ms,
      progress: progress.toFixed(1),
      health
    };
  });

  res.json(result);
});



app.get("/api/search", authenticate, async (req, res) => {
  try {
    const { q, projectId } = req.query;

    if (!q || !projectId) {
      return res.json({
        testCases: [],
        bugs: [],
        comments: []
      });
    }

    const testCases = await prisma.testCase.findMany({
      where: {
        projectId,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } }
        ]
      },
      take: 20
    });

    const bugs = await prisma.bug.findMany({
      where: {
        projectId,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } }
        ]
      },
      take: 20
    });

    // 🔥 FIXED: use bugComment instead of comment
    const comments = await prisma.bugComment.findMany({
      where: {
        bug: { projectId }, // filter via relation
        content: { contains: q, mode: "insensitive" }
      },
      include: {
        bug: true,
        author: true
      },
      take: 20
    });

    res.json({
      testCases,
      bugs,
      comments
    });

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/advanced-filter", authenticate, async (req, res) => {
  try {
    const {
      type,
      priority,
      status,
      assignedTo,
      module,
      projectId
    } = req.body;

    const filters = [];

    if (priority) filters.push({ priority });
    if (status) filters.push({ status });
    if (module) filters.push({ module });
    if (assignedTo) filters.push({ assignedToId: assignedTo });
    if (projectId) filters.push({ projectId });

    const where = filters.length ? { AND: filters } : {};

    let result = [];

    if (type === "testCase") {
      result = await prisma.testCase.findMany({ where });
    }

    if (type === "bug") {
      result = await prisma.bug.findMany({ where });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/filter-presets", authenticate, async (req, res) => {

  const presets = await prisma.filterPreset.findMany({
    where: {
      OR: [
        { userId: req.user.id },
        { isShared: true }
      ]
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(presets);
});

app.post("/api/filter-presets", authenticate, async (req, res) => {

  const preset = await prisma.filterPreset.create({
    data: {
      name: req.body.name,
      userId: req.user.id,   // ✅ IMPORTANT
      filters: req.body.filters,
      isShared: req.body.isShared
    }
  });

  res.json(preset);
});

app.get("/api/quick-filter", authenticate, async (req, res) => {
  const { type, filter, projectId } = req.query;

  let where = { projectId };

  if (filter === "my-items") {
    where.assignedToId = req.user.id;
  }

  if (filter === "unassigned") {
    where.assignedToId = null;
  }

  if (filter === "recent") {
    where.updatedAt = {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };
  }

  let result = [];

  if (type === "testCase") {
    result = await prisma.testCase.findMany({ where });
  }

  if (type === "bug") {
    result = await prisma.bug.findMany({ where });
  }

  res.json(result);
});



app.get("/api/notifications", authenticate,async (req, res) => {
  const userId = req.user.id;
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

app.get("/api/notifications/unread-count", authenticate,async (req, res) => {
  const userId = req.user.id;
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

app.patch("/api/notifications/:id/read",authenticate, async (req, res) => {
  const userId = req.user.id;
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });

    res.json(notification);
  } catch (err) {
    console.error("MARK READ ERROR:", err);
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

app.patch("/api/notifications/mark-all-read",authenticate, async (req, res) => {
  const userId = req.user.id;
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

app.get("/api/notifications/preferences", async (req, res) => {

  const token = req.headers.authorization?.split(" ")[1];
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  const userId = payload.id;

  let pref = await prisma.notificationPreference.findUnique({
    where: { userId }
  });

  if (!pref) {
    pref = await prisma.notificationPreference.create({
      data: { userId }
    });
  }

  res.json(pref);
});

app.put("/api/notifications/preferences", async (req, res) => {

  const token = req.headers.authorization?.split(" ")[1];
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  const userId = payload.id;

  const updated = await prisma.notificationPreference.update({
    where: { userId },
    data: req.body
  });

  res.json(updated);
});

// DELETE single notification
app.delete("/api/notifications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const token = req.headers.authorization?.split(" ")[1];
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const userId = payload.id;

    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ Ensure user can only delete their own notifications
    if (notification.userId !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await prisma.notification.delete({
      where: { id }
    });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/reports/schedule", async (req, res) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    // ✅ Only admin allowed
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { type, frequency, dayOfWeek, time } = req.body;

    if (!type || !frequency || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const schedule = await prisma.reportSchedule.create({
      data: {
        userId: payload.id,
        type,
        frequency,
        dayOfWeek: frequency === "WEEKLY" ? dayOfWeek : null,
        time
      }
    });

    res.json(schedule);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create schedule" });
  }
});

app.get("/api/reports/schedule", async (req, res) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const schedules = await prisma.reportSchedule.findMany({
      where: { userId: payload.id }, // ✅ only own schedules
      include: {
  ReportScheduleHistory: {
          orderBy: { executedAt: "desc" },
          take: 5
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(schedules);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch schedules" });
  }
});

app.delete("/api/reports/schedule/:id", async (req, res) => {

  const scheduleId = req.params.id;

  try {

    await prisma.reportScheduleHistory.deleteMany({
      where: { scheduleId }
    });

    await prisma.reportSchedule.delete({
      where: { id: scheduleId }
    });

    res.json({ message: "Deleted successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Delete failed" });

  }

});

app.put("/api/reports/schedule/:id", async (req, res) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const schedule = await prisma.reportSchedule.findUnique({
      where: { id: req.params.id }
    });

    if (!schedule || schedule.userId !== payload.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await prisma.reportSchedule.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
});



app.post("/api/reports/run/:id", async (req, res) => {

  try {

    const schedule = await prisma.reportSchedule.findUnique({
      where: { id: req.params.id },
      include: { user: true }
    });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    if (!schedule.user) {
      return res.status(400).json({ message: "User not found for schedule" });
    }

    console.log("Running report for:", schedule.user.email);

    // 🔹 Generate report data
    const reportData = await generateTestExecutionData(schedule.userId);

    // 🔹 Generate PDF
    const pdfPath = await generateExecutionPdf(reportData);

    // 🔹 Email body
    const html = `
      <h2>Test Execution Report</h2>
      <p>Total Executed: ${reportData.total}</p>
      <p>Passed: ${reportData.passed}</p>
      <p>Failed: ${reportData.failed}</p>
      <p>Pass Rate: ${reportData.passRate}%</p>
      <p>See attached PDF for full report.</p>
    `;

    // 🔹 Send email with attachment
    await sendEmail(
      schedule.user.email,
      "Manual Test Report",
      html,
      pdfPath
    );

    await prisma.reportScheduleHistory.create({
      data: {
        scheduleId: schedule.id,
        status: "SUCCESS",
        message: "Manual report executed with PDF"
      }
    });

    res.json({ message: "Report executed successfully" });

  } catch (error) {

    console.error("Run report error:", error);

    await prisma.reportScheduleHistory.create({
      data: {
        scheduleId: req.params.id,
        status: "FAILED",
        message: error.message
      }
    });

    res.status(500).json({
      message: "Report execution failed",
      error: error.message
    });

  }

});
const PORT = process.env.PORT || 5000;
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH"]
  }
});

// Store user socket mapping
const userSockets = new Map();

io.on("connection", (socket) => {

  

  socket.on("register", (userId) => {
    userSockets.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
      }
    }
  });

});

// Make io globally accessible
app.set("io", io);
app.set("userSockets", userSockets);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});