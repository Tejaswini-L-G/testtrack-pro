-- CreateTable
CREATE TABLE "Bug" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "testCaseId" TEXT,
    "runId" TEXT,
    "stepNumber" INTEGER,
    "evidencePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bug_pkey" PRIMARY KEY ("id")
);
