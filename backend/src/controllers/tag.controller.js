const tagService = require("../services/tag.service");

async function createTag(req, res) {
  try {
    const tag = await tagService.createTag(req.body.name);

    return res.status(201).json({
      success: true,
      data: tag,
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function getTags(req, res) {
  try {
    const tags = await tagService.getTags();

    return res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function attachTag(req, res) {
  try {
    const result = await tagService.attachTagToNote(
      req.params.id,
      req.body.tagId,
      req.user.id
    );

    return res.status(201).json({
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

async function getTagsForNote(req, res) {
  try {
    const tags = await tagService.getTagsForNote(req.params.id, req.user.id);

    return res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

async function removeTag(req, res) {
  try {
    const result = await tagService.removeTagFromNote(
      req.params.id,
      req.params.tagId,
      req.user.id
    );

    return res.status(200).json({
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
  createTag,
  getTags,
 attachTag,
  getTagsForNote,
  removeTag,
};
