-- AlterTable
ALTER TABLE "Bug" ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "TestRun" ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "TestSuite" ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSuite" ADD CONSTRAINT "TestSuite_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRun" ADD CONSTRAINT "TestRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bug" ADD CONSTRAINT "Bug_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
