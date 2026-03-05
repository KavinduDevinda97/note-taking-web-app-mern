const express = require('express');
const router = express.Router();
const { getNotes, getNoteById, createNote, updateNote, deleteNote, addCollaborator,removeCollaborator } = require('../controllers/notesController');
const { protect } = require('../middleware/auth');

router.use(protect); // All note routes require authentication

router.route('/')
    .get(getNotes)
    .post(createNote);

router.route('/:id')
    .get(getNoteById)
    .put(updateNote)
    .delete(deleteNote);

router.post('/:id/collaborators', addCollaborator);
router.delete('/:id/collaborators/:collabId', removeCollaborator);

module.exports = router;
