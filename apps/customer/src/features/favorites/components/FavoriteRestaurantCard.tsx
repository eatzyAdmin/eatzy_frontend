"use client";

import { motion } from "@repo/ui/motion";
import { ImageWithFallback, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { MapPin, Star, Heart, Loader2 } from "@repo/ui/icons";
import type { Restaurant } from "@repo/types";

export default function FavoriteRestaurantCard({
  restaurant,
  onClick,
  onRemove,
  isLoading
}: {
  restaurant: Restaurant;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  isLoading?: boolean;
}) {
  const {
    containerRef,
    rect,
    style: highlightStyle,
    moveHighlight,
    clearHover,
  } = useHoverHighlight<HTMLDivElement>();

  return (
    <motion.div
      ref={containerRef}
      whileHover={{ y: -4 }}
      onClick={onClick}
      onMouseEnter={(e) =>
        moveHighlight(e, {
          borderRadius: 24,
          backgroundColor: "rgba(0,0,0,0.04)",
          opacity: 1,
          scaleEnabled: true,
          scale: 1.05,
        })
      }
      onMouseMove={(e) =>
        moveHighlight(e, {
          borderRadius: 24,
          backgroundColor: "rgba(0,0,0,0.04)",
          opacity: 1,
          scaleEnabled: true,
          scale: 1.05,
        })
      }
      onMouseLeave={clearHover}
      className="relative bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
    >
      <HoverHighlightOverlay rect={rect} style={highlightStyle} />

      {/* Restaurant Image */}
      {restaurant.imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Favorite Badge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(e);
            }}
            disabled={isLoading}
            className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-red-500 animate-spin" />
            ) : (
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500 fill-red-500" />
            )}
          </button>

          {/* Rating Badge */}
          {restaurant.rating && (
            <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-white/95 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg flex items-center gap-1 md:gap-1.5">
              <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs md:text-sm font-bold text-[#1A1A1A]">{restaurant.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}

      {/* Restaurant Details */}
      <div className="p-3 md:p-5 space-y-2 md:space-y-3">
        {/* Name */}
        <h3 className="text-sm md:text-xl font-bold text-[#1A1A1A] line-clamp-1">
          {restaurant.name}
        </h3>

        {/* Categories */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
          {restaurant.categories.slice(0, 3).map((category) => (
            <span
              key={category.id}
              className="px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-medium bg-gray-100 text-gray-700"
            >
              {category.name}
            </span>
          ))}
          {restaurant.categories.length > 3 && (
            <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-medium bg-gray-100 text-gray-500">
              +{restaurant.categories.length - 3}
            </span>
          )}
        </div>

        {/* Description */}
        {restaurant.description && (
          <p className="text-[10px] md:text-sm text-gray-600 line-clamp-1 md:line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {/* Address */}
        {restaurant.address && (
          <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm text-gray-600">
            <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 via-transparent to-[var(--secondary)]/0 pointer-events-none opacity-0 hover:opacity-10 transition-opacity duration-300" />
    </motion.div>
  );
}
