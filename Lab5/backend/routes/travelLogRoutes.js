const express = require('express');
const router = express.Router();
// Use the travelLogController logic (which is now in clientController.js due to failed rename)
const travelLogController = require('../controllers/clientController');
const auth = require('../middleware/auth'); // Import auth middleware

// Apply auth middleware to all routes in this file
router.use(auth);

// Routes for Travel Logs (all protected)
router.get('/', travelLogController.getAllTravelLogs);
router.get('/:id', travelLogController.getTravelLogById);
router.post('/', travelLogController.createTravelLog);
router.put('/:id', travelLogController.updateTravelLog);
router.delete('/:id', travelLogController.deleteTravelLog);

module.exports = router;
