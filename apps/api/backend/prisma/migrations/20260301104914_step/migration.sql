/*
  Warnings:

  - A unique constraint covering the columns `[executionId,stepNumber]` on the table `ExecutionStep` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExecutionStep_executionId_stepNumber_key" ON "ExecutionStep"("executionId", "stepNumber");
