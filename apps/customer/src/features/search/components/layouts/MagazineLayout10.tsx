import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { ImageWithFallback } from '@repo/ui';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { Star } from '@repo/ui/icons';

export default function MagazineLayout10({ restaurant, dishes }: { restaurant: Restaurant; dishes: Dish[]; menuCategories: MenuCategory[]; }) {
  const top = dishes.slice(0, 4);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-16 md:mb-32"
    >
      <div className="relative flex flex-col md:block h-auto md:h-[500px] overflow-hidden rounded-[40px] shadow-2xl border-[3px] border-black group/hero">
        <div className="relative w-full h-[300px] md:absolute md:inset-0 md:h-full overflow-hidden">
          <ImageWithFallback
            src={restaurant.imageUrl ?? 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'}
            alt={restaurant.name}
            fill
            placeholderMode="horizontal"
            className="object-cover transition-transform duration-[3s] group-hover/hero:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden md:block" />
        </div>

        {/* Overlay Card - Ultra Modern block style */}
        <div className="relative w-full bg-white p-8 md:absolute md:inset-y-0 md:left-0 md:w-3/5 lg:w-2/5 md:bg-white/95 md:backdrop-blur-xl md:p-14 md:clip-path-[polygon(0_0,100%_0,88%_100%,0_100%)] flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-black" />
            <span className="text-[10px] font-anton font-bold text-amber-600 uppercase tracking-[0.4em]">Editorial Pick</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-anton font-bold text-black uppercase tracking-tighter leading-none mb-6">{restaurant.name}</h2>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-anton text-xl leading-none translate-y-[2px]">{restaurant.rating}</span>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <span className="text-sm font-medium text-gray-400 italic line-clamp-1">{restaurant.address}</span>
          </div>
          <p className="text-gray-500 text-lg font-medium leading-relaxed italic max-w-sm">
            &quot;{restaurant.description}&quot;
          </p>
        </div>
      </div>

      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
        className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-12 cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />
        {top.map((d, idx) => (
          <div
            key={d.id}
            onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05 })}
            className="group relative z-10 flex flex-col"
          >
            <div className="relative aspect-square overflow-hidden rounded-[32px] shadow-lg border border-gray-100 bg-white">
              <ImageWithFallback
                src={d.imageUrl}
                alt={d.name}
                fill
                placeholderMode="horizontal"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <span className="font-anton text-sm text-white">{(d.price / 1000).toFixed(0)}K</span>
              </div>
            </div>
            <div className="mt-6 px-2">
              <div className="text-[10px] font-anton font-bold text-gray-300 uppercase tracking-widest mb-1">Series 10-0{idx + 1}</div>
              <h3 className="text-xl font-anton font-bold text-black uppercase tracking-tight leading-none group-hover:text-amber-600 transition-colors mb-2">{d.name}</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-2 md:max-w-[200px]">{d.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}