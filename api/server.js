const express = require('express');
const cors = require('cors');
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/properties', propertyRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Room For U API',
    endpoints: {
      properties: '/api/properties',
      magicBricks: '/api/properties/magicbricks?city=mumbai&type=rent',
      acres99: '/api/properties/99acres?city=delhi&type=buy'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 