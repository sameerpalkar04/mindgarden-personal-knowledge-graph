const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const relationController = require("../controllers/relation.controller");

const router = express.Router();

router.use(authenticate);

router.post("/", relationController.createRelation);

router.get("/", relationController.getRelations);

router.delete(
  "/:sourceId/:targetId",
  relationController.deleteRelation
);

module.exports = router;