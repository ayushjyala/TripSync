'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';
import type { Destination } from '@/lib/destination-data';

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link href={`/destination/${destination.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-muted">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
              {destination.region}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground">{destination.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {destination.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <span className="font-medium text-sm">{destination.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">({destination.reviews} reviews)</span>
            </div>

            {/* Duration and Budget */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{destination.duration}</span>
              </div>
              <div className="text-sm font-medium text-primary">
                ₹{destination.budget.low.toLocaleString()} - ₹{destination.budget.high.toLocaleString()}
              </div>
            </div>

            {/* Best Time */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Best time:</span> {destination.bestTime}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
