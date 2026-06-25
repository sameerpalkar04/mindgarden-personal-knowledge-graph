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
    const notes = await noteService.getNotes(req.user.id);

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

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};