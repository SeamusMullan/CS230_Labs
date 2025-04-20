const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Corrected controller name
const auth = require('../middleware/auth'); // Import auth middleware

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/profile', auth, userController.getProfile);

module.exports = router;
