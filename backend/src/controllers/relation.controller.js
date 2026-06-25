const relationService = require("../services/relation.service");

async function createRelation(req, res) {
  try {
    const relation = await relationService.createRelation(
      req.body.sourceNoteId,
      req.body.targetNoteId,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      data: relation,
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function getRelations(req, res) {
  try {
    const relations = await relationService.getRelations(
      req.user.id
    );

    return res.json({
      success: true,
      data: relations,
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function deleteRelation(req, res) {
  try {
    const result = await relationService.deleteRelation(
      req.params.sourceId,
      req.params.targetId
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  createRelation,
  getRelations,
  deleteRelation,
};