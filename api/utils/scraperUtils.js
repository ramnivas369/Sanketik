/**
 * Utility functions for the web scraper
 */

// Clean up text by removing excess whitespace
exports.cleanText = (text) => {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
};

// Convert price string to standardized format
exports.standardizePrice = (priceStr) => {
  if (!priceStr) return '';
  
  // Remove all non-numeric characters except dots
  const numericPrice = priceStr.replace(/[^\d.]/g, '');
  
  // Try to parse as number
  const price = parseFloat(numericPrice);
  if (isNaN(price)) return priceStr;
  
  // Format based on value
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lac`;
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(2)} K`;
  }
  
  return `₹${price}`;
};

// Get a default image if the image URL is missing
exports.getDefaultImage = (type) => {
  const defaultImages = {
    flat: '/img/index-page-img/1bhkroom.avif',
    house: '/img/index-page-img/2bhkroom.avif',
    single: '/img/index-page-img/singleroom.avif',
    villa: '/img/index-page-img/3bhkroom.avif',
    default: '/img/index-page-img/1RKroom.avif'
  };
  
  return defaultImages[type] || defaultImages.default;
};

// Helper function to handle errors
exports.handleError = (res, error, source) => {
  console.error(`Error scraping ${source}:`, error);
  return res.status(500).json({
    success: false,
    error: `Failed to scrape ${source}`,
    message: error.message
  });
};

// Format property data to a standard format
exports.formatProperty = (rawProperty, source) => {
  return {
    id: `${source}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    title: this.cleanText(rawProperty.title) || 'Property for Sale/Rent',
    price: this.standardizePrice(rawProperty.price) || 'Price on Request',
    location: this.cleanText(rawProperty.location) || 'Location not specified',
    area: this.cleanText(rawProperty.area) || 'Area not specified',
    bedrooms: rawProperty.bedrooms || 'Not specified',
    bathrooms: rawProperty.bathrooms || 'Not specified',
    link: rawProperty.link || '#',
    imageUrl: rawProperty.imageUrl || this.getDefaultImage('default'),
    source: source,
    listedOn: new Date().toISOString(),
    amenities: rawProperty.amenities || [],
    description: rawProperty.description || 'No description available'
  };
}; 