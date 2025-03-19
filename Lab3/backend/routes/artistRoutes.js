const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');

// GET all artists
router.get('/', artistController.getAllArtists);

// GET artist by id
router.get('/:id', artistController.getArtistById);

// POST new artist
router.post('/', artistController.createArtist);

// PUT update artist
router.put('/:id', artistController.updateArtist);

// DELETE artist
router.delete('/:id', artistController.deleteArtist);

module.exports = router;