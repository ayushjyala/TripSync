// API Configuration (User can replace with their keys)
const API_CONFIG = {
    WEATHER_KEY: 'fe4efc0b43ca039d694be5ce0d03790e', // OpenWeather API
    UNSPLASH_KEY: 'v90K6X5Py76J6XNagc23BzA2omfrk7yBc_dsKMfGE2c'    // Unsplash API
};

const API = {
    // 1. Live Weather Integration
    async fetchWeather(lat, lon) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_CONFIG.WEATHER_KEY}`;
            
            if (API_CONFIG.WEATHER_KEY === 'YOUR_FREE_WEATHER_KEY') {
                return {
                    temp: 22,
                    condition: 'Sunny',
                    icon: '01d',
                    description: 'Clear sky'
                };
            }

            const response = await fetch(url);
            const data = await response.json();
            return {
                temp: Math.round(data.main.temp),
                condition: data.weather[0].main,
                icon: data.weather[0].icon,
                description: data.weather[0].description
            };
        } catch (error) {
            console.error("Weather Fetch Error:", error);
            return null;
        }
    },

    // 2. Unsplash Image Gallery
    async fetchPlaceImages(query) {
        try {
            if (API_CONFIG.UNSPLASH_KEY === 'YOUR_UNSPLASH_KEY') {
                return [
                    `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80`,
                    `https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80`,
                    `https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&q=80`,
                    `https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&q=80`
                ];
            }

            const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=6&client_id=${API_CONFIG.UNSPLASH_KEY}`);
            const data = await response.json();
            return data.results.map(img => img.urls.regular);
        } catch (error) {
            console.error("Unsplash Fetch Error:", error);
            return [];
        }
    },

    // 3. Autocomplete logic (Using Nominatim API for real-world destinations)
    async getSuggestions(query) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
            const data = await response.json();
            
            return data.map(item => ({
                id: item.place_id,
                name: item.display_name.split(',')[0],
                country: item.address.country || 'Unknown',
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
                description: item.display_name,
                tips: ["Explore the local culture.", "Try the street food.", "Visit the nearest landmark."],
                avgDailyCost: 3000 // Default estimate in INR
            }));
        } catch (error) {
            console.error("Geocoding Error:", error);
            // Fallback to local data
            return destinations.filter(dest => 
                dest.name.toLowerCase().includes(query.toLowerCase()) || 
                dest.country.toLowerCase().includes(query.toLowerCase())
            );
        }
    },

    // 4. Overpass API for Nearby Places (Restaurants, Hotels, Attractions)
    async fetchNearbyPlaces(lat, lon, type) {
        let amenity = '';
        if (type === 'restaurants') amenity = 'restaurant';
        else if (type === 'hotels') amenity = 'hotel|hostel|guest_house|motel';
        else if (type === 'destinations') amenity = 'tourism|attraction|museum|viewpoint';

        const radius = 5000; // 5km
        const query = `
            [out:json];
            (
              node["amenity"~"${amenity}"](around:${radius},${lat},${lon});
              way["amenity"~"${amenity}"](around:${radius},${lat},${lon});
              node["tourism"~"${amenity}"](around:${radius},${lat},${lon});
              way["tourism"~"${amenity}"](around:${radius},${lat},${lon});
            );
            out center;
        `;
        
        try {
            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            return data.elements.map(el => {
                const tags = el.tags || {};
                // Mock prices in INR since Overpass doesn't provide them
                let price = 0;
                if (type === 'restaurants') price = Math.floor(Math.random() * 1500) + 300;
                else if (type === 'hotels') price = Math.floor(Math.random() * 8000) + 1500;
                else price = Math.floor(Math.random() * 1000) + 100;

                return {
                    name: tags.name || 'Unnamed Place',
                    type: tags.amenity || tags.tourism || 'Point of Interest',
                    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
                    price: price,
                    cuisine: tags.cuisine || 'Local',
                    distance: this.calculateDistance(lat, lon, el.lat || el.center.lat, el.lon || el.center.lon).toFixed(1),
                    lat: el.lat || el.center.lat,
                    lon: el.lon || el.center.lon
                };
            }).filter(p => p.name !== 'Unnamed Place').slice(0, 10);
        } catch (error) {
            console.error(`Overpass API Error (${type}):`, error);
            return [];
        }
    },

    // Distance helper
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
};
