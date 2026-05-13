'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { destinations } from '@/lib/destination-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, Send, MessageCircle, User, X } from 'lucide-react';

interface Review {
  id: string;
  destination: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
}

interface Tip {
  id: string;
  destination: string;
  author: string;
  content: string;
  category: string;
  date: string;
  likes: number;
}

const initialReviews: Review[] = [
  {
    id: '1',
    destination: 'Jaipur',
    author: 'Priya S.',
    rating: 5,
    title: 'Amazing cultural experience!',
    content: 'Jaipur is absolutely stunning! The Hawa Mahal is worth every minute. Highly recommend visiting during the winter months for pleasant weather.',
    date: '2024-04-15',
    helpful: 24
  },
  {
    id: '2',
    destination: 'Kerala',
    author: 'Rajesh K.',
    rating: 5,
    title: 'Paradise on Earth',
    content: 'The backwaters are truly magical. The houseboat cruise was the highlight of my trip. Great food and warm hospitality everywhere.',
    date: '2024-04-10',
    helpful: 18
  },
  {
    id: '3',
    destination: 'Agra',
    author: 'Anjali M.',
    rating: 4,
    title: 'Taj Mahal is breathtaking',
    content: 'The Taj Mahal lives up to the hype. Try to visit at sunrise for the best experience. The city has good restaurants but can be crowded.',
    date: '2024-04-05',
    helpful: 15
  }
];

const initialTips: Tip[] = [
  {
    id: '1',
    destination: 'Delhi',
    author: 'Vikram P.',
    content: 'Best time to visit Delhi is October to March. Avoid summers as it gets extremely hot. Visit Old Delhi for authentic street food experience.',
    category: 'General Tips',
    date: '2024-04-14',
    likes: 42
  },
  {
    id: '2',
    destination: 'Varanasi',
    author: 'Meera D.',
    content: 'Wake up early for the morning Aarti ceremony at Dashashwamedh Ghat. It\'s an unforgettable spiritual experience. Book a boat ride to see the ghats from the river.',
    category: 'Must-Do',
    date: '2024-04-12',
    likes: 38
  },
  {
    id: '3',
    destination: 'Shimla',
    author: 'Arjun S.',
    content: 'The toy train ride is absolutely scenic! Book your tickets in advance. Don\'t miss the Ridge area for stunning views of the surrounding mountains.',
    category: 'Activities',
    date: '2024-04-08',
    likes: 31
  }
];

