-- CreateTable
CREATE TABLE "ProjectCustomField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectCustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCaseCustomValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "testCaseId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,

    CONSTRAINT "TestCaseCustomValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectCustomField" ADD CONSTRAINT "ProjectCustomField_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseCustomValue" ADD CONSTRAINT "TestCaseCustomValue_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseCustomValue" ADD CONSTRAINT "TestCaseCustomValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ProjectCustomField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
