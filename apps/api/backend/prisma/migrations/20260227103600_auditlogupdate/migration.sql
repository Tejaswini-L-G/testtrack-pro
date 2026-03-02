/*
  Warnings:

  - You are about to drop the column `performedById` on the `AuditLog` table. All the data in the column will be lost.
  - Added the required column `userId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_performedById_fkey";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "performedById",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
