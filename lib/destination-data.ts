export interface Destination {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  budget: {
    low: number;
    high: number;
    currency: string;
  };
  bestTime: string;
  duration: string;
  attractions: string[];
  activities: string[];
  food: string[];
  experience: string;
}

export const destinations: Destination[] = [
  {
    id: 'jaipur',
    name: 'Jaipur',
    region: 'Rajasthan',
    description: 'The Pink City of India, known for its stunning palaces, vibrant culture, and royal heritage. Explore ancient forts and colorful bazaars.',
    image: 'https://images.unsplash.com/photo-1599661676351-f3ae0b3c47b5?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 2840,
    budget: { low: 15000, high: 35000, currency: 'INR' },
    bestTime: 'October to March',
    duration: '3-4 days',
    attractions: ['Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Albert Hall Museum'],
    activities: ['Heritage walks', 'Camel safari', 'Hot air balloon ride', 'Traditional cooking class'],
    food: ['Dal baati churma', 'Gatte ki sabzi', 'Ker sangri', 'Malpua'],
    experience: 'Royal Rajasthani charm with bustling markets'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    region: 'South India',
    description: 'God\'s Own Country - lush backwaters, tranquil beaches, and serene plantations. Experience Kerala\'s unique culture and spices.',
    image: 'https://images.unsplash.com/photo-1598595046315-7832abf5d32e?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 3120,
    budget: { low: 20000, high: 40000, currency: 'INR' },
    bestTime: 'July to September, November to March',
    duration: '4-5 days',
    attractions: ['Backwaters', 'Munnar Tea Plantations', 'Kochi Fort', 'Varkala Beach'],
    activities: ['Houseboat cruise', 'Spice plantation tour', 'Ayurvedic massage', 'Kathakali dance'],
    food: ['Appam', 'Fish curry', 'Idiyappam', 'Payasam'],
    experience: 'Serene backwaters and lush tropical beauty'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    region: 'North India',
    description: 'India\'s capital city blending ancient history with modern vibrancy. From Mughal monuments to street food, Delhi has it all.',
    image: 'https://images.unsplash.com/photo-1605231555116-cd39b36e1aa2?w=600&h=400&fit=crop',
    rating: 4.5,
    reviews: 4050,
    budget: { low: 12000, high: 30000, currency: 'INR' },
    bestTime: 'October to March',
    duration: '3-4 days',
    attractions: ['Red Fort', 'India Gate', 'Humayun\'s Tomb', 'Jama Masjid'],
    activities: ['Street food tour', 'Heritage walk', 'Market exploration', 'Museum visits'],
    food: ['Chole bhature', 'Aloo paratha', 'Delhi ke aloo tikki', 'Dahi bhalle'],
    experience: 'Bustling energy with layers of history'
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    region: 'Uttar Pradesh',
    description: 'The spiritual heart of India on the banks of the Ganges. Experience ancient rituals, ghats, and the city\'s mystical energy.',
    image: 'https://images.unsplash.com/photo-1599661676309-ca0eb2f1a436?w=600&h=400&fit=crop',
    rating: 4.6,
    reviews: 2340,
    budget: { low: 10000, high: 25000, currency: 'INR' },
    bestTime: 'October to February',
    duration: '2-3 days',
    attractions: ['Dashashwamedh Ghat', 'Manikarnika Ghat', 'Kashi Vishwanath Temple', 'Ramnagar Fort'],
    activities: ['Boat ride on Ganges', 'Evening Aarti ceremony', 'Temple visits', 'Meditation'],
    food: ['Kachori', 'Chikhalwali', 'Malaiyyo', 'Thandai'],
    experience: 'Spiritual awakening and ancient traditions'
  },
  {
    id: 'agra',
    name: 'Agra',
    region: 'Uttar Pradesh',
    description: 'Home to the magnificent Taj Mahal, one of the Seven Wonders of the World. A city steeped in Mughal architecture.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 3890,
    budget: { low: 12000, high: 28000, currency: 'INR' },
    bestTime: 'October to March',
    duration: '2-3 days',
    attractions: ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh', 'Fatehpur Sikri'],
    activities: ['Sunrise visit to Taj Mahal', 'Fort exploration', 'Marble inlay craft', 'Hot air balloon ride'],
    food: ['Petha', 'Dalmoth', 'Biryani', 'Jalebi'],
    experience: 'Romance and grandeur of Mughal India'
  },
  {
    id: 'goa',
    name: 'Goa',
    region: 'West India',
    description: 'Beach paradise with Portuguese heritage, vibrant nightlife, and relaxed beach culture. Perfect for water activities and beach hopping.',
    image: 'https://images.unsplash.com/photo-1599661676351-f3ae0b3c47b5?w=600&h=400&fit=crop',
    rating: 4.6,
    reviews: 2650,
    budget: { low: 18000, high: 38000, currency: 'INR' },
    bestTime: 'November to February',
    duration: '3-5 days',
    attractions: ['Baga Beach', 'Arambol Beach', 'Se Cathedral', 'Aguada Fort'],
    activities: ['Beach hopping', 'Water sports', 'Paragliding', 'Dolphin spotting'],
    food: ['Fish curry', 'Prawn koliwada', 'Bebinca', 'Feni'],
    experience: 'Relaxed beach vibes with cultural richness'
  },
  {
    id: 'shimla',
    name: 'Shimla',
    region: 'Himachal Pradesh',
    description: 'A charming hill station nestled in the Himalayas. Known for scenic beauty, toy train rides, and adventure activities.',
    image: 'https://images.unsplash.com/photo-1599661676351-f3ae0b3c47b5?w=600&h=400&fit=crop',
    rating: 4.5,
    reviews: 1920,
    budget: { low: 14000, high: 32000, currency: 'INR' },
    bestTime: 'March to June, September to October',
    duration: '3-4 days',
    attractions: ['Ridge', 'Mall Road', 'Christ Church', 'Jakhoo Temple'],
    activities: ['Toy train ride', 'Hiking', 'Paragliding', 'Shopping at Mall Road'],
    food: ['Dham', 'Chhuhara puri', 'Momos', 'Chikhalwali'],
    experience: 'Mountain tranquility with colonial charm'
  },
  {
    id: 'dharamshala',
    name: 'Dharamshala',
    region: 'Himachal Pradesh',
    description: 'A spiritual haven in the mountains, home to the Dalai Lama and Buddhist monasteries. Perfect for peace and meditation seekers.',
    image: 'https://images.unsplash.com/photo-1599661676351-f3ae0b3c47b5?w=600&h=400&fit=crop',
    rating: 4.6,
    reviews: 1560,
    budget: { low: 10000, high: 25000, currency: 'INR' },
    bestTime: 'March to June, September to November',
    duration: '3-4 days',
    attractions: ['Tsuglagkhang Temple', 'Bhagsu Waterfall', 'Dal Lake', 'Namgyal Monastery'],
    activities: ['Meditation', 'Trekking', 'Monastery visits', 'Tea plantation tour'],
    food: ['Momos', 'Thukpa', 'Tsampa', 'Naan'],
    experience: 'Spiritual peace with mountain serenity'
  }
];

export const getDestinationById = (id: string): Destination | undefined => {
  return destinations.find(d => d.id === id);
};

export const getDestinationsByRegion = (region: string): Destination[] => {
  return destinations.filter(d => d.region === region);
};

export const getAllRegions = (): string[] => {
  return Array.from(new Set(destinations.map(d => d.region)));
};

export const searchDestinations = (query: string): Destination[] => {
  const lowerQuery = query.toLowerCase();
  return destinations.filter(d =>
    d.name.toLowerCase().includes(lowerQuery) ||
    d.description.toLowerCase().includes(lowerQuery) ||
    d.region.toLowerCase().includes(lowerQuery)
  );
};
