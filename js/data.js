const destinations = [{
        id: "jaipur",
        name: "Jaipur",
        country: "India",
        description: "The Pink City, known for its historic palaces and vibrant culture.",
        lat: 26.9124,
        lon: 75.7873,
        tips: ["Visit Amer Fort early.", "Shop at Johari Bazaar.", "Try local Rajasthani thali."],
        avgDailyCost: 4000
    },
    {
        id: "manali",
        name: "Manali",
        country: "India",
        description: "A high-altitude Himalayan resort town in India's northern Himachal Pradesh state.",
        lat: 32.2432,
        lon: 77.1892,
        tips: ["Carry warm clothes.", "Visit Solang Valley.", "Try local trout fish."],
        avgDailyCost: 3500
    },
    {
        id: "goa",
        name: "Goa",
        country: "India",
        description: "Famous for its beaches, vibrant nightlife, and Portuguese heritage.",
        lat: 15.2993,
        lon: 74.1240,
        tips: ["Rent a scooter.", "Visit Dudhsagar Falls.", "Try Goan seafood."],
        avgDailyCost: 5000
    },
    {
        id: "kerala",
        name: "Munnar",
        country: "India",
        description: "A hill station in Kerala, famous for its lush tea estates and serene environment.",
        lat: 10.0889,
        lon: 77.0595,
        tips: ["Take a tea tasting tour.", "Visit Eravikulam National Park.", "Pack an umbrella."],
        avgDailyCost: 4500
    }
];

const hotels = [
    { name: "Rambagh Palace", destination: "jaipur", price: 25000, rating: 4.9, type: "luxury", distance: 3.2 },
    { name: "Heritage Inn", destination: "jaipur", price: 3000, rating: 4.2, type: "budget", distance: 1.5 },
    { name: "Pink City Hotel", destination: "jaipur", price: 6000, rating: 4.5, type: "mid-range", distance: 0.5 },
    { name: "Himalayan View", destination: "manali", price: 5000, rating: 4.6, type: "mid-range", distance: 2.0 },
    { name: "Snow Peak Hostel", destination: "manali", price: 1500, rating: 4.1, type: "budget", distance: 0.8 },
    { name: "Taj Exotica", destination: "goa", price: 20000, rating: 4.9, type: "luxury", distance: 5.0 },
    { name: "Beachside Shack", destination: "goa", price: 2500, rating: 4.3, type: "budget", distance: 0.2 },
    { name: "Tea County Resort", destination: "kerala", price: 8000, rating: 4.7, type: "luxury", distance: 1.5 },
    { name: "Backpacker's Nest", destination: "kerala", price: 1000, rating: 4.0, type: "budget", distance: 0.5 }
];

const restaurants = [
    { name: "Chokhi Dhani", destination: "jaipur", price: 1200, rating: 4.7, type: "veg", cuisine: "Rajasthani" },
    { name: "LMB", destination: "jaipur", price: 600, rating: 4.3, type: "veg", cuisine: "Indian Sweets" },
    { name: "Chopsticks", destination: "manali", price: 800, rating: 4.4, type: "non-veg", cuisine: "Chinese" },
    { name: "Local Thali", destination: "manali", price: 300, rating: 4.8, type: "veg", cuisine: "Indian" },
    { name: "Fisherman's Wharf", destination: "goa", price: 1500, rating: 4.6, type: "non-veg", cuisine: "Goan" },
    { name: "Saravana Bhavan", destination: "kerala", price: 400, rating: 4.5, type: "veg", cuisine: "South Indian" }
];

const transportOptions = [
    { type: "Private Cab", destination: "India", pricePerDay: 2500, icon: "car" },
    { type: "Public Transport", destination: "India", pricePerDay: 200, icon: "bus" },
    { type: "Bike Rental", destination: "India", pricePerDay: 500, icon: "bike" }
];

const itineraryData = {
    jaipur: [
        { day: 1, title: "Arrival & City Palace", activity: "Check-in at hotel and visit the magnificent City Palace and Jantar Mantar." },
        { day: 2, title: "Forts & Shopping", activity: "Spend the day exploring Amer Fort and Nahargarh Fort. Evening shopping at Bapu Bazaar." },
        { day: 3, title: "Hawa Mahal", activity: "Visit the iconic Hawa Mahal and try local Rajasthani delicacies." }
    ],
    manali: [
        { day: 1, title: "Himalayan Welcome", activity: "Arrive in Manali, visit Hadimba Devi Temple and Old Manali market." },
        { day: 2, title: "Snow Adventure", activity: "Full day trip to Solang Valley for paragliding and snow activities." },
        { day: 3, title: "Beas River Side", activity: "Leisure day by the Beas river and explore local cafes." }
    ],
    goa: [
        { day: 1, title: "Beach Vibes", activity: "Arrive in North Goa, enjoy sunset at Baga Beach." },
        { day: 2, title: "Heritage Tour", activity: "Visit the Basilica of Bom Jesus and explore Old Goa." },
        { day: 3, title: "South Goa Chill", activity: "Relax at Palolem Beach and try some water sports." }
    ],
    kerala: [
        { day: 1, title: "Tea Gardens", activity: "Arrive in Munnar, visit the sprawling tea estates and Tata Tea Museum." },
        { day: 2, title: "Nature & Wildlife", activity: "Explore Eravikulam National Park and Mattupetty Dam." },
        { day: 3, title: "Echo Point", activity: "Visit Echo Point and enjoy a serene boat ride." }
    ]
};