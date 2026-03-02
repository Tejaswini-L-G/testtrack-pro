-- AlterTable
ALTER TABLE "TestCase" ADD COLUMN     "impactIfFails" TEXT,
ADD COLUMN     "testDataRequirements" TEXT;

-- AlterTable
ALTER TABLE "TestCaseTemplate" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT true;
