-- CreateTable
CREATE TABLE "TestExecution" (
    "id" TEXT NOT NULL,
    "testCaseId" TEXT NOT NULL,
    "executedById" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "TestExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutionStep" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "expected" TEXT NOT NULL,
    "actual" TEXT,
    "status" TEXT,
    "notes" TEXT,

    CONSTRAINT "ExecutionStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExecutionStep" ADD CONSTRAINT "ExecutionStep_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "TestExecution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
