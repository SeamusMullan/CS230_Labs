require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 1234;

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const artistRoutes = require('./routes/artistRoutes');
const songRoutes = require('./routes/songRoutes');
const albumRoutes = require('./routes/albumRoutes');

// Use routes
app.use('/api/artists', artistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
