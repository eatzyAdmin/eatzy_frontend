import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { ImageWithFallback } from '@repo/ui';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { Star } from '@repo/ui/icons';

export default function MagazineLayout9({ restaurant, dishes, menuCategories }: { restaurant: Restaurant; dishes: Dish[]; menuCategories: MenuCategory[]; }) {
  const lead = dishes[0];
  const others = dishes.slice(1, 4);
  const catMap = Object.fromEntries((menuCategories || []).map((c) => [c.id, c.name]));
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.section
      className="relative mb-16 md:mb-24 overflow-hidden rounded-[40px] shadow-2xl bg-white border border-gray-100 h-auto md:h-[800px]"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
        className="absolute inset-0 cursor-pointer z-20"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />
      </div>

      {/* Image Section - Diagonal Split */}
      <div className="relative md:absolute inset-0 w-full h-[300px] md:h-full overflow-hidden">
        <div className="absolute inset-0 md:clip-path-[polygon(30%_0,100%_0,100%_100%,0_100%)] w-full h-full bg-gray-100">
          <ImageWithFallback
            src={lead?.imageUrl || ''}
            alt={lead?.name || ''}
            fill
            placeholderMode="horizontal"
            className="object-cover transition-transform duration-[3s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent hidden md:block" />
        </div>
      </div>

      {/* Luxury Decorative Block - Emerald/Gold */}
      <div
        className="hidden md:block absolute left-0 top-0 bottom-0"
        style={{ width: '180px', background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0 100%)' }}
      >
        <div className="flex flex-col h-full items-center justify-center p-8">
          <div className="text-[10px] font-anton font-bold text-amber-500 uppercase tracking-[0.5em] rotate-180 mb-12" style={{ writingMode: 'vertical-rl' }}>
            Premium Tasting Series
          </div>
          <div className="w-px h-24 bg-amber-500/30 mb-8" />
          <div className="bg-amber-500 text-black font-anton text-2xl p-4 rounded-2xl shadow-2xl">
            {restaurant.rating}
          </div>
        </div>
      </div>

      {/* Content Section - High End Floating Card */}
      <div
        className="relative md:absolute md:top-12 md:bottom-12 md:left-[180px] bg-white/95 backdrop-blur-xl md:shadow-2xl p-8 md:p-14 z-10 w-full md:w-[450px] lg:w-[45%] md:rounded-[40px] border-y md:border border-gray-100 flex flex-col"
      >
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-1 bg-black" />
            <span className="text-[10px] font-anton font-bold text-amber-600 uppercase tracking-[0.3em]">Restaurant Feature</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-anton font-bold text-black leading-none uppercase tracking-tighter mb-4">{restaurant.name}</h2>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500 italic pb-4 border-b border-gray-100">
            {restaurant.address && <span className="flex-1 line-clamp-1">{restaurant.address}</span>}
          </div>
        </div>

        {restaurant.description && (
          <p className="mb-8 text-lg text-gray-400 font-medium leading-relaxed italic line-clamp-2">
            &quot;{restaurant.description}&quot;
          </p>
        )}

        <div className="space-y-10 flex-1">
          {others.map((d, idx) => (
            <div key={d.id} onMouseEnter={(e) => moveHighlight(e, { borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05 })} className="flex items-start gap-4 md:gap-6 relative z-10 cursor-pointer group/item">
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded-[24px] shadow-sm border border-gray-100 bg-gray-50 mt-1">
                <ImageWithFallback
                  src={d.imageUrl}
                  alt={d.name}
                  fill
                  placeholderMode="horizontal"
                  className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl md:text-2xl font-anton font-bold text-black uppercase tracking-tight group-hover/item:text-amber-600 transition-colors leading-none">{d.name}</h3>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 md:max-w-[280px]">
                  {d.description}
                </p>
                <div className="text-[10px] text-gray-400 font-anton uppercase tracking-widest mt-2">{catMap[d.menuCategoryId] || 'Main Plate'}</div>
              </div>
              <div className="text-2xl font-anton font-bold text-black ml-4">{(d.price / 1000).toFixed(0)}K</div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}