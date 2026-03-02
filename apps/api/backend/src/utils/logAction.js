
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function logAction(
  userId,
  action,
  details = "",
  entity = "System",
  entityId = null
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details
      }
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}

module.exports = logAction;