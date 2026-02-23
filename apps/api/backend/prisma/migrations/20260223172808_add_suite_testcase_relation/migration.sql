/*
  Warnings:

  - You are about to drop the column `suiteId` on the `TestCase` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_suiteId_fkey";

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "suiteId",
ADD COLUMN     "testSuiteId" TEXT;

-- CreateTable
CREATE TABLE "SuiteTestCase" (
    "id" TEXT NOT NULL,
    "suiteId" TEXT NOT NULL,
    "testCaseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SuiteTestCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuiteTestCase_suiteId_testCaseId_key" ON "SuiteTestCase"("suiteId", "testCaseId");

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "TestSuite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuiteTestCase" ADD CONSTRAINT "SuiteTestCase_suiteId_fkey" FOREIGN KEY ("suiteId") REFERENCES "TestSuite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuiteTestCase" ADD CONSTRAINT "SuiteTestCase_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
