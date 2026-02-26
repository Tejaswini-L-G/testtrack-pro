// src/middleware/authorize.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();// adjust path if needed

const authorize = (...allowedPermissions) => {
  return async (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Unauthorized" });

    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    // Get user with role + permissions
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        Role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user || !user.Role)
      return res.status(403).json({ message: "No role assigned" });

    const userPermissions =
      user.Role.permissions.map(p => p.name);

    const hasPermission =
      allowedPermissions.some(p =>
        userPermissions.includes(p)
      );

    if (!hasPermission)
      return res.status(403).json({ message: "Access denied" });

    req.user = user;
    next();
  };
};

module.exports = authorize;