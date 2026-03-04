const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const NodeCache = require('node-cache');

// Cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

// Get all properties (from cache)
exports.getAllProperties = async (req, res) => {
  try {
    // Get from cache if available
    const cachedProperties = cache.get('allProperties');
    if (cachedProperties) {
      return res.json({
        success: true,
        source: 'cache',
        count: cachedProperties.length,
        data: cachedProperties
      });
    }

    // If not in cache, return empty array
    // In a real app, this would fetch from a database
    return res.json({
      success: true,
      source: 'database',
      count: 0,
      data: []
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch properties'
    });
  }
};

// Scrape MagicBricks
exports.scrapeMagicBricks = async (req, res) => {
  try {
    const { city = 'mumbai', type = 'rent' } = req.query;
    
    // Create cache key
    const cacheKey = `magicbricks_${city}_${type}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        source: 'cache',
        count: cachedData.length,
        data: cachedData
      });
    }
    
    // Launch puppeteer for dynamic content
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Construct URL based on parameters
      const url = `https://www.magicbricks.com/property-for-${type}-in-${city}/residential-real-estate`;
      
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      
      // Wait for property cards to load
      await page.waitForSelector('.m-srp-card', { timeout: 10000 }).catch(() => console.log('Timeout waiting for property cards'));
      
      // Get page content
      const content = await page.content();
      const $ = cheerio.load(content);
      
      const properties = [];
      
      // Extract data from property cards
      $('.m-srp-card').each((index, element) => {
        const title = $(element).find('.m-srp-card__title').text().trim();
        const price = $(element).find('.m-srp-card__price').text().trim();
        const location = $(element).find('.m-srp-card__locality').text().trim();
        const area = $(element).find('.m-srp-card__area').text().trim();
        const link = $(element).find('a.m-srp-card__link').attr('href');
        
        let imageUrl = $(element).find('.m-srp-card__image img').attr('src');
        if (!imageUrl) {
          imageUrl = $(element).find('.m-srp-card__image').attr('data-src');
        }
        
        properties.push({
          title,
          price,
          location,
          area,
          link,
          imageUrl,
          source: 'MagicBricks'
        });
      });
      
      // Store in cache
      if (properties.length > 0) {
        cache.set(cacheKey, properties);
      }
      
      return res.json({
        success: true,
        source: 'scraper',
        count: properties.length,
        data: properties
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error scraping MagicBricks:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to scrape MagicBricks',
      message: error.message
    });
  }
};

// Scrape 99Acres
exports.scrape99Acres = async (req, res) => {
  try {
    const { city = 'delhi', type = 'buy' } = req.query;
    
    // Create cache key
    const cacheKey = `99acres_${city}_${type}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        source: 'cache',
        count: cachedData.length,
        data: cachedData
      });
    }
    
    // Launch puppeteer for dynamic content
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Construct URL based on parameters
      let url;
      if (type === 'rent') {
        url = `https://www.99acres.com/search/property/rent/${city}-all`;
      } else {
        url = `https://www.99acres.com/search/property/buy/${city}-all`;
      }
      
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      
      // Wait for property cards to load
      await page.waitForSelector('.srpTuple', { timeout: 10000 }).catch(() => console.log('Timeout waiting for property cards'));
      
      // Get page content
      const content = await page.content();
      const $ = cheerio.load(content);
      
      const properties = [];
      
      // Extract data from property cards
      $('.srpTuple').each((index, element) => {
        const title = $(element).find('.srpTuple__tupleTitleOverflow').text().trim();
        const price = $(element).find('.srpTuple__price').text().trim();
        const location = $(element).find('.srpTuple__locationOverflow').text().trim();
        const area = $(element).find('.srpTuple__Attribute:first-child').text().trim();
        const link = $(element).find('a.srpTuple__tupleLink').attr('href');
        
        let imageUrl = $(element).find('.srpTuple__cardPhoto img').attr('src');
        
        properties.push({
          title,
          price,
          location,
          area,
          link: link ? 'https://www.99acres.com' + link : '',
          imageUrl,
          source: '99Acres'
        });
      });
      
      // Store in cache
      if (properties.length > 0) {
        cache.set(cacheKey, properties);
      }
      
      return res.json({
        success: true,
        source: 'scraper',
        count: properties.length,
        data: properties
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error scraping 99Acres:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to scrape 99Acres',
      message: error.message
    });
  }
}; 