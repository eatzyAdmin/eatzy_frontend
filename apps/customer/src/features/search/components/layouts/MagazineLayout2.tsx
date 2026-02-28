import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { Star } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { ImageWithFallback } from '@repo/ui';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  restaurant: Restaurant;
  dishes: Dish[];
  menuCategories: MenuCategory[];
  distance?: number;
}

// Layout 2: Multi-column editorial with asymmetric grid
export default function MagazineLayout2({ restaurant, dishes }: Props) {
  // Rule: If the last row only has 1 dish (count % 3 === 1), hide that row (unless it's the only row and we want to show something)
  const effectiveDishes = (dishes.length > 1 && dishes.length % 3 === 1)
    ? dishes.slice(0, -1)
    : dishes;

  const col1 = effectiveDishes.filter((_, idx) => idx % 3 === 0);
  const col2 = effectiveDishes.filter((_, idx) => idx % 3 === 1);
  const col3 = effectiveDishes.filter((_, idx) => idx % 3 === 2);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mb-16 md:mb-24 px-4"
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Page header - more compact & integrated */}
        <div className="flex items-end gap-3 mb-6 md:mb-8">
          <div className="text-5xl md:text-7xl font-anton font-bold text-gray-100 leading-[0.7] select-none">
            {Math.floor(Math.random() * 99) + 1}
          </div>
          <div className="flex-1 pb-0.5 md:pb-1">
            <div className="h-[1px] bg-black/5 mb-1.5 w-full" />
            <div className="text-[8px] md:text-[10px] text-gray-300 font-anton font-bold uppercase tracking-[0.6em] leading-none">
              Current Selection
            </div>
          </div>
        </div>

        {/* Restaurant info card - More compact */}
        <div className="relative mb-12 md:mb-16">
          <div className="relative z-10 bg-white border-[2.5px] border-black p-6 md:p-10 rounded-[28px] md:rounded-[36px] shadow-[15px_15px_0px_0px_rgba(0,0,0,0.02)] group/hero overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-100/20 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 group-hover/hero:scale-150" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-px bg-amber-500/60" />
                  <span className="text-[9px] font-anton font-bold tracking-[0.2em] text-amber-600/80 uppercase">Masterpiece Venue</span>
                </div>
                <h2 className="text-3xl md:text-6xl font-anton font-bold leading-[0.85] tracking-tighter text-black uppercase mb-4">
                  {restaurant.name}
                </h2>
                <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl line-clamp-2 italic">
                  &quot;{restaurant.description}&quot;
                </p>
              </div>
              <div className="flex flex-col items-center gap-1.5 bg-black text-white p-5 rounded-[28px] min-w-[120px] shadow-lg transform rotate-2 transition-transform group-hover/hero:rotate-0">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <span className="text-3xl font-anton font-bold leading-none translate-y-[2px]">{restaurant.rating}</span>
                <span className="text-[8px] uppercase font-anton tracking-widest opacity-50">Rating Score</span>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
          className="relative grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 lg:gap-16 cursor-pointer"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />

          {/* Desktop Column 1 / Mobile Shared List Part 1 */}
          <div className="space-y-10 md:space-y-20">
            {col1.map((dish, idx) => {
              const originalIdx = dishes.indexOf(dish);
              return (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: originalIdx * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05, paddingX: 12, paddingY: 6 })}
                  className="relative z-10 group"
                >
                  <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden mb-4 md:mb-6 rounded-[28px] md:rounded-[32px] shadow-lg bg-gray-50 border border-gray-100">
                    <ImageWithFallback src={dish.imageUrl} alt={dish.name} fill placeholderMode="horizontal" className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col gap-2 md:gap-3 px-1 md:px-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] md:text-xs font-anton font-bold text-gray-300">#{String(originalIdx + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="font-anton text-lg md:text-2xl text-amber-600">
                        {(dish.price / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <h3 className="text-lg md:text-3xl font-anton font-bold uppercase tracking-tight text-black line-clamp-1">
                      {dish.name}
                    </h3>
                    <p className="hidden md:block text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Column 2 / Mobile Shared List Part 2 */}
          <div className="space-y-10 md:space-y-20 md:pt-32">
            {col2.map((dish, idx) => {
              const originalIdx = dishes.indexOf(dish);
              return (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: originalIdx * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05, paddingX: 12, paddingY: 6 })}
                  className="relative z-10 group"
                >
                  <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden mb-4 md:mb-6 rounded-[28px] md:rounded-[32px] shadow-lg bg-gray-50 border border-gray-100">
                    <ImageWithFallback src={dish.imageUrl} alt={dish.name} fill placeholderMode="horizontal" className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col gap-2 md:gap-3 px-1 md:px-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] md:text-xs font-anton font-bold text-gray-300">#{String(originalIdx + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="font-anton text-lg md:text-2xl text-amber-600">
                        {(dish.price / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <h3 className="text-lg md:text-3xl font-anton font-bold uppercase tracking-tight text-black line-clamp-1">
                      {dish.name}
                    </h3>
                    <p className="hidden md:block text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Column 3 (Desktop Only - mobile content falls into col1/col2 naturally) */}
          <div className="hidden md:block space-y-12 md:space-y-20 pt-16">
            {col3.map((dish, idx) => {
              const originalIdx = dishes.indexOf(dish);
              return (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: originalIdx * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05, paddingX: 12, paddingY: 6 })}
                  className="relative z-10 group"
                >
                  <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden mb-6 rounded-[32px] shadow-lg bg-gray-50 border border-gray-100">
                    <ImageWithFallback src={dish.imageUrl} alt={dish.name} fill placeholderMode="horizontal" className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col gap-3 px-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-anton font-bold text-gray-300">#{String(originalIdx + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="font-anton text-xl md:text-2xl text-amber-600">
                        {(dish.price / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <h3 className="text-xl md:text-3xl font-anton font-bold uppercase tracking-tight text-black line-clamp-1">
                      {dish.name}
                    </h3>
                    <p className="hidden md:block text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
