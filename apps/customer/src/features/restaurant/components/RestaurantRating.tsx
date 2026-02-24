'use client';

import React from 'react';
import { Star, ChevronRight } from '@repo/ui/icons';
import { motion } from '@repo/ui/motion';

interface RestaurantRatingProps {
  rating?: string | number;
  onClick?: () => void;
  variant: 'desktop-overlay' | 'mobile-badge';
}

export const RestaurantRating: React.FC<RestaurantRatingProps> = ({
  rating,
  onClick,
  variant
}) => {
  if (!rating) return null;

  if (variant === 'mobile-badge') {
    return (
      <button
        onClick={onClick}
        className="flex items-center bg-lime-50 border border-lime-100 shadow-sm rounded-[14px] px-1 py-1 gap-2 active:scale-95 transition-transform whitespace-nowrap flex-shrink-0"
      >
        <div className="w-6 h-6 rounded-[10px] bg-[#1A1A1A] flex items-center justify-center shadow-sm">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[15px] font-anton text-[#1A1A1A] leading-none pt-0.5">{rating}</span>
          <ChevronRight className="w-3 h-3 text-gray-300" />
        </div>
      </button>
    );
  }

  return (
    <div className="absolute inset-x-0 bottom-0 p-0 flex justify-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-full w-full px-8 py-3 shadow-2xl flex items-center justify-center gap-4 transition-all group-hover:bg-white/60"
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <span className="text-[28px] font-anton text-[#1A1A1A] leading-none pt-1">{rating}</span>
          </div>
        </div>
        <div className="h-8 w-[1px] bg-[#1A1A1A]/10 mx-1" />
        <div className="flex flex-col items-center">
          <span className="text-[12px] font-bold text-[#1A1A1A] group-hover:text-black transition-colors">Xem đánh giá</span>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={8}
                className={i < Math.floor(Number(rating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
        </div>
        <div className="ml-2 w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
          <ChevronRight size={16} />
        </div>
      </motion.div>
    </div>
  );
};
