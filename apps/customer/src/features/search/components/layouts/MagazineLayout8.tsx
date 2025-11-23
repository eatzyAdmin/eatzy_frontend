import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { ImageWithFallback } from '@repo/ui';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function MagazineLayout8({ restaurant, dishes }: { restaurant: Restaurant; dishes: Dish[]; menuCategories: MenuCategory[]; }) {
  const grid = dishes.slice(0, 4);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);
  
  return (
    <motion.section 
      className="overflow-hidden shadow-sm mb-16 p-12" 
      style={{ backgroundColor: '#F5E6D3' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center text-[#8B7355] mb-3 text-[11px] uppercase tracking-widest font-medium">
        <span>Food & Drinks</span>
        <span>Curated Selection</span>
      </div>
      
      {/* Main Title */}
      <div className="text-center mb-10">
        <h1 className="text-[42px] font-bold text-[#2C2416] tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          {restaurant.name}
        </h1>
      </div>

      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
        className="relative grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />
        {grid.map((dish, index) => (
          <motion.div 
            key={dish.id} 
            onMouseEnter={(e) => moveHighlight(e, { borderRadius: 24, backgroundColor: '#ffffff', opacity: 1, scaleEnabled: true, scale: 1.12 })}
            className="group relative z-10 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Dish Title */}
            <h3 className="text-[28px] font-semibold text-[#2C2416] mb-3 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
              {dish.name}
            </h3>
            
            {/* Star Rating */}
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-[#D4A574] text-[14px]">★</span>
              ))}
            </div>

            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-tr-[64px] rounded-bl-[64px] mb-4 bg-white shadow-md">
              <ImageWithFallback 
                src={dish.imageUrl} 
                alt={dish.name} 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Description */}
            <p className="text-[13px] leading-relaxed text-[#5A4A3A] font-light">
              {dish.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer Decoration */}
      <div className="mt-12 pt-8 border-t border-[#D4A574]/30 text-center">
        <p className="text-[11px] text-[#8B7355] uppercase tracking-widest">
          {restaurant.name} • {restaurant.address}
        </p>
      </div>
    </motion.section>
  );
}