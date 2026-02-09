const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("./passport");
const upload = require("./upload");
const path = require("path");

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");




const app = express();
app.use(passport.initialize());

const prisma = new PrismaClient();

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


app.use(express.json());

const nodemailer = require("nodemailer");
let transporterPromise = nodemailer.createTestAccount().then(testAccount => {
  const t = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log("📩 Ethereal Email Ready");
  return t;
});

async function sendDevEmail({ to, subject, text, html }) {
  const transporter = await transporterPromise;

  const info = await transporter.sendMail({
    from: '"TestTrack Pro" <no-reply@testtrack.pro>',
    to,
    subject,
    text,
    html,
  });

  console.log("📩 Preview URL:", nodemailer.getTestMessageUrl(info));
}


let transporter;

(async () => {
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log("📩 Ethereal Email Ready");
})();

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

    res.redirect(`${process.env.FRONTEND_URL}/`);
  } catch {
    res.send("Verification link expired");
  }
});

// 👉 PASTE REGISTER API BELOW THIS LINE
app.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    email = email.toLowerCase().trim();

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

    // ✅ CREATE USER FIRST
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        verifyToken,
        isVerified: false,
        passwordHistory: [hashed],
      },
    });

    // ✅ SEND RESPONSE IMMEDIATELY
    res.json({
      message:
        "Registration successful! Please check your email to verify your account.",
    });

    // 📩 TRY SENDING EMAIL (FAILURE WON'T AFFECT USER NOW)
    try {
      const link = `${process.env.FRONTEND_URL}/verify/${verifyToken}`;

      const info = await transporter.sendMail({
  from: '"TestTrack Pro" <no-reply@testtrack.pro>',
  to: email,
  subject: "TestTrack Pro - Verify Your Account",
  text: `Verify your account by opening this link:\n\n${link}`,
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h2>TestTrack Pro</h2>
      <p>Click the button below to verify your account:</p>
      <a href="${link}" 
         style="display:inline-block;padding:10px 20px;background:#4facfe;color:white;text-decoration:none;border-radius:5px;">
         Verify Account
      </a>
      <p style="margin-top:10px;">Or copy this link:</p>
      <p>${link}</p>
    </div>
  `
});

// 👇 THIS PRINTS PREVIEW URL
console.log("📩 Preview URL:", nodemailer.getTestMessageUrl(info));


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

  res.json({ accessToken, refreshToken });
});

app.post("/forgot-password", async (req, res) => {
  try {
    console.log("🚀 Forgot Password HIT");

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔑 Generate token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 💾 Save token to DB
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetExpiry: new Date(Date.now() + 3600000),
      },
    });

    // 🔗 Generate link AFTER token exists
    const link = `${process.env.FRONTEND_URL}/reset/${token}`;

    console.log("🔗 Reset link generated:", link);

    // 📩 DEV MODE — PRINT LINK IN TERMINAL
    res.json({
      message: "Reset link generated",
      resetLink: link
    });

  } catch (err) {
    console.error("❌ FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Failed to generate reset link" });
  }
});



app.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password required" });
    }

    // 🔍 Find user by token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpiry: {
          gt: new Date(), // ⏰ Must not be expired
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset link expired or invalid" });
    }

    // 🔐 Strong password check
    const isStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
      newPassword
    );

    if (!isStrong) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars, uppercase, lowercase, number & special char",
      });
    }

    // 🔁 Password history check (last 5)
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

    // 🔒 Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // 💾 Save & clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetExpiry: null,
        passwordHistory: {
          push: hashed,
        },
      },
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Reset failed" });
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

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};



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


app.post("/testcases", authenticate, async (req, res) => {
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
      testData,
      environment,
      steps
    } = req.body;

    // ✅ Ignore deleted test cases
    const count = await prisma.testCase.count({
      where: { isDeleted: false }
    });

    const testCaseId = `TC-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

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
        testData,
        environment,

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

    if (!existing) {
      return res.status(404).json({ message: "Test case not found" });
    }

    // ✅ SAVE OLD VERSION (CORRECT WAY)
    await prisma.testCaseVersion.create({
      data: {
        testCaseId: existing.id,
        version: existing.version,
        changeLog: req.body.changeLog || "Test case updated",
        snapshot: existing   // 👈 FULL JSON SNAPSHOT
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
    if (req.user.role !== "tester") {
      return res.status(403).json({ message: "Only testers can clone test cases" });
    }

    const original = await prisma.testCase.findUnique({
      where: { id: req.params.id },
      include: { steps: true }
    });

    if (!original) {
      return res.status(404).json({ message: "Original test case not found" });
    }

    // 🔥 Generate new Test Case ID
    const count = await prisma.testCase.count();
    const newTestCaseId = `TC-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

    const cloned = await prisma.testCase.create({
      data: {
        testCaseId: newTestCaseId,
        title: `${original.title} (Clone)`,
        description: original.description,
        module: original.module,
        priority: original.priority,
        severity: original.severity,
        type: original.type,
        status: "Draft",
        createdById: req.user.id,

        steps: {
          create: original.steps.map(step => ({
            stepNumber: step.stepNumber,
            action: step.action,
            testData: step.testData,
            expected: step.expected
          }))
        }
      },
      include: { steps: true }
    });

    res.json(cloned);

  } catch (err) {
    console.error("CLONE TEST CASE ERROR:", err);
    res.status(500).json({ error: err.message });
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
      include: { steps: true }
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

      const result = await prisma.testCase.updateMany({
        where: {
          id: { in: testCaseIds },
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


app.get("/testcases/:id/attachments", authenticate, async (req, res) => {
  const attachments = await prisma.attachment.findMany({
    where: {
      testCaseId: req.params.id,
      isDeleted: false,
    },
  });

  res.json(attachments);
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

    const count = await prisma.testCase.count();
    const testCaseId = `TC-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

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
        createdById: req.user.id,

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
  upload.single("file"),   // ← reuse existing upload
  async (req, res) => {
    try {
      if (req.user.role !== "tester") {
        return res
          .status(403)
          .json({ message: "Only testers can import test cases" });
      }

      const rows = [];

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => rows.push(data))
        .on("end", () => {
          const grouped = {};

          rows.forEach((row) => {
            if (!grouped[row.title]) {
              grouped[row.title] = {
                title: row.title,
                module: row.module,
                priority: row.priority,
                severity: row.severity,
                type: row.type,
                status: row.status,
                steps: [],
              };
            }

            grouped[row.title].steps.push({
              stepNumber: Number(row.stepNumber),
              action: row.action,
              testData: row.testData || null,
              expected: row.expected,
            });
          });

          fs.unlinkSync(req.file.path);

          res.json({
            message: "Preview successful",
            totalTestCases: Object.keys(grouped).length,
            preview: Object.values(grouped),
          });
        });
    } catch (err) {
      console.error("IMPORT PREVIEW ERROR:", err);
      res.status(500).json({ message: "Failed to preview import" });
    }
  }
);

app.post("/testcases/import/confirm", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "tester") {
      return res
        .status(403)
        .json({ message: "Only testers can import test cases" });
    }

    const { testCases } = req.body;

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ message: "No test cases to import" });
    }

    const created = [];

    for (const tc of testCases) {
      const count = await prisma.testCase.count();

      const testCaseId = `TC-${new Date().getFullYear()}-${String(
        count + 1
      ).padStart(5, "0")}`;

      const saved = await prisma.testCase.create({
  data: {
    testCaseId,
    title: tc.title,
    description:
      tc.description || `Imported test case: ${tc.title}`,
    module: tc.module,
    priority: tc.priority,
    severity: tc.severity,
    type: tc.type,
    status: tc.status || "Draft",

    createdBy: {
      connect: { id: req.user.id },
    },

    steps: {
      create: tc.steps.map((s) => ({
        stepNumber: s.stepNumber,
        action: s.action,
        testData: s.testData || null,
        expected: s.expected,
      })),
    },
  },
  include: { steps: true },
});

      created.push(saved);
    }

    res.json({
      message: "Import completed successfully",
      importedCount: created.length,
      testCases: created,
    });
  } catch (err) {
    console.error("IMPORT CONFIRM ERROR:", err);
    res.status(500).json({ message: "Failed to import test cases" });
  }
});





// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
