-- CreateTable
CREATE TABLE "FilterPreset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FilterPreset_pkey" PRIMARY KEY ("id")
);
