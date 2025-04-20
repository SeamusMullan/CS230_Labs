const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapistController');

// GET all therapists
router.get('/', therapistController.getAllTherapists);

// GET therapist by id
router.get('/:id', therapistController.getTherapistById);

// POST new therapist
router.post('/', therapistController.createTherapist);

// PUT update therapist
router.put('/:id', therapistController.updateTherapist);

// DELETE therapist
router.delete('/:id', therapistController.deleteTherapist);

module.exports = router;
