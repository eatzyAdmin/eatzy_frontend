'use client';

import React from 'react';
import { Navigation, Truck } from '@repo/ui/icons';
import { formatVnd } from '@repo/lib';
import { TextShimmer } from '@repo/ui';

interface RestaurantShippingProps {
  isLoading: boolean;
  distance: number;
  baseFee: number;
  finalFee: number;
  hasFreeship: boolean;
  variant: 'desktop' | 'mobile';
}

export const RestaurantShipping: React.FC<RestaurantShippingProps> = ({
  isLoading,
  distance,
  baseFee,
  finalFee,
  hasFreeship,
  variant
}) => {
  if (!isLoading && distance <= 0) return null;

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-1.5 ml-1 pt-0.5 whitespace-nowrap flex-shrink-0">
        <Navigation size={12} className="text-[#1A1A1A]" />
        <div className="flex items-baseline gap-1.5">
          {isLoading ? (
            <TextShimmer width={70} height={16} rounded="sm" />
          ) : hasFreeship && finalFee < baseFee ? (
            <>
              <span className="text-[14px] font-anton font-semibold text-[#1A1A1A] tracking-tight">{formatVnd(finalFee)}</span>
              <span className="text-[10px] text-gray-400 line-through font-bold">{formatVnd(baseFee)}</span>
            </>
          ) : (
            <>
              <span className="text-[14px] font-anton font-semibold text-[#1A1A1A] tracking-tight">{formatVnd(baseFee)}</span>
              <span className="text-[10px] font-bold text-gray-400">({distance.toFixed(1)} km)</span>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block mt-2 mb-6">
      <div className="hidden md:flex items-center justify-around py-2 pb-4">
        <div className="flex-1 flex flex-col items-center justify-center">
          <Navigation size={22} className="text-[#1A1A1A] mb-1" />
          {isLoading ? (
            <TextShimmer width={60} height={22} rounded="sm" />
          ) : (
            <span className="text-[18px] font-anton text-[#1A1A1A] tracking-tight">
              {distance.toFixed(1)} km
            </span>
          )}
        </div>

        <div className="w-[1px] h-10 bg-gray-200" />

        <div className="flex-1 flex flex-col items-center justify-center">
          <Truck size={22} className="text-[#1A1A1A] mb-1" />
          <div className="flex flex-col items-center">
            {isLoading ? (
              <TextShimmer width={80} height={22} rounded="sm" />
            ) : hasFreeship && finalFee < baseFee ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] text-gray-400 line-through font-bold">{formatVnd(baseFee)}</span>
                <span className="text-[18px] font-anton text-[#1A1A1A] tracking-tight">{formatVnd(finalFee)}</span>
              </div>
            ) : (
              <span className="text-[18px] font-anton text-[#1A1A1A] tracking-tight">{formatVnd(baseFee)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
