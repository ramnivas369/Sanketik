// Check if user is logged in and update header
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('roomForUCurrentUser') || '{}');
    const loginLogoutBtn = document.getElementById('loginLogoutBtn');
    
    if (currentUser && currentUser.name) {
        // User is logged in, show welcome message
        loginLogoutBtn.innerHTML = `
            <div class="login-btn" style="position: relative;">
                <span class="user"><b>Welcome, ${currentUser.name}</b></span>
                <div class="user-dropdown" style="display: none; position: absolute; background-color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border-radius: 5px; width: 150px; right: 0; top: 100%; z-index: 100;">
                    <a href="#" id="logoutLink" style="display: block; padding: 10px; text-decoration: none; color: #333;">Logout</a>
                </div>
            </div>
        `;
        
        // Show dropdown on hover
        const userBtn = loginLogoutBtn.querySelector('.login-btn');
        const dropdown = loginLogoutBtn.querySelector('.user-dropdown');
        
        userBtn.addEventListener('mouseenter', function() {
            dropdown.style.display = 'block';
        });
        
        userBtn.addEventListener('mouseleave', function() {
            dropdown.style.display = 'none';
        });
        
        // Logout functionality
        document.getElementById('logoutLink').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('roomForUCurrentUser');
            window.location.reload();
        });
    }
});

// Function to handle city search
function handleCitySearch() {
    const removeWhenSearch = document.querySelector('.remove-when-search').innerHTML = '';
    const searchQuery = document.getElementById('citySearch').value.trim();
    if(!searchQuery) {
        alert("Please enter a city name");
        return;
    }
    
    // Get search results container
    const resultsDiv = document.getElementById('searchResults');
    
    // Show loading indicator
    resultsDiv.style.display = 'block';
    document.getElementById('resultTitle').textContent = `Searching for properties in ${searchQuery}...`;
    
    // Show the loading state
    showLoadingState();
    
    // Fetch properties from multiple sources
    fetchAllProperties(searchQuery, false).then(allProperties => {
        hideLoadingState();
        
        if (allProperties.length === 0) {
            document.getElementById('resultTitle').textContent = `No properties found in ${searchQuery}`;
            return;
        }
        
        // Update city stats
        const singleRooms = allProperties.filter(p => p.title && (p.title.toLowerCase().includes('single') || p.title.toLowerCase().includes('1 room'))).length;
        const oneRK = allProperties.filter(p => p.title && p.title.toLowerCase().includes('1 rk')).length;
        const oneBHK = allProperties.filter(p => p.title && p.title.toLowerCase().includes('1 bhk')).length;
        const twoBHK = allProperties.filter(p => p.title && p.title.toLowerCase().includes('2 bhk')).length;
        const threeBHK = allProperties.filter(p => p.title && p.title.toLowerCase().includes('3 bhk')).length;
        
        // Get closest city match for proper display
        const cityName = findClosestCityMatch(searchQuery) || searchQuery;
        
        // Update UI elements
        document.getElementById('singleRooms').textContent = singleRooms || 0;
        document.getElementById('oneRK').textContent = oneRK || 0;
        document.getElementById('oneBHK').textContent = oneBHK || 0;
        document.getElementById('twoBHK').textContent = twoBHK || 0;
        document.getElementById('threeBHK').textContent = threeBHK || 0;
        document.getElementById('totalRooms').textContent = allProperties.length;
        document.getElementById('resultTitle').textContent = `Properties in ${cityName}`;
        
        // Extract and display localities
        const localities = [...new Set(allProperties
            .map(p => p.location)
            .filter(l => l && l.length > 2)
            .map(l => l.split(',')[0].trim()))];
            
        const localitiesDiv = document.getElementById('localities');
        localitiesDiv.innerHTML = '';
        
        // Create scrollable container for localities
        const scrollContainer = document.createElement('div');
        scrollContainer.style.display = 'flex';
        scrollContainer.style.overflowX = 'auto';
        scrollContainer.style.padding = '5px 0';
        scrollContainer.style.webkitOverflowScrolling = 'touch'; // Smooth scrolling on iOS
        scrollContainer.style.scrollbarWidth = 'thin';
        scrollContainer.style.msOverflowStyle = 'none';
        localitiesDiv.appendChild(scrollContainer);
        
        localities.slice(0, 15).forEach(locality => {
            const div = document.createElement('div');
            div.style.background = '#f5f5f5';
            div.style.padding = '10px 15px';
            div.style.borderRadius = '20px';
            div.style.margin = '5px 8px 5px 0';
            div.style.cursor = 'pointer';
            div.style.whiteSpace = 'nowrap';
            div.style.transition = 'all 0.3s ease';
            div.textContent = locality;
            
            // Highlight effect on hover
            div.addEventListener('mouseover', function() {
                div.style.background = '#4254b3';
                div.style.color = 'white';
            });
            
            div.addEventListener('mouseout', function() {
                div.style.background = '#f5f5f5';
                div.style.color = 'black';
            });
            
            div.addEventListener('click', function() {
                // Filter properties by locality when clicked
                const localityProperties = allProperties.filter(p => 
                    p.location && p.location.toLowerCase().includes(locality.toLowerCase())
                );
                
                // Highlight the selected locality
                document.querySelectorAll('#localities > div > div').forEach(el => {
                    el.style.background = '#f5f5f5';
                    el.style.color = 'black';
                });
                
                div.style.background = '#4254b3';
                div.style.color = 'white';
                
                renderProperties(localityProperties, 'property-container');
                document.getElementById('property-container').scrollIntoView({ behavior: 'smooth' });
            });
            
            scrollContainer.appendChild(div);
        });
        
        // Display some properties (limit to 8 for better view)
        renderProperties(allProperties.slice(0, 8), 'property-container');
    }).catch(error => {
        hideLoadingState();
        console.error('Error fetching properties:', error);
        document.getElementById('resultTitle').textContent = `Error finding properties in ${searchQuery}`;
    });
}

// Add event listener for Enter key in the search field
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('citySearch').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleCitySearch();
        }
    });
    
    // Add styles for property locality chips
    const style = document.createElement('style');
    style.textContent = `
        #localities::-webkit-scrollbar {
            height: 6px;
        }
        #localities::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        #localities::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        #localities::-webkit-scrollbar-thumb:hover {
            background: #4254b3;
        }
    `;
    document.head.appendChild(style);
});