-- CreateTable
CREATE TABLE "Commit" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bugId" TEXT,

    CONSTRAINT "Commit_pkey" PRIMARY KEY ("id")
);
