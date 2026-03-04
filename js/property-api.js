/**
 * Room For U - Property API Integration
 * This file provides functions to fetch and display properties from the API
 */

// Base API URL - update this with your actual API URL when deployed
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : 'http://localhost:3000/api';

// Add support for more Indian cities
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad', 
  'Guwahati', 'Chandigarh', 'Coimbatore', 'Mysore', 'Noida', 'Jabalpur', 'Gwalior', 
  'Vijayawada', 'Madurai', 'Jodhpur', 'Raipur', 'Kota', 'Gurgaon', 'Bareilly', 'Moradabad',
  'Trivandrum', 'Aligarh', 'Bhubaneswar', 'Salem', 'Dehradun', 'Jammu', 'Jamnagar',
  'Warangal', 'Guntur', 'Bhiwandi', 'Tiruppur', 'Surat', 'Thiruvananthapuram', 'Kochi'
];

// Mock data to use when API is unavailable
const MOCK_PROPERTIES = {};

// Pre-populate mock properties for major cities
function initializeMockData() {
  INDIAN_CITIES.forEach(city => {
    const count = 10 + Math.floor(Math.random() * 15); // Random count between 10-25
    MOCK_PROPERTIES[city.toLowerCase()] = generateMockProperties(city, count);
  });
}

// Initialize mock data on load
initializeMockData();

// Function to fetch properties from MagicBricks
async function fetchMagicBricksProperties(city = 'mumbai', type = 'rent', shouldRender = true) {
  try {
    // Show loading state if we're rendering
    if (shouldRender) {
      showLoadingState();
    }
    
    // Try to fetch from API
    try {
      const response = await fetch(`${API_BASE_URL}/properties/magicbricks?city=${city}&type=${type}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Set a short timeout to fail faster if API is unreachable
        signal: AbortSignal.timeout(10000)
      });
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        console.log(`Loaded ${data.count} properties from ${data.source}`);
        
        if (shouldRender) {
          renderProperties(data.data, 'property-container');
        }
        
        // Hide loading state if we're rendering
        if (shouldRender) {
          hideLoadingState();
        }
        
        return data.data;
      } else {
        // Throw error to trigger fallback
        throw new Error('No data returned from API');
      }
    } catch (apiError) {
      console.warn('API Error, using fallback data:', apiError);
      
      // Use mock data as fallback
      const normalizedCity = city.toLowerCase();
      let mockData = [];
      
      // Find mock data for the city or use a default
      if (MOCK_PROPERTIES[normalizedCity]) {
        mockData = MOCK_PROPERTIES[normalizedCity];
      } else {
        // Find closest match using Levenshtein distance or partial match
        const matchedCity = findClosestCityMatch(normalizedCity);
        
        if (matchedCity) {
          mockData = MOCK_PROPERTIES[matchedCity.toLowerCase()] || generateMockProperties(matchedCity, 15);
        } else {
          // Generate new mock data for this city
          mockData = generateMockProperties(city, 15);
          // Cache it for future use
          MOCK_PROPERTIES[normalizedCity] = mockData;
        }
      }
      
      if (shouldRender) {
        renderProperties(mockData, 'property-container');
      }
      
      // Hide loading state if we're rendering
      if (shouldRender) {
        hideLoadingState();
      }
      
      return mockData;
    }
  } catch (error) {
    console.error('Error in fetchMagicBricksProperties:', error);
    
    // Use fallback data
    const mockData = generateMockProperties(city, 12);
    
    if (shouldRender) {
      renderProperties(mockData, 'property-container');
      hideLoadingState();
    }
    
    return mockData;
  }
}

// Function to fetch properties from 99acres
async function fetch99AcresProperties(city = 'delhi', type = 'buy', shouldRender = true) {
  try {
    // Show loading state if we're rendering
    if (shouldRender) {
      showLoadingState();
    }
    
    // Try to fetch from API
    try {
      const response = await fetch(`${API_BASE_URL}/properties/99acres?city=${city}&type=${type}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Set a short timeout to fail faster if API is unreachable
        signal: AbortSignal.timeout(10000)
      });
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        console.log(`Loaded ${data.count} properties from ${data.source}`);
        
        if (shouldRender) {
          renderProperties(data.data, 'property-container');
        }
        
        // Hide loading state if we're rendering
        if (shouldRender) {
          hideLoadingState();
        }
        
        return data.data;
      } else {
        // Throw error to trigger fallback
        throw new Error('No data returned from API');
      }
    } catch (apiError) {
      console.warn('API Error, using fallback data:', apiError);
      
      // Use mock data as fallback
      const normalizedCity = city.toLowerCase();
      let mockData = [];
      
      // Find mock data for the city or use a default
      if (MOCK_PROPERTIES[normalizedCity]) {
        mockData = MOCK_PROPERTIES[normalizedCity];
      } else {
        // Find closest match using Levenshtein distance or partial match
        const matchedCity = findClosestCityMatch(normalizedCity);
        
        if (matchedCity) {
          mockData = MOCK_PROPERTIES[matchedCity.toLowerCase()] || generateMockProperties(matchedCity, 15);
        } else {
          // Generate new mock data for this city
          mockData = generateMockProperties(city, 15);
          // Cache it for future use
          MOCK_PROPERTIES[normalizedCity] = mockData;
        }
      }
      
      if (shouldRender) {
        renderProperties(mockData, 'property-container');
      }
      
      // Hide loading state if we're rendering
      if (shouldRender) {
        hideLoadingState();
      }
      
      return mockData;
    }
  } catch (error) {
    console.error('Error in fetch99AcresProperties:', error);
    
    // Use fallback data
    const mockData = generateMockProperties(city, 12);
    
    if (shouldRender) {
      renderProperties(mockData, 'property-container');
      hideLoadingState();
    }
    
    return mockData;
  }
}

