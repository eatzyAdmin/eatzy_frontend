'use client';

import React from 'react';
import { ImageWithFallback } from "@repo/ui";
import { Star, Loader2 } from "@repo/ui/icons";
import { RestaurantVouchers } from './RestaurantVouchers';
import type { Restaurant } from '@repo/types';

interface RestaurantHeroProps {
  restaurant: Restaurant;
  coverImageUrl?: string;
  favorited: boolean;
  isMutating: boolean;
  onToggleFavorite: (id: number, name: string) => void;
}

export const RestaurantHero: React.FC<RestaurantHeroProps> = ({
  restaurant,
  coverImageUrl,
  favorited,
  isMutating,
  onToggleFavorite
}) => {
  const numericRestaurantId = Number(restaurant.id);

  return (
    <div className="hidden md:block relative mb-10">
      <div className="relative aspect-[16/8] rounded-[32px] shadow-sm md:rounded-[40px] overflow-hidden group">
        <ImageWithFallback
          src={coverImageUrl || "https://placehold.co/600x400?text=Restaurant"}
          alt={restaurant.name}
          fill
          placeholderMode="horizontal"
          className="object-cover transition-transform duration-[1.5s]"
        />
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />

        {/* Restaurant Vouchers - Absolute on image */}
        <RestaurantVouchers restaurantId={numericRestaurantId} />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(numericRestaurantId, restaurant.name);
        }}
        disabled={isMutating}
        className={`absolute top-6 right-8 z-20 px-6 py-3 rounded-[24px] backdrop-blur-xl border-2 shadow-2xl flex items-center gap-3 transition-all active:scale-95 group/save ${favorited
          ? 'bg-black/60 text-white border-white/20'
          : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
          }`}
      >
        {isMutating ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Star className={`w-5 h-5 transition-transform group-hover/save:scale-125 ${favorited ? 'text-red-500 fill-red-500' : 'text-white'}`} />
        )}
        <span className="text-[15px] font-anton font-bold uppercase tracking-widest">
          {favorited ? 'Saved' : 'Save Venue'}
        </span>
      </button>
    </div>
  );
};
