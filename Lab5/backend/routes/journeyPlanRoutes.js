const express = require('express');
const router = express.Router();
// Use the journeyPlanController logic (which is now in sessionController.js due to failed rename)
const journeyPlanController = require('../controllers/sessionController');
const auth = require('../middleware/auth'); // Import auth middleware

// Apply auth middleware to all routes in this file
router.use(auth);

// Routes for Journey Plans (all protected)
router.get('/', journeyPlanController.getAllJourneyPlans);
router.get('/:id', journeyPlanController.getJourneyPlanById);
router.post('/', journeyPlanController.createJourneyPlan);
router.put('/:id', journeyPlanController.updateJourneyPlan);
router.delete('/:id', journeyPlanController.deleteJourneyPlan);

module.exports = router;
