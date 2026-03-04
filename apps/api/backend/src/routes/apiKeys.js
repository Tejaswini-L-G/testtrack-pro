/**
 * @swagger
 * /api/keys:
 *   post:
 *     summary: Create new API key
 *     tags: [API Keys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: API key created
 */









const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

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

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", authenticate, async (req, res) => {

  const { name } = req.body;

  const key = uuidv4();

  const apiKey = await prisma.apiKey.create({
    data: {
      key,
      name,
      userId: req.user.id
    }
  });

  res.json(apiKey);

});

router.get("/", authenticate, async (req, res) => {

  const keys = await prisma.apiKey.findMany({
    where: { userId: req.user.id }
  });

  res.json(keys);

});

router.delete("/:id", authenticate, async (req, res) => {

  await prisma.apiKey.update({
    where: { id: req.params.id },
    data: { isActive: false }
  });

  res.json({ message: "API key revoked" });

});

module.exports = router;