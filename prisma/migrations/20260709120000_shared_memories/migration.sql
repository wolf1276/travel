-- Rating becomes optional: a couple can log a visit (date, journal, photos)
-- without being forced to rate it.
ALTER TABLE "visits" ALTER COLUMN "rating" DROP NOT NULL;
