/*
  Warnings:

  - You are about to drop the column `testSuiteId` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the `SuiteTestCase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SuiteTestCase" DROP CONSTRAINT "SuiteTestCase_suiteId_fkey";

-- DropForeignKey
ALTER TABLE "SuiteTestCase" DROP CONSTRAINT "SuiteTestCase_testCaseId_fkey";

-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_testSuiteId_fkey";

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "testSuiteId",
ADD COLUMN     "suiteId" TEXT;

-- DropTable
DROP TABLE "SuiteTestCase";

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_suiteId_fkey" FOREIGN KEY ("suiteId") REFERENCES "TestSuite"("id") ON DELETE SET NULL ON UPDATE CASCADE;
