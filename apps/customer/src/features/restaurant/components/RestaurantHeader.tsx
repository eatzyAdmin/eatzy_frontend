'use client';

import React from 'react';
import { MapPin } from '@repo/ui/icons';
import type { Restaurant } from '@repo/types';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  children?: React.ReactNode; // Dùng để truyền Rating và Shipping vào đúng vị trí
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant, children }) => {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-2 md:gap-0">
      <h1
        className="text-[24px] md:text-[62px] font-bold leading-[1.1] text-[#1A1A1A] md:mb-3 md:drop-shadow-none"
        style={{
          fontStretch: "condensed",
          letterSpacing: "-0.01em",
          fontFamily: "var(--font-anton), var(--font-sans)",
        }}
      >
        {restaurant.name.toUpperCase()}
      </h1>

      {restaurant.description && (
        <>
          <p className="hidden md:block text-[14px] text-[#555555] leading-relaxed mb-4">
            {restaurant.description}
          </p>
          <p className="md:hidden text-[13px] text-[#555555] leading-snug line-clamp-2">
            {restaurant.description}
          </p>
        </>
      )}

      {restaurant.address && (
        <>
          {/* Desktop Address */}
          <div className="hidden md:block">
            <div className="flex items-start gap-2 text-[13px] text-[#555555] mb-4">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{restaurant.address}</span>
            </div>
          </div>
          {/* Mobile Address */}
          <div className="flex md:hidden items-start gap-1.5 text-[12px] text-[#555555] leading-tight">
            <MapPin size={14} className="shrink-0 mt-0.5" />
            <span className="line-clamp-2">{restaurant.address}</span>
          </div>
        </>
      )}

      {/* Chèn Rating & Shipping vào đây cho Mobile */}
      <div className="md:hidden">
        {children}
      </div>
    </div>
  );
};
