'use client';

import React from 'react';
import { ImageWithFallback } from "@repo/ui";

interface MobileRestaurantAvatarProps {
  avatarUrl?: string;
  restaurantName: string;
}

export const MobileRestaurantAvatar: React.FC<MobileRestaurantAvatarProps> = ({
  avatarUrl,
  restaurantName
}) => {
  return (
    <div className="shrink-0 w-[120px] h-[120px] rounded-[30px] shadow-md border-4 border-white md:hidden relative bg-white overflow-visible">
      <div className="absolute inset-0 rounded-[28px] overflow-hidden">
        <ImageWithFallback
          src={avatarUrl || ""}
          alt={restaurantName}
          fill
          placeholderMode="vertical"
          className="object-cover"
        />
      </div>
    </div>
  );
};
