const express = require("express");
const noteController = require("../controllers/note.controller");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post("/", noteController.createNote);
router.get("/", noteController.getNotes);
router.get("/:id", noteController.getNoteById);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;