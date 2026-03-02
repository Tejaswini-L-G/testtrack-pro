-- CreateTable
CREATE TABLE "ProjectModule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectModule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectModule" ADD CONSTRAINT "ProjectModule_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
