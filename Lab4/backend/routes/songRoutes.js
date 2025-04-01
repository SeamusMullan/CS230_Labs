const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

// GET all songs
router.get('/', songController.getAllSongs);

// GET song by id
router.get('/:id', songController.getSongById);

// POST new song
router.post('/', songController.createSong);

// PUT update song
router.put('/:id', songController.updateSong);

// DELETE song
router.delete('/:id', songController.deleteSong);

module.exports = router;