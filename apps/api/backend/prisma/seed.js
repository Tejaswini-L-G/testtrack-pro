const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {

  const permissions = [
    // TESTER
    "CREATE_TEST_CASE",
    "EDIT_TEST_CASE",
    "DELETE_TEST_CASE",
    "EXECUTE_TEST",
    "UPLOAD_ATTACHMENT",
    "CREATE_SUITE",
    "GENERATE_REPORT",
    "COMMENT",
    "VIEW_ALL_TESTS",
    "CREATE_BUG",
    "ASSIGN_BUG",

    // DEVELOPER
    "VIEW_REPORTS",
    "VIEW_ASSIGNED_ISSUES",
    "UPDATE_ISSUE",
    "ADD_FIX_NOTES",
    "REQUEST_RETEST",
    "LINK_COMMITS",
    "EXPORT_REPORT",

    // ADMIN
    "MANAGE_USERS",
    "MANAGE_PROJECTS",
    "MANAGE_ROLES",
    "VIEW_AUDIT",
    "SYSTEM_CONFIG",
    "BACKUP"
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p },
      update: {},
      create: { name: p }
    });
  }

  const tester = await prisma.role.upsert({
    where: { name: "tester" },
    update: {},
    create: {
      name: "tester",
      permissions: {
        connect: permissions
          .slice(0, 11)
          .map(name => ({ name }))
      }
    }
  });

  const developer = await prisma.role.upsert({
    where: { name: "developer" },
    update: {},
    create: {
      name: "developer",
      permissions: {
        connect: permissions
          .slice(11, 18)
          .map(name => ({ name }))
      }
    }
  });

  const admin = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      permissions: {
        connect: permissions
          .slice(18)
          .map(name => ({ name }))
      }
    }
  });

  console.log("Roles & permissions seeded ✅");
}

main();