import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { ImageWithFallback } from '@repo/ui';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function MagazineLayout10({ restaurant, dishes }: { restaurant: Restaurant; dishes: Dish[]; menuCategories: MenuCategory[]; }) {
  const top = dishes.slice(0, 4);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);
  return (
    <motion.section className="mb-16">
      <div className="relative h-[420px] overflow-hidden">
        <ImageWithFallback src={restaurant.imageUrl ?? 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'} alt={restaurant.name} fill className="object-cover" />
        <div className="absolute inset-y-0 left-0 w-2/5 bg-white/90 clip-path-[polygon(0_0,100%_0,85%_100%,0_100%)] p-8">
          <h2 className="text-3xl font-bold text-[#1d1d1d]">{restaurant.name}</h2>
          <p className="mt-3 text-[#555]">{restaurant.description}</p>
        </div>
      </div>
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
        className="relative grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />
        {top.map((d) => (
          <div key={d.id} onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f5efe6', opacity: 1, scaleEnabled: true, scale: 1.12 })} className="group bg-white hover:shadow-lg transition-shadow relative z-10 cursor-pointer">
            <div className="relative aspect-[4/3] overflow-hidden">
              <ImageWithFallback src={d.imageUrl} alt={d.name} fill className="object-cover" />
            </div>
            <div className="mt-2">
              <h3 className="text-[16px] font-semibold text-[#222] group-hover:underline">{d.name}</h3>
              <p className="text-[13px] text-[#666]">{d.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}