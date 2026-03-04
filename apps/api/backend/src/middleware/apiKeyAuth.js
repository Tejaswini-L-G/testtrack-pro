const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function apiKeyAuth(req, res, next) {

  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      message: "API key required"
    });
  }

  const key = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { user: true }
  });

  if (!key || !key.isActive) {
    return res.status(403).json({
      message: "Invalid API key"
    });
  }

  req.user = key.user;

  next();
}

module.exports = apiKeyAuth;