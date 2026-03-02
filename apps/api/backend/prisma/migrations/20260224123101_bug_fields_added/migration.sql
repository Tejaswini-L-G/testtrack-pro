/*
  Warnings:

  - A unique constraint covering the columns `[bugId]` on the table `Bug` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bug" ADD COLUMN     "actualBehavior" TEXT,
ADD COLUMN     "affectedVersion" TEXT,
ADD COLUMN     "bugId" TEXT,
ADD COLUMN     "environment" TEXT,
ADD COLUMN     "expectedBehavior" TEXT,
ADD COLUMN     "stepsToReproduce" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Bug_bugId_key" ON "Bug"("bugId");
