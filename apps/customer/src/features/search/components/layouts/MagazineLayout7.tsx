import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { ImageWithFallback } from '@repo/ui';
import { Star } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function MagazineLayout7({ restaurant, dishes }: { restaurant: Restaurant; dishes: Dish[]; menuCategories: MenuCategory[]; }) {
  const cols = dishes.slice(0, 3);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.section
      className="bg-[#fafafa] overflow-hidden shadow-2xl mb-16 md:mb-32 rounded-[40px] border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="p-8 md:p-16">
        {/* Header - Modern Editorial Style */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 border-b-[3px] border-black pb-10">
          <div className="flex flex-col">
            <div className="text-[10px] font-anton font-bold text-amber-600 uppercase tracking-[0.5em] mb-3">Contemporary Series</div>
            <h2 className="text-5xl md:text-8xl font-anton font-bold text-black uppercase tracking-tighter leading-[0.85]">
              {restaurant.name}
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-2xl transform hover:scale-105 transition-transform">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="font-anton text-2xl font-bold translate-y-[2px]">{restaurant.rating}</span>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-400 max-w-[200px] text-right italic font-serif">
              &quot;{restaurant.description}&quot;
            </p>
          </div>
        </div>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
          className="relative grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12 cursor-pointer"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />
          {cols.map((dish, index) => (
            <motion.div
              key={dish.id}
              onMouseEnter={(e) => moveHighlight(e, { borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.02, paddingX: 12, paddingY: 8 })}
              className="flex flex-col items-center relative z-10 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="w-full mb-4 md:mb-8 relative">
                <div className="relative overflow-hidden rounded-[24px] md:rounded-[40px] shadow-2xl aspect-[3/4] bg-gray-100">
                  <ImageWithFallback
                    src={dish.imageUrl}
                    alt={dish.name}
                    fill
                    placeholderMode="horizontal"
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  {/* Floating Price Badge - Glassmorphism */}
                  <div className="absolute top-3 right-3 md:top-6 md:right-6 bg-white/90 backdrop-blur-xl px-3 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl shadow-xl border border-white/40">
                    <span className="font-anton text-base md:text-xl text-black">{(dish.price / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>

              {/* Text Content - Refined Block */}
              <div className="w-full px-2 md:px-6 text-center transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="text-[8px] md:text-[10px] font-anton font-bold text-gray-300 uppercase tracking-widest mb-1 md:mb-2">Plate {String(index + 1).padStart(2, '0')}</div>
                <h3 className="text-base md:text-2xl font-anton font-bold text-black mb-1.5 md:mb-3 uppercase tracking-tight leading-none line-clamp-1">
                  {dish.name}
                </h3>
                <p className="hidden md:block text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 italic">
                  {dish.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-20 pt-10 border-t border-gray-100">
          <div className="text-[10px] font-anton font-bold text-gray-300 uppercase tracking-[0.3em]">
            Eatzy Gourmet Selection © 2024
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-8 h-1 rounded-full ${i === 1 ? 'bg-black' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}