// Function to fetch properties from multiple sources
async function fetchAllProperties(city, shouldRender = true) {
  try {
    // Show loading state if we're rendering
    if (shouldRender) {
      showLoadingState();
    }
    
    // Try to fetch from both sources
    const [magicBricksProps, acresProps] = await Promise.all([
      fetchMagicBricksProperties(city, 'rent', false),
      fetch99AcresProperties(city, 'rent', false)
    ]);
    
    // Combine results
    const allProperties = [...magicBricksProps, ...acresProps];
    
    // Remove duplicates (based on title and location)
    const uniqueProperties = removeDuplicateProperties(allProperties);
    
    if (shouldRender) {
      renderProperties(uniqueProperties, 'property-container');
      hideLoadingState();
    }
    
    return uniqueProperties;
  } catch (error) {
    console.error('Error fetching all properties:', error);
    
    // Use fallback data
    const mockData = generateMockProperties(city, 20);
    
    if (shouldRender) {
      renderProperties(mockData, 'property-container');
      hideLoadingState();
    }
    
    return mockData;
  }
}

// Remove duplicate properties
function removeDuplicateProperties(properties) {
  const seen = new Set();
  return properties.filter(property => {
    const key = `${property.title}-${property.location}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Function to find closest city match
function findClosestCityMatch(cityQuery) {
  // Normalize query
  const query = cityQuery.toLowerCase();
  
  // First check for exact or partial matches
  for (const city of INDIAN_CITIES) {
    if (city.toLowerCase() === query) {
      return city;
    }
  }
  
  // Check for partial matches (city name contains query or query contains city name)
  for (const city of INDIAN_CITIES) {
    const lowerCity = city.toLowerCase();
    if (lowerCity.includes(query) || query.includes(lowerCity)) {
      return city;
    }
  }
  
  // If no match found, find closest match using Levenshtein distance
  let closestMatch = null;
  let minDistance = Infinity;
  
  for (const city of INDIAN_CITIES) {
    const distance = levenshteinDistance(query, city.toLowerCase());
    
    // If the distance is less than 3, it's a good match
    if (distance < 3) {
      return city;
    }
    
    // Otherwise track the closest match
    if (distance < minDistance) {
      minDistance = distance;
      closestMatch = city;
    }
  }
  
  // If we found a reasonably close match (distance < 5), return it
  if (minDistance < 5) {
    return closestMatch;
  }
  
  // If no good match found, return null
  return null;
}

// Calculate Levenshtein distance between two strings
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // Initialize the matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Function to render properties on the page
function renderProperties(properties, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container #${containerId} not found!`);
    return;
  }
  
  // Clear previous properties
  container.innerHTML = '';
  
  if (!properties || properties.length === 0) {
    container.innerHTML = '<div class="no-properties">No properties found. Try changing your search criteria.</div>';
    return;
  }
  
  // Create property cards
  properties.forEach(property => {
    const propertyCard = createPropertyCard(property);
    container.appendChild(propertyCard);
  });
}

