const express = require('express');
const router = express.Router();
const { 
  scrapeMagicBricks,
  scrape99Acres,
  getAllProperties
} = require('../controllers/propertyController');

// Get all properties (from our database/cache)
router.get('/', getAllProperties);

// Scrape MagicBricks
router.get('/magicbricks', scrapeMagicBricks);

// Scrape 99Acres
router.get('/99acres', scrape99Acres);

module.exports = router; 