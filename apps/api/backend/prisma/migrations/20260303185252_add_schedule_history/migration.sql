-- CreateTable
CREATE TABLE "ReportScheduleHistory" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "message" TEXT,

    CONSTRAINT "ReportScheduleHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportScheduleHistory" ADD CONSTRAINT "ReportScheduleHistory_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "ReportSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
