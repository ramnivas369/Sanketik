# Room For U - Property Scraper API

## Description
This API provides endpoints to scrape property data from popular real estate websites like MagicBricks and 99acres. It caches the results to reduce load on the target websites and improve response times.

## Legal Notice
**Important**: This API is for educational purposes only. Web scraping may violate the Terms of Service of the target websites. Always check and comply with the website's robots.txt file and Terms of Service before deploying in a production environment.

## Installation

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Steps
1. Navigate to the api directory:
   ```
   cd "Room For U/api"
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

For development with auto-restart:
```
npm run dev
```

## API Endpoints

### Root
- **GET /** - Basic API information and available endpoints

### Properties
- **GET /api/properties** - Get all properties (from cache/database)
- **GET /api/properties/magicbricks** - Scrape properties from MagicBricks
  - Query parameters:
    - `city` (default: 'mumbai')
    - `type` (default: 'rent')
- **GET /api/properties/99acres** - Scrape properties from 99acres
  - Query parameters:
    - `city` (default: 'delhi')
    - `type` (default: 'buy')

## Example Requests

### Scrape properties for rent in Mumbai from MagicBricks
```
GET /api/properties/magicbricks?city=mumbai&type=rent
```

### Scrape properties for sale in Delhi from 99acres
```
GET /api/properties/99acres?city=delhi&type=buy
```

## Response Format

All API responses follow this general format:

```json
{
  "success": true,
  "source": "scraper", // or "cache" if data is from cache
  "count": 10,
  "data": [
    {
      "title": "3 BHK Apartment",
      "price": "₹85.5 Lac",
      "location": "Andheri West, Mumbai",
      "area": "1200 sqft",
      "link": "https://www.example.com/property/123",
      "imageUrl": "https://www.example.com/image.jpg",
      "source": "MagicBricks"
    },
    // More properties...
  ]
}
```

## Integration with Room For U Website

To display these properties on the Room For U website:

1. Make an AJAX call to the API endpoint
2. Parse the JSON response
3. Render the properties in your desired format
4. Handle pagination, filtering, etc. as needed

### Example Frontend Integration

```javascript
// Example code to fetch properties from the API
async function fetchProperties(source, city, type) {
  try {
    const response = await fetch(`/api/properties/${source}?city=${city}&type=${type}`);
    const data = await response.json();
    
    if (data.success) {
      // Render properties on the page
      renderProperties(data.data);
    } else {
      console.error('Error fetching properties:', data.error);
    }
  } catch (error) {
    console.error('Failed to fetch properties:', error);
  }
}

// Call the function
fetchProperties('magicbricks', 'mumbai', 'rent');
```

## Notes
- The API uses caching to avoid excessive requests to the source websites
- Cache TTL is set to 1 hour by default
- Adjust the selectors in the scraper functions if the website structure changes 