// Function to create a property card element
function createPropertyCard(property) {
  const card = document.createElement('div');
  card.className = 'property-card';
  
  // Default image if none provided
  const imageUrl = property.imageUrl || defaultPropertyImage(property.title, true);
  
  card.innerHTML = `
    <div class="property-image">
      <img src="${imageUrl}" alt="${property.title}" onerror="this.src='${defaultPropertyImage(property.title, true)}';">
    </div>
    <div class="property-details">
      <h3 class="property-title">${property.title}</h3>
      <p class="property-price">${property.price}</p>
      <p class="property-location">
        <i class="fa-solid fa-location-dot"></i> ${property.location}
      </p>
      <p class="property-area">
        <i class="fa-solid fa-ruler-combined"></i> ${property.area}
      </p>
      <a href="${property.link}" target="_blank" class="view-property-btn">View Details</a>
    </div>
  `;
  
  return card;
}

// Get default image based on property type
function defaultPropertyImage(title = '', useAbsolutePath = false) {
  title = title ? title.toLowerCase() : '';
  
  // Base path for images
  const basePath = useAbsolutePath || isHomePage() ? './img/index-page-img/' : '../img/index-page-img/';
  
  if (title.includes('1 bhk') || title.includes('1bhk')) {
    return `${basePath}1bhkroom.avif`;
  } else if (title.includes('2 bhk') || title.includes('2bhk')) {
    return `${basePath}2bhkroom.avif`;
  } else if (title.includes('3 bhk') || title.includes('3bhk')) {
    return `${basePath}3bhkroom.avif`;
  } else if (title.includes('single') || title.includes('1 room')) {
    return `${basePath}singleroom.avif`;
  } else if (title.includes('1 rk') || title.includes('1rk')) {
    return `${basePath}1RKroom.avif`;
  }
  
  // Default image
  return `${basePath}1bhkroom.avif`;
}

// Check if we're on the home page
function isHomePage() {
  const path = window.location.pathname;
  return path === '/' || path.endsWith('index.html') || path.endsWith('/');
}

// Generate mock property data for testing
function generateMockProperties(city, count = 10) {
  const localities = generateMockLocalities(city);
  const propertyTypes = ['1 BHK', '2 BHK', '3 BHK', 'Single Room', '1 RK'];
  const amenities = [
    ['Parking', 'Security', 'Lift'],
    ['Power Backup', 'Swimming Pool', 'Gym'],
    ['Garden', 'Clubhouse', 'Children\'s Play Area'],
    ['CCTV', 'Gated Community', 'WiFi'],
    ['Furnished', 'AC', 'Balcony']
  ];
  const properties = [];
  
  for (let i = 0; i < count; i++) {
    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const locality = localities[Math.floor(Math.random() * localities.length)];
    const price = generateRandomPrice(type);
    const area = generateRandomArea(type);
    const propertyAmenities = amenities[Math.floor(Math.random() * amenities.length)];
    
    // Add various property types with different features
    properties.push({
      id: `mock_${city}_${i}`,
      title: `${type} Apartment for Rent in ${locality}`,
      price: price,
      location: `${locality}, ${city}`,
      area: area,
      bedrooms: type.includes('BHK') ? type.charAt(0) : '1',
      bathrooms: type.includes('3 BHK') ? '2' : '1',
      link: '#',
      imageUrl: defaultPropertyImage(type, true),
      source: Math.random() > 0.5 ? 'MagicBricks' : '99Acres',
      listedOn: new Date().toISOString(),
      amenities: propertyAmenities,
      description: `Beautiful ${type} apartment located in ${locality}, ${city} with all modern amenities.`
    });
  }
  
  return properties;
}

