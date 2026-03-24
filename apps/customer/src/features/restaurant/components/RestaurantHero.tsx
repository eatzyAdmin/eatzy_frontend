'use client';

import React from 'react';
import { ImageWithFallback } from "@repo/ui";
import { motion } from "@repo/ui/motion";
import { Star, Loader2, Store } from "@repo/ui/icons";
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
  const isClosed = restaurant.status !== 'OPEN';

  return (
    <div className="hidden md:block relative mb-10">
      <div className="relative aspect-[16/8] rounded-[32px] shadow-sm md:rounded-[40px] group">
        {/* Clipped Content Container */}
        <div className="absolute inset-0 rounded-[32px] md:rounded-[40px] overflow-hidden">
          <ImageWithFallback
            src={coverImageUrl || "https://placehold.co/600x400?text=Restaurant"}
            alt={restaurant.name}
            fill
            placeholderMode="horizontal"
            className={`object-cover transition-transform duration-[1.5s] ${isClosed ? 'grayscale brightness-75' : 'group-hover:scale-110'}`}
          />
          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />

          {isClosed && (
            <div className="absolute inset-0 bg-primary/20 mix-blend-color z-[1] pointer-events-none" />
          )}

          {/* Restaurant Vouchers - Absolute on image */}
          {!isClosed && <RestaurantVouchers restaurantId={numericRestaurantId} />}
        </div>

        {/* Closed Ribbon - Outside clipping for real overflow */}
        {isClosed && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute top-8 left-[-9px] z-30 pointer-events-none"
          >
            <div className="flex items-center gap-3 bg-red-600 text-white pl-8 pr-12 py-3.5 rounded-r-[32px] shadow-2xl border-y border-r border-white/20">
              <Store size={22} strokeWidth={3} className="text-white" />
              <span className="text-[20px] font-black font-anton uppercase tracking-[0.2em] drop-shadow-sm pt-0.5">
                Store Closed
              </span>
            </div>
            {/* Fold shadow effect - aligned with left-[-9px] */}
            <div className="absolute left-[0px] -bottom-[9.5px] w-0 h-0 border-t-[10px] border-t-red-900 border-l-[10px] border-l-transparent" />
          </motion.div>
        )}
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
