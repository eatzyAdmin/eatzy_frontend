import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { ImageWithFallback } from '@repo/ui';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ChevronRight, Star } from '@repo/ui/icons';

export default function MagazineLayout12({ restaurant, dishes }: { restaurant: Restaurant; dishes: Dish[]; menuCategories: MenuCategory[]; }) {
  const displayDishes = dishes.slice(0, 3);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.section
      className="relative w-full h-[600px] md:h-[800px] overflow-hidden mb-16 md:mb-32 rounded-[40px] md:rounded-[60px] shadow-2xl bg-black group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Full-bleed Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600'}
          alt={restaurant.name}
          fill
          placeholderMode="horizontal"
          className="object-cover opacity-60 transition-transform duration-[3s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Large Central Hero Title */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-anton text-[clamp(60px,18vw,220px)] font-bold text-white/10 uppercase tracking-[0.2em] absolute pointer-events-none select-none"
        >
          {restaurant.name.split(' ')[0]}
        </motion.h2>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-anton text-[clamp(40px,10vw,120px)] font-bold text-white uppercase tracking-tighter mb-12 drop-shadow-2xl z-20"
        >
          {restaurant.name}
        </motion.h2>

        {/* Ruler/Indicator Line */}
        <div className="w-full max-w-7xl h-px bg-white/30 relative mb-16 flex justify-between px-4 z-20">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className={`w-px ${i % 4 === 0 ? 'h-4 -translate-y-2 bg-white' : 'h-2 -translate-y-0.5 bg-white/40'} ${i === 24 ? 'h-8 -translate-y-4 bg-amber-500 w-[2px]' : ''}`}
            />
          ))}
        </div>

        {/* Dish Cards Slider Feel */}
        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
          className="relative w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-end cursor-pointer px-4"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />

          {displayDishes.map((dish, idx) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1, duration: 0.6 }}
              onMouseEnter={(e) => moveHighlight(e, { borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)', opacity: 1, scaleEnabled: true, scale: 1.05 })}
              className={`relative z-10 flex flex-col ${idx === 1 ? 'z-20 md:scale-110' : 'opacity-40 hover:opacity-100 transition-opacity'}`}
            >
              <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border border-white/10 mb-6 bg-zinc-800">
                <ImageWithFallback
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  placeholderMode="horizontal"
                  className="object-cover"
                />
                {/* Center dish gets a label */}
                {idx === 1 && (
                  <div className="absolute top-6 left-6 bg-amber-500 text-black px-4 py-1.5 rounded-full text-[10px] font-anton font-bold uppercase tracking-widest flex items-center gap-2">
                    <Star className="w-3 h-3 fill-black text-black" />
                    Signature
                  </div>
                )}
              </div>

              {idx === 1 && (
                <div className="px-2 text-white">
                  <h3 className="font-anton text-2xl md:text-3xl font-bold uppercase tracking-tight mb-2">
                    {dish.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium italic line-clamp-1 mb-4">
                    {dish.description}
                  </p>
                  <div className="flex items-center gap-3 group/btn">
                    <span className="text-xs font-anton font-bold text-white uppercase tracking-[0.2em] border-b border-white pb-1 group-hover/btn:border-amber-500 group-hover/btn:text-amber-500 transition-colors">
                      KHÁM PHÁ
                    </span>
                    <ChevronRight className="w-4 h-4 text-white group-hover/btn:text-amber-500 transition-colors" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Side Navigation Indicators (Visual only as per design) */}
      <div className="absolute bottom-12 left-12 hidden md:flex items-center gap-4 z-30">
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
          <ChevronRight className="w-6 h-6 rotate-180 text-white" />
        </div>
      </div>
      <div className="absolute bottom-12 right-12 hidden md:flex items-center gap-4 z-30">
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
          <ChevronRight className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.section>
  );
}
