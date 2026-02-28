import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { Star } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { ImageWithFallback } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  restaurant: Restaurant;
  dishes: Dish[];
  menuCategories: MenuCategory[];
  distance?: number; // Distance in km from user
}

// Layout 1: Editorial Hero - Large featured dish with editorial typography
export default function MagazineLayout1({ restaurant, dishes, distance }: Props) {
  const featured = dishes[0];
  const sideDishes = dishes.slice(1, 5);
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
      className="mb-8 md:mb-16 px-4"
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Magazine page indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-black text-white rounded-full text-[10px] font-anton font-bold tracking-[0.2em]">
              P.{Math.floor(Math.random() * 50) + 1}
            </div>
            <div className="h-px w-12 bg-gray-200" />
          </div>
          <div className="text-[11px] text-gray-400 font-anton font-bold uppercase tracking-[0.3em] bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
            {restaurant.categories?.[0]?.name || 'RESTAURANT'}
          </div>
        </div>

        {/* Restaurant title - editorial style updated to modern luxury */}
        <div className="mb-8 md:mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-6">
            <h2 className="text-3xl md:text-8xl font-anton font-bold leading-[0.85] tracking-tighter text-black uppercase">
              {restaurant.name}
            </h2>
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-amber-100/50">
                <Star className="w-4 md:w-5 h-4 md:h-5 fill-amber-500 text-amber-500" />
                <span className="font-anton text-xl md:text-2xl text-amber-900 leading-none translate-y-[2px]">{restaurant.rating}</span>
              </div>
              {distance !== undefined && (
                <div className="text-[10px] md:text-xs font-anton font-bold text-gray-400 tracking-widest uppercase">
                  {distance < 1 ? `${Math.round(distance * 1000)}M` : `${distance.toFixed(1)}KM`} AWAY
                </div>
              )}
            </div>
          </div>
          <p className="max-w-3xl text-sm md:text-xl text-gray-500 leading-relaxed font-medium">
            {restaurant.description}
          </p>
        </div>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
          className="relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 cursor-pointer"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />

          {/* Large featured dish */}
          <div
            onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.03, padding: 4 })}
            className="col-span-1 md:col-span-8 relative z-10"
          >
            <div className="relative aspect-[16/10] overflow-hidden mb-4 md:mb-6 rounded-[32px] md:rounded-[40px] shadow-2xl bg-gray-100 group">
              <ImageWithFallback
                src={featured.imageUrl}
                alt={featured.name}
                fill
                placeholderMode="horizontal"
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />

              {/* Floating Price Badge */}
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white/90 backdrop-blur-xl px-4 py-3 md:px-6 md:py-4 rounded-[20px] md:rounded-[24px] shadow-2xl border border-white/40 flex flex-col items-end">
                <span className="text-[8px] md:text-[10px] font-anton font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Price Start From</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-3xl font-anton font-bold text-black">{(featured.price / 1000).toFixed(0)}</span>
                  <span className="text-xs md:text-sm font-anton font-bold text-gray-400">K</span>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between px-2">
              <div className="flex-1">
                <h3 className="text-xl md:text-4xl font-anton font-bold mb-2 md:mb-3 uppercase tracking-tight">
                  {featured.name}
                </h3>
                <p className="text-gray-500 text-sm md:text-lg leading-relaxed max-w-xl line-clamp-2">
                  {featured.description}
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-4 space-y-6 md:space-y-8">
            <div className="flex items-center gap-4">
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-black font-anton font-bold whitespace-nowrap">
                Selection of the day
              </div>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
              {sideDishes.map((dish, idx) => (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={(e) => moveHighlight(e, { borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.02, padding: 4 })}
                  className="group cursor-pointer relative z-10"
                >
                  <div className="flex flex-col md:flex-row gap-3 md:gap-5 items-start md:items-center">
                    <div className="relative w-full md:w-28 aspect-square md:h-28 flex-shrink-0 overflow-hidden rounded-[20px] md:rounded-[24px] shadow-md bg-gray-50">
                      <ImageWithFallback
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        placeholderMode="horizontal"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 px-1 md:px-0">
                      <h4 className="font-anton font-bold text-base md:text-xl text-black uppercase leading-tight line-clamp-1">
                        {dish.name}
                      </h4>
                      <p className="hidden md:block text-xs text-gray-400 line-clamp-2 leading-relaxed font-medium">
                        {dish.description}
                      </p>
                      <div className="mt-0.5 md:mt-1 flex items-center justify-between md:justify-start gap-2">
                        <span className="font-anton text-base md:text-lg text-amber-600">
                          {(dish.price / 1000).toFixed(0)}K
                        </span>
                        {dish.rating && (
                          <div className="flex items-center gap-1 px-1 py-0.5 bg-gray-100 rounded-lg">
                            <Star className="w-2 h-2 fill-amber-500 text-amber-500" />
                            <span className="text-[9px] font-anton font-bold text-gray-500 translate-y-[0.5px]">{dish.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-2 md:mt-4 py-4 md:py-5 bg-black text-white rounded-[20px] md:rounded-[24px] font-anton font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 md:gap-3 transition-all hover:bg-gray-900 group-hover:scale-[0.98] text-xs md:text-base">
              Discover Menu
            </button>
          </div>
        </div>
      </div>
    </motion.article >
  );
}
