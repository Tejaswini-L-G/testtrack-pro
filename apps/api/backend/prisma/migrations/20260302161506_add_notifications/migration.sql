-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bugAssignedEmail" BOOLEAN NOT NULL DEFAULT true,
    "bugAssignedInApp" BOOLEAN NOT NULL DEFAULT true,
    "statusChangedEmail" BOOLEAN NOT NULL DEFAULT true,
    "statusChangedInApp" BOOLEAN NOT NULL DEFAULT true,
    "commentEmail" BOOLEAN NOT NULL DEFAULT false,
    "commentInApp" BOOLEAN NOT NULL DEFAULT true,
    "testAssignedEmail" BOOLEAN NOT NULL DEFAULT true,
    "testAssignedInApp" BOOLEAN NOT NULL DEFAULT true,
    "retestEmail" BOOLEAN NOT NULL DEFAULT true,
    "retestInApp" BOOLEAN NOT NULL DEFAULT true,
    "quietHoursStart" TEXT,
    "quietHoursEnd" TEXT,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
