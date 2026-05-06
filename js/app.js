// State Management
let appState = {
    currentDestination: null,
    budgetLevel: 'medium', // low, medium, high
    duration: 3,
    activeTab: 'itinerary',
    isDarkMode: localStorage.getItem('theme') === 'dark',
    savedTrips: JSON.parse(localStorage.getItem('savedTrips') || '[]'),
    user: JSON.parse(localStorage.getItem('user') || 'null')
};

// Initialize Lucide Icons
lucide.createIcons();

// Elements
const destinationInput = document.getElementById('destinationInput');
const autocompleteList = document.getElementById('autocompleteList');
const searchBtn = document.getElementById('searchBtn');
const appContent = document.getElementById('appContent');
const emptyState = document.getElementById('emptyState');
const tabView = document.getElementById('tabContent');
const durationSlider = document.getElementById('durationSlider');
const durationVal = document.getElementById('durationVal');
const themeToggle = document.getElementById('themeToggle');
const authContainer = document.getElementById('authContainer');
const authForm = document.getElementById('authForm');

// 1. Theme Logic
function initTheme() {
    if (appState.isDarkMode) {
        document.documentElement.classList.add('dark');
        document.getElementById('sunIcon').classList.remove('hidden');
        document.getElementById('moonIcon').classList.add('hidden');
    }
}

themeToggle.addEventListener('click', () => {
    appState.isDarkMode = !appState.isDarkMode;
    document.documentElement.classList.toggle('dark');
    document.getElementById('sunIcon').classList.toggle('hidden');
    document.getElementById('moonIcon').classList.toggle('hidden');
    localStorage.setItem('theme', appState.isDarkMode ? 'dark' : 'light');
});

// 2. Autocomplete Search
let lastSuggestions = [];
destinationInput.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length < 2) {
        autocompleteList.classList.add('hidden');
        return;
    }

    const suggestions = await API.getSuggestions(query);
    lastSuggestions = suggestions;
    
    if (suggestions.length > 0) {
        autocompleteList.innerHTML = suggestions.map((s, index) => `
            <div class="px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3 transition-colors suggestion-item" 
                 data-index="${index}">
                <i data-lucide="map-pin" class="w-4 h-4 text-slate-400"></i>
                <div>
                    <p class="font-semibold">${s.name}</p>
                    <p class="text-xs text-slate-500">${s.country}</p>
                </div>
            </div>
        `).join('');
        autocompleteList.classList.remove('hidden');
        lucide.createIcons();
        
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = item.getAttribute('data-index');
                selectDestination(lastSuggestions[idx]);
            });
        });
    } else {
        autocompleteList.classList.add('hidden');
    }
});

searchBtn.addEventListener('click', async () => {
    const query = destinationInput.value;
    if (!query) return;
    
    // First check local data
    const localMatch = destinations.find(d => d.name.toLowerCase() === query.toLowerCase());
    if (localMatch) {
        selectDestination(localMatch);
        return;
    }

    // Otherwise fetch from API
    const suggestions = await API.getSuggestions(query);
    if (suggestions.length > 0) {
        selectDestination(suggestions[0]);
    }
});

// 3. Selection Logic
async function selectDestination(dest) {
    if (!dest) return;

    appState.currentDestination = dest;
    destinationInput.value = dest.name;
    autocompleteList.classList.add('hidden');
    
    // UI Transitions
    emptyState.classList.add('hidden');
    appContent.classList.remove('hidden');
    
    // Scroll to top of content
    appContent.scrollIntoView({ behavior: 'smooth' });

    updateUI();
    renderMap(dest.lat, dest.lon);
    fetchAndRenderWeather(dest.lat, dest.lon);
}

// Global mockup for easy search from empty state
window.simulateSearch = async (name) => {
    const suggestions = await API.getSuggestions(name);
    if (suggestions && suggestions.length > 0) {
        selectDestination(suggestions[0]);
    } else {
        const dest = destinations.find(d => d.name.toLowerCase() === name.toLowerCase());
        if (dest) selectDestination(dest);
    }
};

