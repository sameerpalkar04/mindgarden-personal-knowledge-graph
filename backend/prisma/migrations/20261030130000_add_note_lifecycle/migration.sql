ALTER TABLE "Note"
  ADD COLUMN "isPinned" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "archivedAt" TIMESTAMP(3),
  ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "Note_userId_archivedAt_deletedAt_idx"
  ON "Note"("userId", "archivedAt", "deletedAt");
