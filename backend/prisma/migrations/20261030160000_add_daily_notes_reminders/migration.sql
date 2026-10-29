ALTER TABLE "Note"
  ADD COLUMN "reminderAt" TIMESTAMP(3),
  ADD COLUMN "dailyDate" TIMESTAMP(3);

CREATE UNIQUE INDEX "Note_userId_dailyDate_key" ON "Note"("userId", "dailyDate");
CREATE INDEX "Note_userId_reminderAt_idx" ON "Note"("userId", "reminderAt");
