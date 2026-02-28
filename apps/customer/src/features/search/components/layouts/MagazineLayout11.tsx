import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { ImageWithFallback } from '@repo/ui';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { Star } from '@repo/ui/icons';

export default function MagazineLayout11({ restaurant, dishes }: { restaurant: Restaurant; dishes: Dish[]; menuCategories: MenuCategory[]; }) {
  const grid = dishes.slice(0, 4);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.section
      className="overflow-hidden shadow-2xl mb-16 md:mb-32 rounded-[60px] bg-[#F5E6D3] text-[#2C2416] relative"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#D4A574]/10 to-transparent pointer-events-none" />

      <div className="p-8 md:p-20 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-20 border-b border-[#D4A574]/30 pb-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-anton font-bold text-[#8B7355] uppercase tracking-[0.5em] mb-4">Curated Selection</span>
            <h1 className="text-5xl md:text-8xl font-anton font-bold tracking-tighter uppercase leading-[0.85] text-[#2C2416]">
              {restaurant.name}
            </h1>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30">
              <Star className="w-4 h-4 fill-[#D4A574] text-[#D4A574]" />
              <span className="font-anton text-xl font-bold translate-y-[2px] text-[#2C2416]">{restaurant.rating}</span>
            </div>
          </div>
        </div>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
          className="relative grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-24 cursor-pointer"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />
          {grid.map((dish, index) => (
            <motion.div
              key={dish.id}
              onMouseEnter={(e) => moveHighlight(e, { borderRadius: 64, backgroundColor: 'rgba(255,255,255,0.4)', opacity: 1, scaleEnabled: true, scale: 1.1, paddingX: 10, paddingY: 15 })}
              className="group relative z-10 flex flex-col"
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Image Container with Extreme Asymmetric Radii */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-tr-[50px] md:rounded-tr-[100px] rounded-bl-[50px] md:rounded-bl-[100px] mb-4 md:mb-8 bg-white shadow-2xl border border-[#D4A574]/20">
                <ImageWithFallback
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  placeholderMode="horizontal"
                  className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
                {/* Overlay Badge */}
                <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 bg-[#2C2416] text-white font-anton text-lg md:text-3xl px-3 py-1 md:px-6 md:py-2 rounded-xl md:rounded-2xl transform rotate-3 group-hover:rotate-0 transition-transform shadow-2xl text-center">
                  {(dish.price / 1000).toFixed(0)}K
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 px-1 md:px-4">
                <div className="text-[8px] md:text-[10px] font-anton font-bold text-[#8B7355] uppercase tracking-widest mb-1 md:mb-2">Plate 0{index + 1}</div>
                <h3 className="text-base md:text-5xl font-anton font-bold mb-1 md:mb-4 uppercase tracking-tighter text-[#2C2416] group-hover:text-[#8B7355] transition-colors line-clamp-1">
                  {dish.name}
                </h3>
                <p className="hidden md:block text-[#5A4A3A] text-sm md:text-lg font-medium leading-relaxed italic max-w-sm">
                  &quot;{dish.description}&quot;
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Decoration */}
        <div className="mt-24 pt-10 border-t border-[#D4A574]/30 flex items-center justify-between">
          <div className="text-[10px] font-anton font-bold text-[#8B7355] uppercase tracking-[0.5em]">
            Eatzy Gourmet Collection
          </div>
          <div className="text-[#8B7355] text-sm italic font-serif">
            {restaurant.address}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
