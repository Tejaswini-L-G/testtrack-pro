-- CreateTable
CREATE TABLE "ProjectWorkflow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "statuses" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectWorkflow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectWorkflow" ADD CONSTRAINT "ProjectWorkflow_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
