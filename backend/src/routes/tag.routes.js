const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const tagController = require("../controllers/tag.controller");

router.use(authenticate);

router.post("/", tagController.createTag);

router.get("/", tagController.getTags);

router.post("/:id", tagController.attachTag);

// GET tags for one note
router.get("/:id", tagController.getTagsForNote);

router.delete("/:id/:tagId", tagController.removeTag);

module.exports = router;