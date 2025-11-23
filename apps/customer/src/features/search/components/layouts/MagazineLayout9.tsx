import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { ImageWithFallback } from '@repo/ui';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

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
      className="relative mb-16 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ height: '700px' }}
    >
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
        className="absolute inset-0 cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />
      </div>
      <div className="absolute inset-0" style={{ clipPath: 'polygon(22% 0, 100% 0, 100% 100%, 0 100%)' }}>
        <ImageWithFallback
          src={lead?.imageUrl || ''}
          alt={lead?.name || ''}
          fill
          className="object-cover"
        />
      </div>

      <div 
        className="absolute left-0 top-0 bottom-0"
        style={{ width: '140px', backgroundColor: '#B4BE3F', clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0 100%)' }}
      />

      <div 
        onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#ffffff', opacity: 1, scaleEnabled: true, scale: 1.12 })}
        className="absolute top-8 bottom-8 left-[140px] bg-white shadow-xl p-8 cursor-pointer"
        style={{ width: '42%', clipPath: 'polygon(0 0, 100% 0, 86% 100%, 0 100%)', borderRadius: '12px' }}
      >
        <h2 className="text-[22px] font-bold text-[#222] leading-tight">{restaurant.name}</h2>
        <div className="mt-2 flex items-center gap-3 text-[12px] text-[#555]">
          {restaurant.address && <span>{restaurant.address}</span>}
          {typeof restaurant.rating === 'number' && (
            <span className="text-amber-600 font-semibold">{restaurant.rating.toFixed(1)}★</span>
          )}
        </div>
        {restaurant.description && (
          <p className="mt-3 text-[13px] text-[#4A4A4A] leading-relaxed">{restaurant.description}</p>
        )}
        <div className="mt-6 space-y-4">
          {others.map((d) => (
            <div key={d.id} onMouseEnter={(e) => moveHighlight(e, { borderRadius: 8, backgroundColor: '#f7f7f7', opacity: 1, scaleEnabled: true, scale: 1.12 })} className="flex items-start justify-between relative z-10 cursor-pointer">
              <div>
                <h3 className="text-[16px] font-semibold text-[#222]">{d.name}</h3>
                <p className="text-[13px] text-[#666] leading-relaxed line-clamp-2">{d.description}</p>
                <div className="text-[12px] text-[#888] mt-1">{catMap[d.menuCategoryId]}</div>
              </div>
              <div className="text-amber-600 font-bold">{(d.price / 1000).toFixed(0)}K</div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}