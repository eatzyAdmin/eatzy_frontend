"use client";

import { motion } from "@repo/ui/motion";
import { ImageWithFallback, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { MapPin, Star, Heart, Loader2, Store } from "@repo/ui/icons";
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
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 1
      }}
      onClick={onClick}
      onMouseEnter={(e) =>
        moveHighlight(e, {
          borderRadius: 40,
          backgroundColor: "rgba(255,255,255,0.05)",
          opacity: 1,
          scaleEnabled: false,
        })
      }
      onMouseMove={(e) =>
        moveHighlight(e, {
          borderRadius: 40,
          backgroundColor: "rgba(255,255,255,0.05)",
          opacity: 1,
          scaleEnabled: false,
        })
      }
      onMouseLeave={clearHover}
      className="group relative w-full aspect-[4/5] md:aspect-[7/8] overflow-hidden rounded-[32px] md:rounded-[40px] shadow-[0_0_15px_rgba(0,0,0,0.08)] md:shadow-[0_0_25px_rgba(0,0,0,0.10)] cursor-pointer"
    >
      <HoverHighlightOverlay rect={rect} style={highlightStyle} />

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={restaurant.imageUrl || ""}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-700 ease-out"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content Layout */}
      <div className="relative z-10 h-full p-3 md:p-4 flex flex-col justify-between">
        {/* Top Badges */}
        <div className="flex justify-between items-start">
          {restaurant.rating && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-1 md:gap-1.5 bg-white/95 backdrop-blur-md pl-1 md:pl-1.5 pr-2 md:pr-3 py-1 md:py-1.5 rounded-[16px] md:rounded-[18px] shadow-sm border border-white/20"
            >
              <div className="w-4 h-4 md:w-6 md:h-6 rounded-md md:rounded-[12px] bg-amber-100 flex items-center justify-center">
                <Star className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-amber-600 fill-amber-600" strokeWidth={3} />
              </div>
              <span className="text-[11px] md:text-[15px] font-black font-anton uppercase text-amber-700">
                {restaurant.rating.toFixed(1)}
              </span>
            </motion.div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(e);
            }}
            disabled={isLoading}
            className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group/heart hover:bg-red-500 transition-all z-10"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin" />
            ) : (
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500 fill-red-500 group-hover/heart:text-white group-hover/heart:fill-white group-hover/heart:scale-110 transition-all" />
            )}
          </button>
        </div>

        {/* Bottom Information */}
        <div className="space-y-2 md:space-y-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {/* Name & Address */}
          <div className="space-y-0.5 md:space-y-1">
            <h2 className="text-lg md:text-2xl font-anton font-semibold text-white tracking-wide uppercase line-clamp-2 leading-tight">
              {restaurant.name}
            </h2>
            {restaurant.address && (
              <p className="text-[10px] md:text-xs text-white/50 font-medium line-clamp-1 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                {restaurant.address}
              </p>
            )}
          </div>

          {/* Metrics Row */}
          <div className="flex items-center gap-3 md:gap-6 pt-1 md:pt-2">
            <div className="space-y-0 md:space-y-0.5">
              <div className="text-white text-sm md:text-lg font-anton truncate max-w-[60px] md:max-w-none">
                {restaurant.categories?.[0]?.name || "N/A"}
              </div>
              <div className="text-white/40 text-[8px] md:text-[10px] uppercase font-bold tracking-widest leading-none">Category</div>
            </div>
            <div className="w-px h-6 md:h-8 bg-white/10" />
            <div className="space-y-0 md:space-y-0.5">
              <div className="text-white text-sm md:text-lg font-anton truncate uppercase max-w-[60px] md:max-w-none">
                {restaurant.status === 'OPEN' ? 'Open' : 'Closed'}
              </div>
              <div className="text-white/40 text-[8px] md:text-[10px] uppercase font-bold tracking-widest leading-none">Status</div>
            </div>
          </div>

          {/* Footer Separator */}
          <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent w-full" />

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-0.5 md:pt-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 md:gap-2 group/restaurant">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-md md:rounded-lg bg-white/10 flex items-center justify-center group-hover/restaurant:bg-[var(--primary)] transition-colors">
                  <Store className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                </div>
                <span className="text-[10px] md:text-sm font-bold text-white/70 group-hover/restaurant:text-white transition-colors border-b border-white/30 md:pb-0.5">
                  Visit Restaurant
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glossy Overlay for Premium Feel */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}
