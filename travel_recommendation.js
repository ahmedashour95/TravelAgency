// Fetch JSON data
// Function to load data from the local JSON file
async function fetchTravelData() {
  try {
    // 1. Fetch the JSON file from the local directory
    const response = await fetch('./travel_recommendation_api.json');

    // 2. Check if the HTTP request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 3. Parse the JSON response body
    const data = await response.json();

    // 4. Handle or render the fetched data
    console.log('Data loaded successfully:', data);
    return data;

  } catch (error) {
    console.error('Error fetching JSON data:', error);
  }
}

// Execute the function
//fetchTravelData();

// async function fetchTravelData() {
//   try {
//     const response = await fetch('./travel_recommendation_api.json');
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching travel data:', error);
//     return null;
//   }
// }

// Handle Search Logic
async function handleSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  const keyword = searchInput.value.toLowerCase().trim();

  if (!keyword) {
    clearResults();
    return;
  }

  const data = await fetchTravelData();
  if (!data) return;

  let matchedResults = [];

  // 1. Keyword check for Beaches
  if (keyword.includes('beach')) {
    matchedResults = data.beaches || [];
  } 
  // 2. Keyword check for Temples
  else if (keyword.includes('temple')) {
    matchedResults = data.temples || [];
  } 
  // 3. Search by Country name or specific City
  else {
    if (data.countries) {
      data.countries.forEach(country => {
        if (country.name.toLowerCase().includes(keyword)) {
          matchedResults.push(...country.cities);
        } else {
          const matchingCities = country.cities.filter(city => 
            city.name.toLowerCase().includes(keyword)
          );
          matchedResults.push(...matchingCities);
        }
      });
    }

    if (data.temples) {
      const matchingTemples = data.temples.filter(t => t.name.toLowerCase().includes(keyword));
      matchedResults.push(...matchingTemples);
    }

    if (data.beaches) {
      const matchingBeaches = data.beaches.filter(b => b.name.toLowerCase().includes(keyword));
      matchedResults.push(...matchingBeaches);
    }
  }

  displayResults(matchedResults);
}

// Render Results to Hero Area
function displayResults(results) {
  const heroText = document.getElementById('hero-text');
  const resultsArea = document.getElementById('results-area');

  if (!resultsArea) return;

  // Hide hero text box and show results container
  if (heroText) heroText.style.display = 'none';
  resultsArea.style.display = 'flex';
  resultsArea.innerHTML = '';

  const heading = document.createElement('h2');
  heading.className = 'results-heading';
  heading.textContent = 'Search Results';
  resultsArea.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'results-grid';

  if (results.length === 0) {
    grid.innerHTML = '<p style="color: #ffffff; font-size: 1.1rem;">No matching destinations found.</p>';
  } else {
    results.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop';">
        <div class="card-body">
          <h3 class="card-title">${item.name}</h3>
          <p class="card-text">${item.description}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  resultsArea.appendChild(grid);
}

// Clear Search and Restore Hero Text
function clearResults() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  const heroText = document.getElementById('hero-text');
  const resultsArea = document.getElementById('results-area');

  if (resultsArea) {
    resultsArea.innerHTML = '';
    resultsArea.style.display = 'none';
  }
  if (heroText) {
    heroText.style.display = 'block';
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('btn-search');
  const clearBtn = document.getElementById('btn-clear');
  const searchInput = document.getElementById('search-input');

  if (searchBtn) searchBtn.addEventListener('click', handleSearch);
  if (clearBtn) clearBtn.addEventListener('click', clearResults);
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }
});