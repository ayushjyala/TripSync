'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { DestinationCard } from '@/components/destination-card';
import { INDIA_DESTINATIONS } from '@/lib/india-destinations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MapPin, DollarSign, Users, Compass, Clock, Star, Calendar } from 'lucide-react';

const featuredDestinations = INDIA_DESTINATIONS.slice(0, 6);
const regions = [
  { name: 'North', color: 'from-blue-600 to-cyan-500', icon: '⛰️', destinations: 12 },
  { name: 'South', color: 'from-green-600 to-emerald-500', icon: '🏝️', destinations: 10 },
  { name: 'East', color: 'from-purple-600 to-pink-500', icon: '🌅', destinations: 8 },
  { name: 'West', color: 'from-orange-600 to-yellow-500', icon: '🏜️', destinations: 11 },
  { name: 'Northeast', color: 'from-teal-600 to-cyan-500', icon: '🌿', destinations: 7 },
  { name: 'Central', color: 'from-red-600 to-orange-500', icon: '🏛️', destinations: 9 },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Background */}
        <section 
          className="relative py-20 md:py-32 px-4 overflow-hidden"
          style={{
            backgroundImage: 'url(/images/hero-background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-overlay"></div>
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center space-y-8">
              <div className="space-y-3">
                <div className="inline-block">
                  <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                    Explore India Like Never Before
                  </span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-balance leading-tight">
                Plan Your <span className="text-yellow-300">Perfect</span> Indian Adventure
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 text-balance max-w-2xl mx-auto leading-relaxed">
                Discover 100+ destinations across all Indian states, get real-time budget estimates, create personalized itineraries, and connect with a vibrant community of travelers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold text-base">
                  <Link href="/explore">
                    <Compass className="mr-2 h-5 w-5" />
                    Explore Destinations
                  </Link>
                </Button>
                <Button asChild size="lg" className="bg-white/20 text-white hover:bg-white/30 border border-white/40 backdrop-blur-sm font-semibold text-base">
                  <Link href="/itinerary">
                    <Calendar className="mr-2 h-5 w-5" />
                    Plan Your Trip
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-12">
                <div className="text-white">
                  <div className="text-3xl md:text-4xl font-bold">100+</div>
                  <div className="text-sm text-white/80">Destinations</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl md:text-4xl font-bold">28</div>
                  <div className="text-sm text-white/80">Indian States</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl md:text-4xl font-bold">∞</div>
                  <div className="text-sm text-white/80">Experiences</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-16 md:py-24 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Featured Destinations</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore some of India&apos;s most iconic and beautiful destinations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDestinations.map((destination) => (
                <Link key={destination.id} href={`/destination/${destination.id}`}>
                  <Card className="overflow-hidden hover-lift transition-all duration-300 h-full hover:shadow-xl border-0">
                    <div className="relative h-48 bg-muted overflow-hidden">
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 rounded-full p-2">
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl text-foreground">{destination.name}</CardTitle>
                      <CardDescription className="text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {destination.state}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">{destination.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">₹{destination.costPerDay.budget.total}/day</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">{destination.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Button asChild size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/5">
                <Link href="/explore">
                  View All Destinations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Regions */}
        <section className="py-16 md:py-24 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Explore by Region</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover destinations organized by India&apos;s diverse regions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Navigate to explore page with region filter
                    window.location.href = `/explore?region=${region.name}`;
                  }}
                  className={`relative h-40 rounded-xl overflow-hidden group cursor-pointer`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <span className="text-5xl mb-3">{region.icon}</span>
                    <h3 className="text-2xl font-bold text-center">{region.name}</h3>
                    <p className="text-sm mt-2 text-white/80">{region.destinations} destinations</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why Choose TripSync?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need for an amazing travel experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <MapPin className="h-8 w-8" />,
                  title: 'Comprehensive Coverage',
                  description: '100+ destinations across all 28 Indian states and union territories'
                },
                {
                  icon: <DollarSign className="h-8 w-8" />,
                  title: 'Smart Budget Planning',
                  description: 'Get real-time cost estimates with budget, mid-range & luxury options'
                },
                {
                  icon: <Calendar className="h-8 w-8" />,
                  title: 'Smart Itineraries',
                  description: 'Create and customize multi-destination trips with cost tracking'
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: 'Community Reviews',
                  description: 'Connect with travelers and discover authentic local experiences'
                },
              ].map((feature, index) => (
                <Card key={index} className="border-0 bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="text-primary mb-3">{feature.icon}</div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-hero">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
              Ready to Explore India?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto text-balance">
              Start planning your perfect Indian adventure today. Discover destinations, create itineraries, and connect with fellow travelers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold text-base">
                <Link href="/explore">
                  Start Exploring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/budget">Calculate Budget</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 text-foreground py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">TripSync</h4>
              <p className="text-sm text-muted-foreground">Your trusted companion for exploring India</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/explore" className="hover:text-primary transition">Explore</Link></li>
                <li><Link href="/itinerary" className="hover:text-primary transition">Plan Trip</Link></li>
                <li><Link href="/budget" className="hover:text-primary transition">Budget</Link></li>
                <li><Link href="/community" className="hover:text-primary transition">Community</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Popular</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/destination/jaipur" className="hover:text-primary transition">Jaipur</Link></li>
                <li><Link href="/destination/agra" className="hover:text-primary transition">Agra</Link></li>
                <li><Link href="/destination/manali" className="hover:text-primary transition">Manali</Link></li>
                <li><Link href="/destination/kochi" className="hover:text-primary transition">Kochi</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition">Facebook</a></li>
                <li><a href="#" className="hover:text-primary transition">Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 TripSync. All rights reserved. | Your journey begins here.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
