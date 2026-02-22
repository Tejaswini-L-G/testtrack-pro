-- CreateTable
CREATE TABLE "TestRun" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Planned',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestRunCase" (
    "id" TEXT NOT NULL,
    "testRunId" TEXT NOT NULL,
    "testCaseId" TEXT NOT NULL,

    CONSTRAINT "TestRunCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestRunAssignment" (
    "id" TEXT NOT NULL,
    "testRunId" TEXT NOT NULL,
    "testerId" TEXT NOT NULL,

    CONSTRAINT "TestRunAssignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestRunCase" ADD CONSTRAINT "TestRunCase_testRunId_fkey" FOREIGN KEY ("testRunId") REFERENCES "TestRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRunAssignment" ADD CONSTRAINT "TestRunAssignment_testRunId_fkey" FOREIGN KEY ("testRunId") REFERENCES "TestRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRunAssignment" ADD CONSTRAINT "TestRunAssignment_testerId_fkey" FOREIGN KEY ("testerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
