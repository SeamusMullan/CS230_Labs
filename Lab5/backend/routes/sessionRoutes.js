const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// GET all sessions
router.get('/', sessionController.getAllSessions);

// GET session by id
router.get('/:id', sessionController.getSessionById);

// POST new session
router.post('/', sessionController.createSession);

// PUT update session
router.put('/:id', sessionController.updateSession);

// DELETE session
router.delete('/:id', sessionController.deleteSession);

module.exports = router;
