/*
  Warnings:

  - Added the required column `receiverEmail` to the `FileTransfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storedName` to the `FileTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."FileTransfer" ADD COLUMN     "iv" TEXT,
ADD COLUMN     "receiverEmail" TEXT NOT NULL,
ADD COLUMN     "storedName" TEXT NOT NULL;
