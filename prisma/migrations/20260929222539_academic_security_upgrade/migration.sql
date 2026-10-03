/*
  Warnings:

  - The values [TAMPERED,DOWNLOADED] on the enum `TransferStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('EXAMINATION', 'RESULT', 'PROJECT', 'ASSIGNMENT', 'STUDENT_RECORD', 'DEPARTMENTAL', 'ADMINISTRATIVE', 'RESEARCH', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ConfidentialityLevel" AS ENUM ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'HIGHLY_CONFIDENTIAL');

-- CreateEnum
CREATE TYPE "public"."IntegrityStatus" AS ENUM ('PENDING', 'VERIFIED', 'COMPROMISED');

-- CreateEnum
CREATE TYPE "public"."AttackAction" AS ENUM ('NONE', 'FORWARDED', 'MODIFIED', 'BLOCKED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Role" ADD VALUE 'LECTURER';
ALTER TYPE "public"."Role" ADD VALUE 'HOD';
ALTER TYPE "public"."Role" ADD VALUE 'EXAM_OFFICER';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TransferStatus_new" AS ENUM ('PENDING', 'ENCRYPTING', 'SENDING', 'IN_TRANSIT', 'ATTACK_DETECTED', 'VERIFYING', 'DELIVERED', 'REJECTED');
ALTER TABLE "public"."FileTransfer" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."FileTransfer" ALTER COLUMN "status" TYPE "public"."TransferStatus_new" USING ("status"::text::"public"."TransferStatus_new");
ALTER TYPE "public"."TransferStatus" RENAME TO "TransferStatus_old";
ALTER TYPE "public"."TransferStatus_new" RENAME TO "TransferStatus";
DROP TYPE "public"."TransferStatus_old";
ALTER TABLE "public"."FileTransfer" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "public"."FileTransfer" ADD COLUMN     "attackAction" "public"."AttackAction" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "batchId" TEXT,
ADD COLUMN     "confidentiality" "public"."ConfidentialityLevel" NOT NULL DEFAULT 'CONFIDENTIAL',
ADD COLUMN     "currentHash" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "documentType" "public"."DocumentType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "integrity" "public"."IntegrityStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "interceptedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "department" TEXT;