// Generate mock localities based on city
function generateMockLocalities(city) {
  const cityLocalities = {
    'mumbai': ['Andheri', 'Bandra', 'Powai', 'Worli', 'Juhu', 'Malad', 'Borivali', 'Dadar', 'Chembur', 'Santa Cruz'],
    'delhi': ['Connaught Place', 'Karol Bagh', 'Dwarka', 'Rohini', 'South Extension', 'Vasant Kunj', 'Mayur Vihar', 'Pitampura'],
    'bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'HSR Layout', 'Marathahalli', 'Jayanagar', 'JP Nagar'],
    'pune': ['Koregaon Park', 'Viman Nagar', 'Kharadi', 'Hinjewadi', 'Baner', 'Aundh', 'Wakad', 'Pimpri Chinchwad'],
    'hyderabad': ['Hitech City', 'Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kukatpally', 'Kondapur', 'Secunderabad'],
    'chennai': ['Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery', 'Porur', 'Mylapore', 'Nungambakkam', 'OMR'],
    'kolkata': ['Park Street', 'Salt Lake', 'New Town', 'Ballygunge', 'Behala', 'Alipore', 'Gariahat', 'Jadavpur'],
    'ahmedabad': ['Navrangpura', 'Satellite', 'Bodakdev', 'Prahlad Nagar', 'CG Road', 'SG Highway', 'Thaltej', 'Vastrapur'],
    'jaipur': ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Jagatpura', 'C-Scheme', 'Jhotwara', 'Raja Park', 'Tonk Road'],
    'lucknow': ['Gomti Nagar', 'Hazratganj', 'Indira Nagar', 'Aliganj', 'Mahanagar', 'Vikas Nagar', 'Janakipuram', 'Alambagh']
  };
  
  const normalizedCity = city.toLowerCase();
  
  // Return localities for the city if available, or generic ones if not
  if (cityLocalities[normalizedCity]) {
    return cityLocalities[normalizedCity];
  }
  
  // Find closest match or use default
  const matchedCity = findClosestCityMatch(normalizedCity);
  
  if (matchedCity && cityLocalities[matchedCity.toLowerCase()]) {
    return cityLocalities[matchedCity.toLowerCase()];
  }
  
  // Generate generic localities
  return [
    'Central Area', 'North Extension', 'South Colony', 'East Village', 'West Park',
    'Model Town', 'Civil Lines', 'Main Road', 'Station Road', 'Lake View',
    'Gandhi Nagar', 'Shastri Nagar', 'Patel Nagar', 'Nehru Place', 'University Road'
  ];
}

// Generate random price based on property type
function generateRandomPrice(type) {
  let basePrice;
  
  switch (type) {
    case '1 RK':
      basePrice = 5000 + Math.floor(Math.random() * 3000);
      return `₹${basePrice} /month`;
    case 'Single Room':
      basePrice = 3000 + Math.floor(Math.random() * 2000);
      return `₹${basePrice} /month`;
    case '1 BHK':
      basePrice = 8000 + Math.floor(Math.random() * 5000);
      return `₹${basePrice} /month`;
    case '2 BHK':
      basePrice = 12000 + Math.floor(Math.random() * 8000);
      return `₹${basePrice} /month`;
    case '3 BHK':
      basePrice = 18000 + Math.floor(Math.random() * 12000);
      return `₹${basePrice} /month`;
    default:
      basePrice = 10000 + Math.floor(Math.random() * 5000);
      return `₹${basePrice} /month`;
  }
}

