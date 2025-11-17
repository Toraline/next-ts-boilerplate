/*
  Warnings:

  - Added the required column `userId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- Delete existing data (Option A: Delete all existing categories and tasks)
DELETE FROM "Task";
DELETE FROM "Category";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
