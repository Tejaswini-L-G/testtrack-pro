const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("./Passport");
const upload = require("./upload");
const path = require("path");

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const xlsx = require("xlsx");





const app = express();
app.use(passport.initialize());

const prisma = new PrismaClient();

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));




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
        startsWith: `TC-${year}-`,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let next = 1;

  if (last) {
    next = parseInt(last.testCaseId.split("-")[2], 10) + 1;
  }

  return `TC-${year}-${String(next).padStart(5, "0")}`;
}

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
        `,
      });

      // 👇 Preview link (Ethereal)
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

  res.json({
  accessToken,
  refreshToken,
  role: user.role,
  name: user.name
});
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
     
postconditions,

      testData,
      environment,
      steps
    } = req.body;

    // ✅ Ignore deleted test cases
    const testCaseId = await generateTestCaseId();


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
  environment,
  cleanupSteps,
        

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

        createdById: req.user.id,

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
  const testCases = await prisma.testCase.findMany({
  where: { isDeleted: false },
  include: {
    steps: true,
    attachments: true,
    createdBy: {
      select: {
        id: true,
        name: true
      }
    }
  },
  orderBy: {
    createdAt: "desc"
  }
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

          createdById: req.user.id,

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
    const { name, description } = req.body;

    const suite = await prisma.testSuite.create({
      data: {
        name,
        description,
        createdById: req.user.id,
      },
    });

    res.json(suite);
  } catch (err) {
    console.error("CREATE SUITE ERROR:", err);
    res.status(500).json({ message: "Failed to create suite" });
  }
});

app.get("/suites", authenticate, async (req, res) => {
  try {
    const suites = await prisma.testSuite.findMany({
  where: {
    isDeleted: false   // ✅ ADD THIS
  },
  include: {
    _count: {
      select: { testCases: true }
    }
  }
});


    res.json(suites);
  } catch (err) {
    console.error("FETCH SUITES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch suites" });
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
    const { name, description } = req.body;

    const updated = await prisma.testSuite.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
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
  const suites = await prisma.testSuite.findMany({
    where: { isDeleted: false },
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

  const testCases = await prisma.testCase.findMany({
    orderBy: { createdAt: "desc" },
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
  const deleted = await prisma.testCase.findMany({
    where: { isDeleted: true },
    orderBy: { updatedAt: "desc" }
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
        },
        create: {
          executionId,
          stepNumber: step.stepNumber,
          actual: step.actual,
          status: step.status,
        },
      });
    }

    res.json({ message: "Progress saved" });

  } catch (err) {
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
      testerIds
    } = req.body;

    const run = await prisma.testRun.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),

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

    res.json(run);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/testruns", async (req, res) => {

  const runs = await prisma.testRun.findMany({
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

app.post(
  "/api/bugs",
  
  upload.single("evidence"),   // ⭐ REQUIRED
  async (req, res) => {

    try {

      const {
        title,
        description,
        severity,
        priority,
        testCaseId,
        runId,
        stepNumber
      } = req.body;

      const userId = req.user?.id; // from JWT middleware

      const bug = await prisma.bug.create({
        data: {
          title,
          description,
          severity,
          priority,
          testCaseId,
          runId,
          stepNumber: parseInt(stepNumber),
          reportedById: req.body.userId,
          evidence: req.file?.filename
        }
      });

      res.json(bug);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.get("/api/bugs", async (req, res) => {

  const bugs = await prisma.bug.findMany({
    orderBy: { createdAt: "desc" }
  });

  res.json(bugs);

});
app.get("/api/bugs/my/:testerId", async (req, res) => {

  const testerId = req.params.testerId;

  const bugs = await prisma.bug.findMany({
    where: {
      reportedById: testerId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(bugs);

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


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
