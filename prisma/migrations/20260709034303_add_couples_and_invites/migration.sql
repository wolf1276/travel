-- CreateEnum
CREATE TYPE "CoupleInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED');

-- CreateTable
CREATE TABLE "couples" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "couples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "couple_invites" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "invited_by_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "CoupleInviteStatus" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "couple_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "couple_invites_token_key" ON "couple_invites"("token");

-- CreateIndex
CREATE INDEX "couple_invites_couple_id_idx" ON "couple_invites"("couple_id");

-- AlterTable: add nullable first so existing rows can be backfilled below
ALTER TABLE "users" ADD COLUMN "couple_id" TEXT;

-- Backfill: give every pre-existing user their own solo couple
DO $$
DECLARE
  u RECORD;
  new_couple_id TEXT;
BEGIN
  FOR u IN SELECT id FROM "users" WHERE "couple_id" IS NULL LOOP
    new_couple_id := extensions.gen_random_uuid()::text;
    INSERT INTO "couples" ("id", "created_at") VALUES (new_couple_id, CURRENT_TIMESTAMP);
    UPDATE "users" SET "couple_id" = new_couple_id WHERE "id" = u.id;
  END LOOP;
END $$;

-- AlterTable: now that every row has a couple, enforce it going forward
ALTER TABLE "users" ALTER COLUMN "couple_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "couples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "couple_invites" ADD CONSTRAINT "couple_invites_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "couple_invites" ADD CONSTRAINT "couple_invites_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "couple_invites" ADD CONSTRAINT "couple_invites_accepted_by_id_fkey" FOREIGN KEY ("accepted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
