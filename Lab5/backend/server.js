require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 1234;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// Import routes
const userRoutes = require('./routes/therapistRoutes'); // User logic is in therapistRoutes due to rename issue
const travelLogRoutes = require('./routes/travelLogRoutes');
const journeyPlanRoutes = require('./routes/journeyPlanRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/travel-logs', travelLogRoutes);
app.use('/api/journey-plans', journeyPlanRoutes);

// Basic error handling middleware (optional but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