// Generate random area based on property type
function generateRandomArea(type) {
  let baseArea;
  
  switch (type) {
    case '1 RK':
      baseArea = 250 + Math.floor(Math.random() * 100);
      break;
    case 'Single Room':
      baseArea = 150 + Math.floor(Math.random() * 100);
      break;
    case '1 BHK':
      baseArea = 450 + Math.floor(Math.random() * 150);
      break;
    case '2 BHK':
      baseArea = 650 + Math.floor(Math.random() * 200);
      break;
    case '3 BHK':
      baseArea = 950 + Math.floor(Math.random() * 300);
      break;
    default:
      baseArea = 500 + Math.floor(Math.random() * 200);
  }
  
  return `${baseArea} sq.ft.`;
}

// Helper functions for UI states
function showLoadingState() {
  // Find or create loading element
  let loadingEl = document.getElementById('properties-loading');
  
  if (!loadingEl) {
    loadingEl = document.createElement('div');
    loadingEl.id = 'properties-loading';
    loadingEl.className = 'loading-spinner';
    loadingEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading properties...';
    document.body.appendChild(loadingEl);
  }
  
  loadingEl.style.display = 'flex';
}

function hideLoadingState() {
  const loadingEl = document.getElementById('properties-loading');
  if (loadingEl) {
    loadingEl.style.display = 'none';
  }
}

function showError(message) {
  // Find or create error element
  let errorEl = document.getElementById('properties-error');
  
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.id = 'properties-error';
    errorEl.className = 'error-message';
    document.body.appendChild(errorEl);
  }
  
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorEl.style.display = 'none';
  }, 5000);
}

// Initialize property search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners to search forms if they exist
  const propertySearchForm = document.getElementById('property-search-form');
  if (propertySearchForm) {
    propertySearchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const city = document.getElementById('city-input').value || 'mumbai';
      const type = document.getElementById('property-type').value || 'rent';
      const source = document.getElementById('property-source').value || 'magicbricks';
      
      if (source === 'all') {
        fetchAllProperties(city);
      } else if (source === 'magicbricks') {
        fetchMagicBricksProperties(city, type);
      } else if (source === '99acres') {
        fetch99AcresProperties(city, type);
      }
    });
  }
  
  // Add CSS for property cards
  addPropertyCardStyles();
});

// Add CSS styles for property cards
function addPropertyCardStyles() {
  // Check if styles already exist
  if (document.getElementById('property-card-styles')) {
    return;
  }
  
  const styleEl = document.createElement('style');
  styleEl.id = 'property-card-styles';
  styleEl.innerHTML = `
    .property-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }
    
    .property-card {
      width: 300px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      background: white;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .property-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }
    
    .property-image {
      height: 200px;
      width: 100%;
      position: relative;
      overflow: hidden;
    }
    
    .property-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .property-card:hover .property-image img {
      transform: scale(1.05);
    }
    
    .property-source {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #4254b3;
      color: white;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
    }
    
    .property-details {
      padding: 15px;
    }
    
    .property-title {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 18px;
      color: #333;
      height: 48px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .property-price {
      font-size: 20px;
      font-weight: bold;
      color: #4254b3;
      margin-bottom: 8px;
    }
    
    .property-location, .property-area {
      color: #666;
      margin: 5px 0;
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    
    .property-location i, .property-area i {
      color: #4254b3;
      margin-right: 5px;
    }
    
    .view-property-btn {
      display: block;
      width: 100%;
      background-color: #4254b3;
      color: white;
      text-align: center;
      padding: 10px 0;
      border-radius: 4px;
      text-decoration: none;
      margin-top: 15px;
      transition: background-color 0.3s ease;
    }
    
    .view-property-btn:hover {
      background-color: #36408f;
    }
    
    .loading-spinner {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
    }
    
    .loading-spinner i {
      margin-right: 10px;
      color: #4254b3;
    }
    
    .error-message {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff3366;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 1000;
      display: none;
    }
    
    .no-properties {
      text-align: center;
      padding: 40px;
      color: #666;
      font-size: 18px;
    }
  `;
  
  document.head.appendChild(styleEl);
} 