// 4. UI Rendering Engine
function updateUI() {
    if (!appState.currentDestination) return;

    // Header
    document.getElementById('currentDestTitle').textContent = `${appState.currentDestination.name}, ${appState.currentDestination.country}`;

    // Tips
    document.getElementById('travelTips').innerHTML = appState.currentDestination.tips
        .map(tip => `<li>• ${tip}</li>`).join('');

    renderTabs();
    renderSummary();
    renderNearby();
    renderSavedTrips();
}

// Helper: format numbers to INR currency with commas
function formatINR(amount) {
    try {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    } catch (e) {
        return `₹${amount}`;
    }
}

// 5. Tab Management
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active', 'border-primary', 'text-primary');
            b.classList.add('border-transparent');
        });
        btn.classList.add('active', 'border-primary', 'text-primary');
        btn.classList.remove('border-transparent');
        appState.activeTab = btn.getAttribute('data-tab');
        renderTabs();
    });
});

function renderTabs() {
    const destId = appState.currentDestination.id;

    switch (appState.activeTab) {
        case 'itinerary':
            renderItinerary(destId);
            break;
        case 'hotels':
            renderHotels(destId);
            break;
        case 'food':
            renderRestaurants(destId);
            break;
        case 'transport':
            renderTransport();
            break;
        case 'gallery':
            renderGallery();
            break;
    }
}

// --- Specific Renderers ---

