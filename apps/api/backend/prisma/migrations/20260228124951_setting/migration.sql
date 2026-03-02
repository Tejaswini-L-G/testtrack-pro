-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "defaultSeverity" TEXT,
    "defaultPriority" TEXT,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "autoAssignBug" BOOLEAN NOT NULL DEFAULT false,
    "maxUploadSize" INTEGER NOT NULL DEFAULT 10,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);
