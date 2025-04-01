const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');

// GET all albums
router.get('/', albumController.getAllAlbums);

// GET album by id
router.get('/:id', albumController.getAlbumById);

// POST new album
router.post('/', albumController.createAlbum);

// PUT update album
router.put('/:id', albumController.updateAlbum);

// DELETE album
router.delete('/:id', albumController.deleteAlbum);

module.exports = router;