'use client';

import React from 'react';
import { Star, Loader2 } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import type { Restaurant } from "@repo/types";

interface MobileRestaurantHeroProps {
  coverImageUrl?: string;
  restaurantName: string;
  numericRestaurantId: number | null;
  favorited: boolean;
  isMutating: boolean;
  onToggleFavorite: (id: number) => void;
}

export const MobileRestaurantHero: React.FC<MobileRestaurantHeroProps> = ({
  coverImageUrl,
  restaurantName,
  numericRestaurantId,
  favorited,
  isMutating,
  onToggleFavorite
}) => {
  return (
    <div className="absolute top-0 left-0 w-full h-[160px] z-0 md:hidden border-none outline-none ring-0 -mb-1">
      <div className="relative w-full h-full overflow-hidden">
        <ImageWithFallback
          src={coverImageUrl || "https://placehold.co/600x400?text=Restaurant"}
          alt={restaurantName}
          fill
          placeholderMode="horizontal"
          className="object-cover"
        />

        {/* Gradient for text blend */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F7F7F7] via-[#F7F7F7]/80 to-transparent" />

        {/* Save Button for Mobile */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (numericRestaurantId) onToggleFavorite(numericRestaurantId);
          }}
          disabled={isMutating}
          className={`absolute top-4 right-4 z-10 backdrop-blur-xl border-2 px-4 py-2 rounded-[20px] shadow-2xl flex items-center gap-2 transition-all active:scale-95 ${favorited
            ? 'bg-[#1A1A1A] border-white/10 text-white'
            : 'bg-black/30 border-white/30 text-white shadow-black/20'
            }`}
        >
          {isMutating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Star className={`w-4 h-4 transition-transform ${favorited ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
          )}
          <span className="text-[11px] font-anton uppercase tracking-widest pt-0.5">
            {favorited ? 'Saved' : 'Save'}
          </span>
        </button>
      </div>
    </div>
  );
};
