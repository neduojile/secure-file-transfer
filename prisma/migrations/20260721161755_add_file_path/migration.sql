/*
  Warnings:

  - Added the required column `filePath` to the `FileTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."FileTransfer" DROP CONSTRAINT "FileTransfer_receiverId_fkey";

-- AlterTable
ALTER TABLE "public"."FileTransfer" ADD COLUMN     "filePath" TEXT NOT NULL,
ALTER COLUMN "receiverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."FileTransfer" ADD CONSTRAINT "FileTransfer_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
