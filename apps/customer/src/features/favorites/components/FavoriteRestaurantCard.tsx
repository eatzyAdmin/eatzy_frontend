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
      className="group relative w-full aspect-[4/5] md:aspect-[7/8] pt-1 cursor-pointer"
    >
      {/* Background & Body (Clipped for image/gradients) */}
      <div className="absolute inset-0 overflow-hidden rounded-[32px] md:rounded-[40px] shadow-[0_0_15px_rgba(0,0,0,0.08)] md:shadow-[0_0_25px_rgba(0,0,0,0.10)] z-0">
        <HoverHighlightOverlay rect={rect} style={highlightStyle} />

        <ImageWithFallback
          src={restaurant.imageUrl || ""}
          alt={restaurant.name}
          fill
          placeholderMode="vertical"
          className={`object-cover transition-transform duration-700 ease-out ${restaurant.status !== 'OPEN' ? 'grayscale brightness-[0.8] contrast-[1.1] group-hover:scale-110' : 'group-hover:scale-105'}`}
        />

        {/* Green Duotone Overlay for Closed Restaurants */}
        {restaurant.status !== 'OPEN' && (
          <div className="absolute inset-0 bg-primary/20 mix-blend-color z-[1] pointer-events-none" />
        )}

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent z-[2]" />
      </div>

      {/* Primary Content (Z-10) */}
      <div className="relative z-10 h-full p-3 md:p-4 flex flex-col justify-between">
        {/* Top Row: Rating and Heart Button */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2 relative z-20">
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
          </div>

          <div className="relative z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(e);
              }}
              disabled={isLoading}
              className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group/heart hover:bg-red-500 transition-all shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin" />
              ) : (
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500 fill-red-500 group-hover/heart:text-white group-hover/heart:fill-white group-hover/heart:scale-110 transition-all" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Information */}
        <div className="space-y-2 md:space-y-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <div className="space-y-0.5 md:space-y-1">
            <h2 className="text-lg md:text-2xl font-anton font-semibold text-white uppercase truncate leading-[1.4] pt-2 md:pb-0.5 -mt-2">
              {restaurant.name}
            </h2>
            {restaurant.address && (
              <p className="text-[10px] md:text-xs text-white/50 font-medium line-clamp-1 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                <span className="line-clamp-1">{restaurant.address}</span>
              </p>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3 md:gap-6 pt-1 md:pt-2">
            <div className="space-y-0 md:space-y-0.5">
              <div className="text-white text-sm md:text-lg font-anton truncate max-w-[60px] md:max-w-none">
                {restaurant.categories?.[0]?.name || "N/A"}
              </div>
              <div className="text-white/40 text-[8px] md:text-[10px] uppercase font-bold tracking-widest leading-none">Category</div>
            </div>
            <div className="w-px h-6 md:h-8 bg-white/10" />
            <div className="space-y-0 md:space-y-0.5">
              <div className={`text-sm md:text-lg font-anton truncate uppercase max-w-[60px] md:max-w-none ${restaurant.status === 'OPEN' ? 'text-white' : 'text-red-400'}`}>
                {restaurant.status === 'OPEN' ? 'Open' : 'Closed'}
              </div>
              <div className="text-white/40 text-[8px] md:text-[10px] uppercase font-bold tracking-widest leading-none">Status</div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent w-full" />

          <div className="flex items-center justify-between pt-0.5 md:pt-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 md:gap-2 group/restaurant">
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-md md:rounded-lg flex items-center justify-center transition-colors ${restaurant.status === 'OPEN' ? 'bg-white/10 group-hover/restaurant:bg-[var(--primary)]' : 'bg-white/5 opacity-50'}`}>
                  <Store className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                </div>
                <span className={`text-[10px] md:text-sm font-bold transition-colors border-b md:pb-0.5 ${restaurant.status === 'OPEN' ? 'text-white/70 group-hover/restaurant:text-white border-white/30' : 'text-white/40 border-white/10'}`}>
                  {restaurant.status === 'OPEN' ? 'Visit Restaurant' : 'Store Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overflowing "Closed" Ribbon - Sharp and Vibrant (Direct child of motion.div) */}
      {restaurant.status !== 'OPEN' && (
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="absolute right-[-8px] md:right-[-9.5px] top-16 md:top-20 z-[60] flex items-center gap-2 bg-red-600 backdrop-blur-sm pl-4 md:pl-5 pr-5 md:pr-7 py-2 md:py-2.5 shadow-[0_8px_16px_rgba(0,0,0,0.3)] border-y border-l border-white/30 text-white rounded-l-2xl group-hover:translate-x-1 transition-all"
        >
          <Store className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-white" strokeWidth={3} />
          <span className="text-[11px] md:text-[14px] font-black font-anton uppercase tracking-[0.1em] drop-shadow-sm">
            Closed
          </span>
          <div className="absolute right-[0] -bottom-[8px] md:-bottom-[10px] w-0 h-0 border-t-[8px] md:border-t-[10px] border-t-red-900 border-r-[8px] md:border-r-[10px] border-r-transparent" />
        </motion.div>
      )}

      {/* Glossy Overlay (Inside Clipping Div for best look) */}
      <div className="absolute inset-0 rounded-[32px] md:rounded-[40px] bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[5]" />
    </motion.div>
  );
}
