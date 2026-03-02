-- AlterTable
ALTER TABLE "Bug" ADD COLUMN     "commitLink" TEXT,
ADD COLUMN     "fixNotes" TEXT,
ADD COLUMN     "fixedAt" TIMESTAMP(3),
ADD COLUMN     "resolutionNote" TEXT;