export default function CommunityPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [tips, setTips] = useState<Tip[]>(initialTips);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [activeTab, setActiveTab] = useState<'reviews' | 'tips'>('reviews');

  // Form states
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    title: '',
    content: ''
  });

  const [newTip, setNewTip] = useState({
    author: '',
    content: '',
    category: 'General Tips'
  });

  const filteredReviews = selectedDestination
    ? reviews.filter(r => r.destination === selectedDestination)
    : reviews;

  const filteredTips = selectedDestination
    ? tips.filter(t => t.destination === selectedDestination)
    : tips;

  const submitReview = () => {
    if (newReview.author && newReview.title && newReview.content && selectedDestination) {
      setReviews(prev => [
        {
          id: Date.now().toString(),
          destination: selectedDestination,
          author: newReview.author,
          rating: newReview.rating,
          title: newReview.title,
          content: newReview.content,
          date: new Date().toISOString().split('T')[0],
          helpful: 0
        },
        ...prev
      ]);
      setNewReview({ author: '', rating: 5, title: '', content: '' });
    }
  };

  const submitTip = () => {
    if (newTip.author && newTip.content && selectedDestination) {
      setTips(prev => [
        {
          id: Date.now().toString(),
          destination: selectedDestination,
          author: newTip.author,
          content: newTip.content,
          category: newTip.category,
          date: new Date().toISOString().split('T')[0],
          likes: 0
        },
        ...prev
      ]);
      setNewTip({ author: '', content: '', category: 'General Tips' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Community Hub</h1>
            <p className="text-muted-foreground">
              Share experiences, read reviews, and get tips from fellow travelers
            </p>
          </div>

          {/* Destination Filter */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Filter by Destination</label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedDestination === '' ? 'default' : 'outline'}
                    onClick={() => setSelectedDestination('')}
                  >
                    All Destinations
                  </Button>
                  {destinations.map(dest => (
                    <Button
                      key={dest.id}
                      variant={selectedDestination === dest.name ? 'default' : 'outline'}
                      onClick={() => setSelectedDestination(dest.name)}
                    >
                      {dest.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="mb-8 border-b border-border flex gap-4">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'tips'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Travel Tips
            </button>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Submit Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>
                    {activeTab === 'reviews' ? 'Write a Review' : 'Share a Tip'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!selectedDestination && (
                    <div className="p-3 bg-muted rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground">
                        Please select a destination to share your {activeTab}
                      </p>
                    </div>
                  )}

                  {selectedDestination && (
                    <>
                      {activeTab === 'reviews' ? (
                        <>
                          <div>
                            <label className="text-sm font-medium text-foreground">Your Name</label>
                            <Input
                              value={newReview.author}
                              onChange={(e) => setNewReview(prev => ({ ...prev, author: e.target.value }))}
                              placeholder="Enter your name"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground">Rating</label>
                            <div className="flex gap-2 mt-2">
                              {[1, 2, 3, 4, 5].map(rating => (
                                <button
                                  key={rating}
                                  onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                                  className={`p-2 rounded transition-colors ${
                                    newReview.rating === rating
                                      ? 'bg-secondary text-secondary-foreground'
                                      : 'bg-muted text-muted-foreground hover:bg-primary/20'
                                  }`}
                                >
                                  <Star className="w-5 h-5" />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground">Review Title</label>
                            <Input
                              value={newReview.title}
                              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., Amazing experience!"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground">Review</label>
                            <textarea
                              value={newReview.content}
                              onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                              placeholder="Share your experience..."
                              className="w-full px-3 py-2 mt-1 border border-border rounded-md bg-background text-foreground"
                              rows={4}
                            />
                          </div>

                          <Button
                            onClick={submitReview}
                            disabled={!newReview.author || !newReview.title || !newReview.content}
                            className="w-full"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Submit Review
                          </Button>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="text-sm font-medium text-foreground">Your Name</label>
                            <Input
                              value={newTip.author}
                              onChange={(e) => setNewTip(prev => ({ ...prev, author: e.target.value }))}
                              placeholder="Enter your name"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground">Category</label>
                            <select
                              value={newTip.category}
                              onChange={(e) => setNewTip(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full px-3 py-2 mt-1 border border-border rounded-md bg-background text-foreground"
                            >
                              <option>General Tips</option>
                              <option>Must-Do</option>
                              <option>Activities</option>
                              <option>Food</option>
                              <option>Budget</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground">Tip</label>
                            <textarea
                              value={newTip.content}
                              onChange={(e) => setNewTip(prev => ({ ...prev, content: e.target.value }))}
                              placeholder="Share your travel tip..."
                              className="w-full px-3 py-2 mt-1 border border-border rounded-md bg-background text-foreground"
                              rows={4}
                            />
                          </div>

                          <Button
                            onClick={submitTip}
                            disabled={!newTip.author || !newTip.content}
                            className="w-full"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Submit Tip
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Reviews/Tips List */}
            <div className="lg:col-span-2 space-y-4">
              {activeTab === 'reviews' ? (
                <>
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map(review => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{review.author}</p>
                                  <p className="text-xs text-muted-foreground">{review.date}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                              ))}
                            </div>
                          </div>

                          <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
                          <p className="text-muted-foreground mb-4">{review.content}</p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">
                          No reviews yet. Be the first to share your experience!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <>
                  {filteredTips.length > 0 ? (
                    filteredTips.map(tip => (
                      <Card key={tip.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                                  <User className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{tip.author}</p>
                                  <p className="text-xs text-muted-foreground">{tip.date}</p>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary">{tip.category}</Badge>
                          </div>

                          <p className="text-foreground/80 mb-4">{tip.content}</p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <button className="flex items-center gap-1 hover:text-accent transition-colors">
                              <Star className="w-4 h-4" />
                              Helpful ({tip.likes})
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">
                          No tips yet. Be the first to share a helpful tip!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
