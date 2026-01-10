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
      className="relative mb-16 overflow-hidden flex flex-col md:block h-auto md:h-[700px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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

      {/* Image Section */}
      <div className="relative md:absolute inset-0 w-full h-[250px] md:h-full rounded-2xl md:rounded-none overflow-hidden" style={{ clipPath: 'none' }}>
        <div className="absolute inset-0 md:clip-path-[polygon(22%_0,100%_0,100%_100%,0_100%)] w-full h-full">
          <ImageWithFallback
            src={lead?.imageUrl || ''}
            alt={lead?.name || ''}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Green decorative strip - Desktop only */}
      <div
        className="hidden md:block absolute left-0 top-0 bottom-0"
        style={{ width: '140px', backgroundColor: '#B4BE3F', clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0 100%)' }}
      />

      {/* Content Section */}
      <div
        onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#ffffff', opacity: 1, scaleEnabled: true, scale: 1.12 })}
        className="relative md:absolute md:top-8 md:bottom-8 md:left-[140px] bg-white shadow-none md:shadow-xl p-6 md:p-8 cursor-pointer z-10 w-full md:w-[42%]"
        style={{
          clipPath: 'none'
        }}
      >
        {/* Desktop clip-path applied via inner div or conditional style to avoid messing up mobile layout? 
            Actually, we can just apply the style conditionally using a class or just inline style with media query? 
            Inline styles don't support media queries. 
            We can use a separate div for desktop styling or just accept that on mobile it's a block.
            Let's keep simpler structure.
        */}
        <div className="hidden md:block absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 86% 100%, 0 100%)', borderRadius: '12px', zIndex: -1 }}></div>

        <h2 className="text-[22px] font-bold text-[#222] leading-tight relative">{restaurant.name}</h2>
        <div className="mt-2 flex items-center gap-3 text-[12px] text-[#555] relative">
          {restaurant.address && <span>{restaurant.address}</span>}
          {typeof restaurant.rating === 'number' && (
            <span className="text-amber-600 font-semibold">{restaurant.rating.toFixed(1)}★</span>
          )}
        </div>
        {restaurant.description && (
          <p className="mt-3 text-[13px] text-[#4A4A4A] leading-relaxed relative">{restaurant.description}</p>
        )}
        <div className="mt-6 space-y-4 relative">
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