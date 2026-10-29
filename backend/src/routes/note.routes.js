const express = require("express");
const noteController = require("../controllers/note.controller");
const authenticate = require("../middleware/auth.middleware");
const attachmentController = require("../controllers/attachment.controller");

const router = express.Router();

router.use(authenticate);

router.post("/", noteController.createNote);
router.post("/daily", noteController.getOrCreateDailyNote);
router.get("/reminders", noteController.getReminders);
router.get("/", noteController.getNotes);
router.post("/:id/reminder", noteController.setReminder);
router.get("/:id/history", noteController.getNoteHistory);
router.post("/:id/history/:revisionId/restore", noteController.restoreNoteRevision);
router.get("/:id/attachments", attachmentController.list);
router.post("/:id/attachments", attachmentController.create);
router.get("/:id/attachments/:attachmentId", attachmentController.download);
router.delete("/:id/attachments/:attachmentId", attachmentController.remove);
router.post("/:id/pin", noteController.setNotePinned);
router.post("/:id/archive", noteController.setNoteArchived);
router.post("/:id/restore", noteController.restoreNote);
router.delete("/:id/permanent", noteController.permanentlyDeleteNote);
router.get("/:id", noteController.getNoteById);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
