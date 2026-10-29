CREATE TABLE "NoteAttachment" (
  "id" SERIAL NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "storageKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "noteId" INTEGER NOT NULL,
  CONSTRAINT "NoteAttachment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NoteAttachment_storageKey_key" ON "NoteAttachment"("storageKey");
CREATE INDEX "NoteAttachment_noteId_idx" ON "NoteAttachment"("noteId");
ALTER TABLE "NoteAttachment" ADD CONSTRAINT "NoteAttachment_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
