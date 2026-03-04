const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();// adjust path if needed

const requirePermission = (permission) => {
  return async (req, res, next) => {

    try {

      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          Role: {
            include: {
              permissions: true
            }
          }
        }
      });

      if (!user || !user.Role) {
        return res.status(403).json({ message: "No role assigned" });
      }

      const hasPermission = user.Role.permissions.some(
        p => p.name === permission
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: "Permission denied"
        });
      }

      next();

    } catch (err) {
      console.error("PERMISSION CHECK ERROR:", err);
      res.status(500).json({ message: "Permission check failed" });
    }

  };
};

module.exports = requirePermission;