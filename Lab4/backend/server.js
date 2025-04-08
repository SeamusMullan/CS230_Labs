require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 1234;

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const therapistRoutes = require('./routes/therapistRoutes');
const clientRoutes = require('./routes/clientRoutes');
const sessionRoutes = require('./routes/sessionRoutes');


// Use routes
app.use('/api/therapists', therapistRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sessions', sessionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
