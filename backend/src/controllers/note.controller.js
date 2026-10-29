const noteService = require("../services/note.service");

async function createNote(req, res) {
  try {
    const note = await noteService.createNote(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getNotes(req, res) {
  try {
    const view = ["active", "archive", "trash"].includes(req.query.view) ? req.query.view : "active";
    const notes = await noteService.getNotes(req.user.id, view);

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getOrCreateDailyNote(req, res) {
  try {
    const note = await noteService.getOrCreateDailyNote(req.user.id, req.body.date);
    return res.status(200).json({ success: true, data: note });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function getReminders(req, res) {
  try {
    const notes = await noteService.getReminders(req.user.id);
    return res.json({ success: true, data: notes });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function setReminder(req, res) {
  try {
    const note = await noteService.setNoteReminder(req.user.id, req.params.id, req.body.reminderAt);
    return res.json({ success: true, data: note });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function getNoteById(req, res) {
  try {
    const note = await noteService.getNoteById(
      req.user.id,
      req.params.id
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function shareNote(req, res) {
  try {
    const share = await noteService.shareNote(req.user.id, req.params.id, req.body.email);
    return res.status(201).json({ success: true, data: share });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
}

async function getNoteShares(req, res) {
  try {
    const shares = await noteService.getNoteShares(req.user.id, req.params.id);
    return res.json({ success: true, data: shares });
  } catch (error) { return res.status(404).json({ success: false, message: error.message }); }
}

async function revokeNoteShare(req, res) {
  try {
    const result = await noteService.revokeNoteShare(req.user.id, req.params.id, req.params.shareId);
    return res.json({ success: true, data: result });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
}

async function updateNote(req, res) {
  try {
    const note = await noteService.updateNote(
      req.user.id,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getNoteHistory(req, res) {
  try {
    const revisions = await noteService.getNoteHistory(req.user.id, req.params.id);
    return res.json({ success: true, data: revisions });
  } catch (error) { return res.status(404).json({ success: false, message: error.message }); }
}

async function restoreNoteRevision(req, res) {
  try {
    const note = await noteService.restoreNoteRevision(req.user.id, req.params.id, req.params.revisionId);
    return res.json({ success: true, data: note });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
}

async function deleteNote(req, res) {
  try {
    const result = await noteService.deleteNote(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function setNotePinned(req, res) {
  try {
    const note = await noteService.setNotePinned(req.user.id, req.params.id, req.body.isPinned);
    return res.json({ success: true, data: note });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function setNoteArchived(req, res) {
  try {
    const note = await noteService.setNoteArchived(req.user.id, req.params.id, req.body.archived);
    return res.json({ success: true, data: note });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function restoreNote(req, res) {
  try {
    const note = await noteService.restoreNote(req.user.id, req.params.id);
    return res.json({ success: true, data: note });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

async function permanentlyDeleteNote(req, res) {
  try {
    const result = await noteService.permanentlyDeleteNote(req.user.id, req.params.id);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = {
  createNote,
  getNotes,
  getOrCreateDailyNote,
  getReminders,
  setReminder,
  getNoteById,
  shareNote,
  getNoteShares,
  revokeNoteShare,
  updateNote,
  getNoteHistory,
  restoreNoteRevision,
  deleteNote,
  setNotePinned,
  setNoteArchived,
  restoreNote,
  permanentlyDeleteNote,
};
