const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const graphController = require("../controllers/graph.controller");

const router = express.Router();

router.use(authenticate);

router.get("/", graphController.getGraph);

module.exports = router;