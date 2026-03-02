-- CreateTable
CREATE TABLE "ExecutionEvidence" (
    "id" TEXT NOT NULL,
    "testCaseId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExecutionEvidence_pkey" PRIMARY KEY ("id")
);
