const attachmentService = require("../services/attachment.service");

async function list(req, res) {
  try {
    const attachments = await attachmentService.listAttachments(req.user.id, req.params.id);
    return res.json({ success: true, data: attachments });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function create(req, res) {
  try {
    const attachment = await attachmentService.createAttachment(req.user.id, req.params.id, req.body);
    return res.status(201).json({ success: true, data: attachment });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function download(req, res) {
  try {
    const attachment = await attachmentService.findAttachment(req.user.id, req.params.id, req.params.attachmentId);
    return res.download(attachment.filePath, attachment.fileName);
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
}

async function remove(req, res) {
  try {
    const result = await attachmentService.removeAttachment(req.user.id, req.params.id, req.params.attachmentId);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
}

module.exports = { list, create, download, remove };
