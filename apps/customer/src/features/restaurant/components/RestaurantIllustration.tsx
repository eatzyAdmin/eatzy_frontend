'use client';

import React from 'react';
import { ImageWithFallback } from "@repo/ui";
import { RestaurantRating } from './RestaurantRating';
import type { Restaurant } from '@repo/types';

interface RestaurantIllustrationProps {
  restaurant: Restaurant;
  avatarUrl?: string;
  onRatingClick?: () => void;
}

export const RestaurantIllustration: React.FC<RestaurantIllustrationProps> = ({
  restaurant,
  avatarUrl,
  onRatingClick
}) => {
  return (
    <div
      onClick={onRatingClick}
      className="hidden md:block group relative rounded-[32px] shadow-lg md:rounded-[36px] overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-[16/11]">
        <ImageWithFallback
          src={avatarUrl || "https://placehold.co/600x400?text=Restaurant"}
          alt={restaurant.name}
          fill
          placeholderMode="vertical"
          className="object-cover transition-transform duration-700"
        />

        {/* Glassmorphism Rating Badge - Embedded in Image */}
        <RestaurantRating
          rating={restaurant.rating}
          variant="desktop-overlay"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