// Itinerary Renderer (Using Map)
function renderItinerary(destId) {
    const data = itineraryData[destId] || [];
    // Smart Slider Logic: Generate day-wise plan based on appState.duration
    // If we have 3 days of data but user wants 5, we repeat or shuffle
    let plan = [];
    for (let i = 0; i < appState.duration; i++) {
        const template = data[i % data.length];
        plan.push({...template, day: i + 1 });
    }

    tabView.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-xl font-bold">Smart Itinerary (${appState.duration} Days)</h3>
                <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">Optimized for ${appState.budgetLevel} budget</span>
            </div>
            ${plan.map(item => `
                <div class="glass p-6 rounded-2xl flex gap-6 hover:shadow-md transition-all border-l-4 border-primary">
                    <div class="flex-shrink-0 flex flex-col items-center">
                        <span class="text-xs font-bold text-slate-400 uppercase">Day</span>
                        <span class="text-3xl font-black text-primary">${item.day}</span>
                    </div>
                    <div>
                        <h4 class="text-xl font-bold mb-2">${item.title}</h4>
                        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">${item.activity}</p>
                        <div class="mt-4 flex gap-3">
                            <span class="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded flex items-center gap-1">
                                <i data-lucide="clock" class="w-3 h-3"></i> 09:00 AM
                            </span>
                            <span class="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded flex items-center gap-1">
                                <i data-lucide="map-pin" class="w-3 h-3"></i> Top Spot
                            </span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    lucide.createIcons();
}

// Hotel Renderer (Using Filter & Sort)
async function renderHotels(destId) {
    tabView.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="hotelsGrid">
            ${Array(4).fill().map(() => `
                <div class="glass rounded-2xl overflow-hidden animate-pulse">
                    <div class="h-40 bg-slate-200 dark:bg-slate-800"></div>
                    <div class="p-5 space-y-3">
                        <div class="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                        <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                        <div class="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const lat = appState.currentDestination.lat;
    const lon = appState.currentDestination.lon;
    
    let apiHotels = await API.fetchNearbyPlaces(lat, lon, 'hotels');
    
    // If API returns nothing, fallback to local data
    if (!apiHotels || apiHotels.length === 0) {
        apiHotels = hotels.filter(h => h.destination === destId);
    }
    
    let filteredHotels = apiHotels;
    
    // Budget Filter (values in INR)
    if (appState.budgetLevel === 'low') filteredHotels = filteredHotels.filter(h => h.price < 3000);
    else if (appState.budgetLevel === 'medium') filteredHotels = filteredHotels.filter(h => h.price >= 3000 && h.price < 10000);
    else filteredHotels = filteredHotels.filter(h => h.price >= 10000);

    // Sort Logic
    const sortBy = document.getElementById('sortOption').value;
    if (sortBy === 'rating') filteredHotels.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'price-low') filteredHotels.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filteredHotels.sort((a, b) => b.price - a.price);

    tabView.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${filteredHotels.length ? filteredHotels.map(h => `
                <div class="glass rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div class="h-40 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                        <img src="https://source.unsplash.com/featured/?hotel,resort,${h.name.split(' ')[0]}" class="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500">
                        <div class="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-accent">
                            <i data-lucide="star" class="w-3 h-3 fill-accent"></i> ${h.rating}
                        </div>
                    </div>
                    <div class="p-5">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-bold text-lg line-clamp-1">${h.name}</h4>
                            <span class="text-primary font-black text-xl whitespace-nowrap">${formatINR(h.price)}<span class="text-[10px] text-slate-400 font-normal">/night</span></span>
                        </div>
                        <p class="text-xs text-slate-500 mb-4 flex items-center gap-1">
                            <i data-lucide="navigation" class="w-3 h-3"></i> ${h.distance} km from center • ${h.type}
                        </p>
                        <button class="w-full py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold hover:opacity-90 transition-all">Book Now</button>
                    </div>
                </div>
            `).join('') : '<p class="col-span-2 text-center py-20 text-slate-400">No hotels found in this budget. Try changing filters!</p>'}
        </div>
    `;
    lucide.createIcons();
}

// Restaurant Renderer
async function renderRestaurants(destId) {
    tabView.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${Array(4).fill().map(() => `
                <div class="glass p-5 rounded-2xl flex items-center gap-4 animate-pulse">
                    <div class="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                        <div class="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                        <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const lat = appState.currentDestination.lat;
    const lon = appState.currentDestination.lon;
    
    let apiRestaurants = await API.fetchNearbyPlaces(lat, lon, 'restaurants');
    
    if (!apiRestaurants || apiRestaurants.length === 0) {
        apiRestaurants = restaurants.filter(r => r.destination === destId);
    }
    
    tabView.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${apiRestaurants.map(r => `
                <div class="glass p-5 rounded-2xl flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                    <div class="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                        <img src="https://source.unsplash.com/featured/?food,${r.cuisine},restaurant" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                    </div>
                    <div class="flex-1">
                        <h4 class="font-bold line-clamp-1">${r.name}</h4>
                        <p class="text-[10px] text-slate-500 uppercase font-bold">${r.cuisine} • ${r.type}</p>
                        <div class="mt-2 flex items-center justify-between">
                            <span class="text-accent font-bold text-xs flex items-center gap-1"><i data-lucide="star" class="w-3 h-3"></i> ${r.rating}</span>
                            <span class="text-primary font-black">${formatINR(r.price)}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    lucide.createIcons();
}

// Transport Renderer
function renderTransport() {
    tabView.innerHTML = `
        <div class="space-y-4">
            ${transportOptions.map(t => `
                <div class="glass p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-primary transition-all">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <i data-lucide="${t.icon}"></i>
                        </div>
                        <div>
                            <h4 class="font-bold">${t.type}</h4>
                            <p class="text-xs text-slate-500">Available across ${appState.currentDestination.name}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-bold text-primary">${formatINR(t.pricePerDay)}</p>
                        <p class="text-[10px] text-slate-400">PER DAY ESTIMATE</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    lucide.createIcons();
}

// Gallery Renderer
async function renderGallery() {
    tabView.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 gap-4" id="galleryGrid">
        ${Array(6).fill().map(() => `<div class="animate-pulse bg-slate-200 dark:bg-slate-800 h-48 rounded-2xl"></div>`).join('')}
    </div>`;
    
    const photos = await API.fetchPlaceImages(appState.currentDestination.name);
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = photos.map(url => `
        <div class="h-48 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform duration-300">
            <img src="${url}" class="w-full h-full object-cover">
        </div>
    `).join('');
}

// 6. Summary Logic (Using Reduce)
function renderSummary() {
    const dailyDestCost = appState.currentDestination.avgDailyCost;
    // Estimated costs in INR per day (approximate)
    const hotelCost = appState.budgetLevel === 'low' ? 2000 : appState.budgetLevel === 'medium' ? 5000 : 15000;
    const foodCost = appState.budgetLevel === 'low' ? 300 : appState.budgetLevel === 'medium' ? 800 : 2000;
    
    const breakdown = [
        { label: 'Lodging', cost: hotelCost * appState.duration },
        { label: 'Food & Dining', cost: foodCost * appState.duration },
        { label: 'Activities', cost: dailyDestCost * appState.duration },
        { label: 'Misc', cost: 50 }
    ];

    const totalCost = breakdown.reduce((sum, item) => sum + item.cost, 0);

    const summaryEl = document.getElementById('tripSummary');
    summaryEl.innerHTML = `
        <div class="space-y-3">
            <div class="flex justify-between items-center text-2xl font-black text-primary">
                <span>Total Est.</span>
                <span>${formatINR(totalCost)}</span>
            </div>
            <div class="h-[1px] bg-slate-200 dark:bg-slate-800 my-2"></div>
            ${breakdown.map(b => `
                <div class="flex justify-between text-xs font-medium">
                    <span class="text-slate-500 uppercase">${b.label}</span>
                    <span>${formatINR(b.cost)}</span>
                </div>
            `).join('')}
            <div class="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                <p class="text-[10px] text-slate-400 mb-1">TRIP STATS</p>
                <div class="flex justify-around text-center">
                    <div><p class="font-bold">${appState.duration}</p><p class="text-[9px] uppercase">Days</p></div>
                    <div><p class="font-bold">4.8</p><p class="text-[9px] uppercase">Rating</p></div>
                    <div><p class="font-bold">Safe</p><p class="text-[9px] uppercase">Vibe</p></div>
                </div>
            </div>
        </div>
    `;
}

// 7. Weather Integration
async function fetchAndRenderWeather(lat, lon) {
    const weather = await API.fetchWeather(lat, lon);
    const weatherEl = document.getElementById('weatherDisplay');
    
    if (weather) {
        weatherEl.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-4xl font-bold">${weather.temp}°C</p>
                    <p class="text-sm font-semibold capitalize">${weather.description}</p>
                </div>
                <img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" class="w-16 h-16">
            </div>
            <div class="grid grid-cols-5 gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => `
                    <div class="text-center">
                        <p class="text-[10px] text-slate-500">${day}</p>
                        <i data-lucide="cloud" class="w-3 h-3 mx-auto my-1 text-slate-400"></i>
                        <p class="text-xs font-bold">${weather.temp - 2}°</p>
                    </div>
                `).join('')}
            </div>
        `;
        lucide.createIcons();
    }
}

// 8. Map Integration (Leaflet)
let map;
function renderMap(lat, lon) {
    if (map) map.remove();
    map = L.map('map').setView([lat, lon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([lat, lon]).addTo(map).bindPopup(appState.currentDestination.name).openPopup();
}

// 9. Nearby Places (Live Attractions)
async function renderNearby() {
    const hitsEl = document.getElementById('nearbyHits');
    hitsEl.innerHTML = Array(3).fill().map(() => `
        <div class="flex items-center gap-3 animate-pulse">
            <div class="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
            <div class="flex-1 space-y-2">
                <div class="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div class="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
            </div>
        </div>
    `).join('');

    const lat = appState.currentDestination.lat;
    const lon = appState.currentDestination.lon;
    
    let nearby = await API.fetchNearbyPlaces(lat, lon, 'destinations');
    
    if (!nearby || nearby.length === 0) {
        nearby = [
            { name: "City Center", distance: "0.5", type: "map-pin" },
            { name: "Museum District", distance: "1.2", type: "palmtree" },
            { name: "Central Station", distance: "2.5", type: "train" }
        ];
    }

    hitsEl.innerHTML = nearby.map(n => `
        <div class="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 p-1 rounded-lg transition-all">
            <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center flex-shrink-0">
                <i data-lucide="map-pin" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 border-b border-slate-100 dark:border-slate-800 pb-2 flex justify-between items-center">
                <span class="font-medium text-[13px] group-hover:text-indigo-500 transition-colors line-clamp-1">${n.name}</span>
                <span class="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full whitespace-nowrap">${n.distance}km</span>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

// 10. Save Trips (LocalStorage)
document.getElementById('saveTripBtn').addEventListener('click', () => {
    const trip = {
        id: Date.now(),
        destination: appState.currentDestination.name,
        duration: appState.duration,
        date: new Date().toLocaleDateString()
    };
    appState.savedTrips.unshift(trip);
    localStorage.setItem('savedTrips', JSON.stringify(appState.savedTrips));
    renderSavedTrips();
    alert('Trip bookmarked securely!');
});

function renderSavedTrips() {
    const container = document.getElementById('savedTrips');
    if (appState.savedTrips.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-500 italic">No saved trips yet.</p>';
        return;
    }
    container.innerHTML = appState.savedTrips.slice(0, 3).map(t => `
        <div class="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl flex justify-between items-center group">
            <div>
                <p class="font-bold text-xs">${t.destination}</p>
                <p class="text-[10px] text-slate-500">${t.duration} Days • ${t.date}</p>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-300 group-hover:text-primary transition-all"></i>
        </div>
    `).join('');
    lucide.createIcons();
}

// 11. PDF Export
document.getElementById('downloadPdfBtn').addEventListener('click', () => {
    const element = document.getElementById('appContent');
    const opt = {
        margin: 1,
        filename: `TravexaNova_${appState.currentDestination.name}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
});

// 12. Listeners for Filters
durationSlider.addEventListener('input', (e) => {
    appState.duration = e.target.value;
    durationVal.textContent = `${appState.duration} Days`;
    updateUI();
});

document.querySelectorAll('.budget-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.budget-btn').forEach(b => b.classList.remove('bg-primary', 'text-white', 'border-primary'));
        btn.classList.add('bg-primary', 'text-white', 'border-primary');
        appState.budgetLevel = btn.getAttribute('data-budget');
        updateUI();
    });
});

document.getElementById('sortOption').addEventListener('change', updateUI);

const compareModal = document.getElementById('compareModal');
const openCompareBtn = document.getElementById('openCompareBtn');
const closeCompare = document.getElementById('closeCompare');
const compareGrid = document.getElementById('compareGrid');

openCompareBtn.addEventListener('click', () => {
    renderCompare();
    compareModal.classList.remove('hidden');
});

closeCompare.addEventListener('click', () => compareModal.classList.add('hidden'));

function renderCompare() {
    const current = appState.currentDestination;
    const others = destinations.filter(d => d.id !== (current ? current.id : ''));
    
    // Choose the first 'other' for comparison
    const target = others[0];
    
    if (!current) {
        compareGrid.innerHTML = '<p class="text-center col-span-2 py-10">Select a destination first to compare it with others!</p>';
        return;
    }

    const destinationsToCompare = [current, target];

    compareGrid.innerHTML = destinationsToCompare.map(d => `
        <div class="glass p-6 rounded-2xl space-y-4">
            <div class="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden relative">
                <img src="https://source.unsplash.com/featured/?${d.name},travel" class="w-full h-full object-cover">
                <div class="absolute bottom-4 left-4">
                    <h3 class="text-2xl font-black text-white drop-shadow-lg">${d.name}</h3>
                    <p class="text-xs text-white/80 drop-shadow-md">${d.country}</p>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <span class="text-xs font-bold text-slate-400 uppercase">Daily Budget</span>
                        <span class="text-primary font-black">${formatINR(d.avgDailyCost)}</span>
                </div>
                <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <span class="text-xs font-bold text-slate-400 uppercase">Weather Vibe</span>
                    <span class="font-bold">Mild & Sunny</span>
                </div>
                <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <span class="text-xs font-bold text-slate-400 uppercase">Travel Time</span>
                    <span class="font-bold">May - Oct</span>
                </div>
                <div class="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                    <p class="text-xs font-bold text-primary uppercase mb-2">Key Highlights</p>
                    <p class="text-xs line-clamp-3">${d.description}</p>
                </div>
            </div>
            
            <button onclick="const match = destinations.find(x => x.id === '${d.id}'); if(match) selectDestination(match); else selectDestination(appState.currentDestination); document.getElementById('compareModal').classList.add('hidden')" class="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all">
                Choose This Trip
            </button>
        </div>
    `).join('');
    lucide.createIcons();
}

// 12. Navbar & Additional Modals
const navMyTrips = document.getElementById('navMyTrips');
const navAbout = document.getElementById('navAbout');
const signUpBtn = document.getElementById('signUpBtn');
const authModal = document.getElementById('authModal');
const aboutModal = document.getElementById('aboutModal');
const closeAuth = document.getElementById('closeAuth');
const closeAbout = document.getElementById('closeAbout');

navMyTrips.addEventListener('click', () => {
    // If a destination is already selected, it shows the saved trips in the sidebar.
    // For a better UX, we can scroll to the saved trips section.
    document.getElementById('savedTrips').scrollIntoView({ behavior: 'smooth' });
});

navAbout.addEventListener('click', () => {
    aboutModal.classList.remove('hidden');
});

signUpBtn.addEventListener('click', () => {
    authModal.classList.remove('hidden');
});

closeAuth.addEventListener('click', () => authModal.classList.add('hidden'));
closeAbout.addEventListener('click', () => aboutModal.classList.add('hidden'));

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.classList.add('hidden');
    if (e.target === aboutModal) aboutModal.classList.add('hidden');
    if (e.target === compareModal) compareModal.classList.add('hidden');
});

// 13. Authentication Logic
function toggleAuthUI() {
    if (appState.user) {
        authContainer.innerHTML = `
            <button id="themeToggle" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <i data-lucide="sun" id="sunIcon" class="${!appState.isDarkMode ? 'hidden' : ''}"></i>
                <i data-lucide="moon" id="moonIcon" class="${appState.isDarkMode ? 'hidden' : ''}"></i>
            </button>
            <div class="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 py-1 pl-1 pr-4 rounded-full border border-slate-200 dark:border-slate-700">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                    ${appState.user.name.charAt(0).toUpperCase()}
                </div>
                <span class="text-xs font-bold hidden sm:block">${appState.user.name.split(' ')[0]}</span>
                <button id="logoutBtn" class="text-slate-400 hover:text-red-500 transition-colors ml-2">
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        
        // Re-attach theme toggle listener since we replaced the HTML
        document.getElementById('themeToggle').addEventListener('click', () => {
            appState.isDarkMode = !appState.isDarkMode;
            document.documentElement.classList.toggle('dark');
            document.getElementById('sunIcon').classList.toggle('hidden');
            document.getElementById('moonIcon').classList.toggle('hidden');
            localStorage.setItem('theme', appState.isDarkMode ? 'dark' : 'light');
        });

        document.getElementById('logoutBtn').addEventListener('click', logout);
    } else {
        authContainer.innerHTML = `
            <button id="themeToggle" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <i data-lucide="sun" id="sunIcon" class="${!appState.isDarkMode ? 'hidden' : ''}"></i>
                <i data-lucide="moon" id="moonIcon" class="${appState.isDarkMode ? 'hidden' : ''}"></i>
            </button>
            <button id="signUpBtn" class="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-emerald-600 transition-all shadow-lg shadow-primary/20">
                Sign Up
            </button>
        `;

        document.getElementById('themeToggle').addEventListener('click', () => {
            appState.isDarkMode = !appState.isDarkMode;
            document.documentElement.classList.toggle('dark');
            document.getElementById('sunIcon').classList.toggle('hidden');
            document.getElementById('moonIcon').classList.toggle('hidden');
            localStorage.setItem('theme', appState.isDarkMode ? 'dark' : 'light');
        });

        document.getElementById('signUpBtn').addEventListener('click', () => {
            authModal.classList.remove('hidden');
        });
    }
    lucide.createIcons();
}

function handleSignUp(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    
    if (name && email) {
        appState.user = { name, email };
        localStorage.setItem('user', JSON.stringify(appState.user));
        authModal.classList.add('hidden');
        toggleAuthUI();
        alert(`Welcome abroad, ${name}! Your TravexaNova account is ready.`);
    }
}

function logout() {
    appState.user = null;
    localStorage.removeItem('user');
    toggleAuthUI();
}

authForm.addEventListener('submit', handleSignUp);

// Init
initTheme();
toggleAuthUI();