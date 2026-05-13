'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { INDIA_DESTINATIONS } from '@/lib/india-destinations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Download, MapPin, Calendar, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

type CostTier = 'budget' | 'mid' | 'luxury';

interface TripDestination {
  id: string;
  days: number;
  costTier: CostTier;
}

interface TripCalculation {
  destination: (typeof INDIA_DESTINATIONS)[0];
  days: number;
  costTier: CostTier;
  totalCost: number;
  costBreakdown: {
    accommodation: number;
    food: number;
    transport: number;
    activities: number;
  };
}

export default function ItineraryPage() {
  const [tripName, setTripName] = useState('My Indian Adventure');
  const [selectedDestinations, setSelectedDestinations] = useState<TripDestination[]>([]);
  const [budgetMode, setBudgetMode] = useState<'build' | 'search'>('build');
  const [totalBudget, setTotalBudget] = useState<number | string>('');
  const [suggestedDestinations, setSuggestedDestinations] = useState<TripCalculation[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Calculate trip costs
  const tripCalculations = useMemo(() => {
    return selectedDestinations
      .map(sd => {
        const destination = INDIA_DESTINATIONS.find(d => d.id === sd.id);
        if (!destination) return null;

        const costData = destination.costPerDay[sd.costTier];
        return {
          destination,
          days: sd.days,
          costTier: sd.costTier,
          totalCost: costData.total * sd.days,
          costBreakdown: {
            accommodation: costData.accommodation * sd.days,
            food: costData.food * sd.days,
            transport: costData.transport * sd.days,
            activities: costData.activities * sd.days,
          },
        };
      })
      .filter((item): item is TripCalculation => item !== null);
  }, [selectedDestinations]);

  const totalTripCost = useMemo(() => {
    return tripCalculations.reduce((sum, calc) => sum + calc.totalCost, 0);
  }, [tripCalculations]);

  const totalTripDays = useMemo(() => {
    return selectedDestinations.reduce((sum, sd) => sum + sd.days, 0);
  }, [selectedDestinations]);

  // Budget-based recommendations
  const handleBudgetSearch = () => {
    if (!totalBudget || parseInt(totalBudget as string) <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    const budget = parseInt(totalBudget as string);
    const recommendations: TripCalculation[] = [];
    let remainingBudget = budget;

    // Sort destinations by popularity (rating + reviews)
    const sortedDests = [...INDIA_DESTINATIONS].sort(
      (a, b) => (b.rating * b.reviews) - (a.rating * a.reviews)
    );

    for (const dest of sortedDests) {
      if (remainingBudget <= 0) break;

      // Try different combinations
      const tiers: CostTier[] = ['budget', 'mid', 'luxury'];
      for (const tier of tiers) {
        const costPerDay = dest.costPerDay[tier].total;
        const maxDays = Math.floor(remainingBudget / costPerDay);

        if (maxDays > 0) {
          const daysToAdd = Math.min(maxDays, 5); // Max 5 days per destination
          const tripCost = costPerDay * daysToAdd;

          if (tripCost <= remainingBudget) {
            const costData = dest.costPerDay[tier];
            recommendations.push({
              destination: dest,
              days: daysToAdd,
              costTier: tier,
              totalCost: tripCost,
              costBreakdown: {
                accommodation: costData.accommodation * daysToAdd,
                food: costData.food * daysToAdd,
                transport: costData.transport * daysToAdd,
                activities: costData.activities * daysToAdd,
              },
            });
            remainingBudget -= tripCost;
            break;
          }
        }
      }
    }

    setSuggestedDestinations(recommendations);
    setSearchPerformed(true);
  };

  const addDestinationFromSuggestion = (calc: TripCalculation) => {
    setSelectedDestinations([
      ...selectedDestinations,
      {
        id: calc.destination.id,
        days: calc.days,
        costTier: calc.costTier,
      },
    ]);
    setSuggestedDestinations(suggestedDestinations.filter(s => s.destination.id !== calc.destination.id));
  };

  const addDestination = (destinationId: string) => {
    if (!selectedDestinations.find(sd => sd.id === destinationId)) {
      setSelectedDestinations([
        ...selectedDestinations,
        { id: destinationId, days: 3, costTier: 'budget' },
      ]);
    }
  };

  const updateDestination = (destinationId: string, field: string, value: any) => {
    setSelectedDestinations(
      selectedDestinations.map(sd =>
        sd.id === destinationId ? { ...sd, [field]: value } : sd
      )
    );
  };

  const removeDestination = (destinationId: string) => {
    setSelectedDestinations(selectedDestinations.filter(sd => sd.id !== destinationId));
  };

  const downloadItinerary = () => {
    let content = `TripSync Itinerary - ${tripName}\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\n`;
    content += `Total Days: ${totalTripDays}\n`;
    content += `Total Cost: ₹${totalTripCost.toLocaleString()}\n`;
    content += `\n`;
    content += `DESTINATIONS:\n`;
    content += `${'='.repeat(80)}\n\n`;

    tripCalculations.forEach((calc, index) => {
      content += `${index + 1}. ${calc.destination.name} (${calc.destination.state})\n`;
      content += `   Days: ${calc.days}\n`;
      content += `   Cost Tier: ${calc.costTier.charAt(0).toUpperCase() + calc.costTier.slice(1)}\n`;
      content += `   Total Cost: ₹${calc.totalCost.toLocaleString()}\n`;
      content += `   Breakdown:\n`;
      content += `   - Accommodation: ₹${calc.costBreakdown.accommodation.toLocaleString()}\n`;
      content += `   - Food: ₹${calc.costBreakdown.food.toLocaleString()}\n`;
      content += `   - Transport: ₹${calc.costBreakdown.transport.toLocaleString()}\n`;
      content += `   - Activities: ₹${calc.costBreakdown.activities.toLocaleString()}\n`;
      content += `   Best Time: ${calc.destination.bestTime}\n`;
      content += `   Top Attractions: ${calc.destination.attractions.slice(0, 3).join(', ')}\n\n`;
    });

    content += `${'='.repeat(80)}\n`;
    content += `TRIP SUMMARY:\n`;
    content += `Total Duration: ${totalTripDays} days\n`;
    content += `Total Cost: ₹${totalTripCost.toLocaleString()}\n`;
    content += `Average Daily Cost: ₹${Math.round(totalTripCost / totalTripDays).toLocaleString()}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tripName.replace(/\s+/g, '-')}-itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-12 px-4 text-white">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Plan Your Perfect Trip</h1>
            <p className="text-lg text-white/90 max-w-2xl">Create custom itineraries with real-time cost calculations</p>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Trip Builder */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Name */}
              <Card className="border-0">
                <CardHeader>
                  <CardTitle>Trip Name</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder="Enter trip name"
                    className="bg-background"
                  />
                </CardContent>
              </Card>

              {/* Mode Selection */}
              <Card className="border-0">
                <CardHeader>
                  <CardTitle>How do you want to plan?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setBudgetMode('build');
                        setSuggestedDestinations([]);
                        setSearchPerformed(false);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        budgetMode === 'build'
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">🏗️</div>
                      <p className="font-semibold text-foreground">Build Custom Trip</p>
                      <p className="text-xs text-muted-foreground mt-1">Select destinations & costs</p>
                    </button>
                    <button
                      onClick={() => {
                        setBudgetMode('search');
                        setSelectedDestinations([]);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        budgetMode === 'search'
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">🎯</div>
                      <p className="font-semibold text-foreground">Budget Search</p>
                      <p className="text-xs text-muted-foreground mt-1">Find destinations by budget</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {budgetMode === 'build' ? (
                <>
                  {/* Add Destination */}
                  <Card className="border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Add Destinations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                        {INDIA_DESTINATIONS.filter(
                          d => !selectedDestinations.find(sd => sd.id === d.id)
                        ).map(dest => (
                          <button
                            key={dest.id}
                            onClick={() => addDestination(dest.id)}
                            className="text-left p-3 rounded-lg border border-muted hover:border-primary hover:bg-muted/50 transition-all"
                          >
                            <p className="font-semibold text-sm text-foreground">{dest.name}</p>
                            <p className="text-xs text-muted-foreground">{dest.state}</p>
                            <p className="text-xs text-primary mt-1">₹{dest.costPerDay.budget.total}/day</p>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Selected Destinations */}
                  {selectedDestinations.length > 0 && (
                    <Card className="border-0">
                      <CardHeader>
                        <CardTitle>Your Selected Destinations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {tripCalculations.map((calc, i) => (
                          <div key={i} className="p-4 border border-muted rounded-lg space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-foreground">{calc.destination.name}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {calc.destination.state}
                                </p>
                              </div>
                              <button
                                onClick={() => removeDestination(calc.destination.id)}
                                className="p-2 hover:bg-muted rounded-md transition"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </button>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Days</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="30"
                                  value={calc.days}
                                  onChange={(e) => updateDestination(calc.destination.id, 'days', parseInt(e.target.value) || 1)}
                                  className="w-full px-2 py-1 mt-1 border border-input rounded-md text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Tier</label>
                                <select
                                  value={calc.costTier}
                                  onChange={(e) => updateDestination(calc.destination.id, 'costTier', e.target.value)}
                                  className="w-full px-2 py-1 mt-1 border border-input rounded-md text-sm"
                                >
                                  <option value="budget">Budget</option>
                                  <option value="mid">Mid-Range</option>
                                  <option value="luxury">Luxury</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Total Cost</label>
                                <div className="text-lg font-bold text-primary mt-1">
                                  ₹{calc.totalCost.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                // Budget Search Mode
                <Card className="border-0">
                  <CardHeader>
                    <CardTitle>Search by Budget</CardTitle>
                    <CardDescription>Enter your total budget and we&apos;ll suggest the best destinations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Total Budget (₹)</label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="number"
                          value={totalBudget}
                          onChange={(e) => setTotalBudget(e.target.value)}
                          placeholder="Enter total budget"
                          className="bg-background"
                        />
                        <Button onClick={handleBudgetSearch} className="bg-primary hover:bg-primary/90">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                    </div>

                    {searchPerformed && suggestedDestinations.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Found {suggestedDestinations.length} destination combinations
                        </p>
                        {suggestedDestinations.map((calc, i) => (
                          <div
                            key={i}
                            className="p-4 border border-muted rounded-lg flex items-center justify-between hover:bg-muted/50 transition"
                          >
                            <div>
                              <p className="font-semibold text-foreground">{calc.destination.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {calc.days} days • {calc.costTier} tier • ₹{calc.totalCost.toLocaleString()}
                              </p>
                            </div>
                            <Button
                              onClick={() => addDestinationFromSuggestion(calc)}
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchPerformed && suggestedDestinations.length === 0 && selectedDestinations.length === 0 && (
                      <div className="p-4 border border-muted rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground text-center">
                          No perfect matches found. Try adjusting your budget.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Panel - Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Trip Summary */}
                <Card className="border-0 bg-gradient-to-br from-primary/10 to-accent/10">
                  <CardHeader>
                    <CardTitle>Trip Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Destinations</p>
                      <p className="text-3xl font-bold text-foreground">{selectedDestinations.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Days</p>
                      <p className="text-3xl font-bold text-foreground">{totalTripDays}</p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ₹{totalTripCost.toLocaleString()}
                      </p>
                      {totalTripDays > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          ₹{Math.round(totalTripCost / totalTripDays).toLocaleString()} per day
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Breakdown */}
                {tripCalculations.length > 0 && (
                  <Card className="border-0">
                    <CardHeader>
                      <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm">🏨 Accommodation</span>
                        <span className="font-semibold">₹{tripCalculations.reduce((s, c) => s + c.costBreakdown.accommodation, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm">🍽️ Food</span>
                        <span className="font-semibold">₹{tripCalculations.reduce((s, c) => s + c.costBreakdown.food, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm">🚌 Transport</span>
                        <span className="font-semibold">₹{tripCalculations.reduce((s, c) => s + c.costBreakdown.transport, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm">🎫 Activities</span>
                        <span className="font-semibold">₹{tripCalculations.reduce((s, c) => s + c.costBreakdown.activities, 0).toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                {selectedDestinations.length > 0 && (
                  <div className="space-y-3">
                    <Button onClick={downloadItinerary} className="w-full bg-primary hover:bg-primary/90">
                      <Download className="h-4 w-4 mr-2" />
                      Download Itinerary
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/community">Share & Get Tips</Link>
                    </Button>
                  </div>
                )}

                {selectedDestinations.length === 0 && budgetMode === 'build' && (
                  <Card className="border-0 bg-muted/30">
                    <CardContent className="p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Add destinations to get started with your trip planning
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
