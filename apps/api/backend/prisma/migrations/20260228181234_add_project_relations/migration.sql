/*
  Warnings:

  - Made the column `projectId` on table `Bug` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `TestCase` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `TestRun` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `TestSuite` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Bug" DROP CONSTRAINT "Bug_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TestRun" DROP CONSTRAINT "TestRun_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TestSuite" DROP CONSTRAINT "TestSuite_projectId_fkey";

-- AlterTable
ALTER TABLE "Bug" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TestCase" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TestRun" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TestSuite" ALTER COLUMN "projectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSuite" ADD CONSTRAINT "TestSuite_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRun" ADD CONSTRAINT "TestRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bug" ADD CONSTRAINT "Bug_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
