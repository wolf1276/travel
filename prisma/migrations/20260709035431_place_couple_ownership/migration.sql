-- Rename places.user_id -> places.created_by_id: the column keeps meaning
-- "who added this place" (attribution), it's just no longer the access-
-- control column now that coupleId exists.
ALTER TABLE "places" RENAME COLUMN "user_id" TO "created_by_id";
ALTER TABLE "places" RENAME CONSTRAINT "places_user_id_fkey" TO "places_created_by_id_fkey";

-- AlterTable: add nullable first so existing rows can be backfilled below
ALTER TABLE "places" ADD COLUMN "couple_id" TEXT;

-- Backfill: every existing place is owned by its creator's current couple
UPDATE "places"
SET "couple_id" = "users"."couple_id"
FROM "users"
WHERE "users"."id" = "places"."created_by_id";

-- AlterTable: now that every row has a couple, enforce it going forward
ALTER TABLE "places" ALTER COLUMN "couple_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "couples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Replace the old (user_id, status) index with (couple_id, status), matching
-- the new query pattern used by the API routes
DROP INDEX "places_user_id_status_idx";
CREATE INDEX "places_couple_id_status_idx" ON "places"("couple_id", "status");
