-- Create enum type
CREATE TYPE "AuditActorType" AS ENUM ('USER', 'SYSTEM', 'SERVICE', 'WEBHOOK', 'ANONYMOUS');

-- Add column with default to existing table
ALTER TABLE "AuditLog"
  ADD COLUMN "actorType" "AuditActorType" NOT NULL DEFAULT 'SYSTEM';

UPDATE "AuditLog"
SET "actorType" = 'USER'
WHERE "actorUserId" IS NOT NULL;


