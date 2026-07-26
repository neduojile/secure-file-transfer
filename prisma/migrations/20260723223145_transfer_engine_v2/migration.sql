/*
  Warnings:

  - The values [SENT,FAILED,BLOCKED] on the enum `TransferStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'ATTACKER';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TransferStatus_new" AS ENUM ('PENDING', 'ENCRYPTING', 'SENDING', 'IN_TRANSIT', 'ATTACK_DETECTED', 'VERIFYING', 'DELIVERED', 'TAMPERED', 'REJECTED', 'DOWNLOADED');
ALTER TABLE "public"."FileTransfer" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."FileTransfer" ALTER COLUMN "status" TYPE "public"."TransferStatus_new" USING ("status"::text::"public"."TransferStatus_new");
ALTER TYPE "public"."TransferStatus" RENAME TO "TransferStatus_old";
ALTER TYPE "public"."TransferStatus_new" RENAME TO "TransferStatus";
DROP TYPE "public"."TransferStatus_old";
ALTER TABLE "public"."FileTransfer" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
