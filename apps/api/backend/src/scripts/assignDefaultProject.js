const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const defaultProjectId = "5a372245-d15d-4439-aeaa-fde1eb24e9b4";

  await prisma.testCase.updateMany({
    where: { projectId: null },
    data: { projectId: defaultProjectId }
  });

  await prisma.testSuite.updateMany({
    where: { projectId: null },
    data: { projectId: defaultProjectId }
  });

  await prisma.testRun.updateMany({
    where: { projectId: null },
    data: { projectId: defaultProjectId }
  });

  await prisma.bug.updateMany({
    where: { projectId: null },
    data: { projectId: defaultProjectId }
  });

  console.log("✅ Default project assigned successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());