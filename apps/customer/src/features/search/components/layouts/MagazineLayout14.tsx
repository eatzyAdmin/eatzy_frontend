import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { ImageWithFallback, SkeletonAvatar } from '@repo/ui';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Heart, ShoppingCart, LayoutGrid, Home, Wand2, Bell } from '@repo/ui/icons';

export default function MagazineLayout14({ restaurant, dishes }: { restaurant: Restaurant; dishes: Dish[]; menuCategories: MenuCategory[]; }) {
  const displayDishes = dishes.slice(0, 4);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.section
      className="relative w-full max-w-[900px] mx-auto overflow-hidden mb-16 md:mb-32 rounded-[56px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] bg-[#0A0A0A] border border-white/5 group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
        className="relative p-6 md:p-10 cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />

        {/* Dynamic Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white tracking-tight">{restaurant.name}</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full border-2 border-[#0A0A0A]" />
            </div>
          </div>
        </div>

        {/* Tab Pill Selectors */}
        <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-2">
          <div className="px-6 py-3 bg-white text-black font-semibold rounded-full text-sm whitespace-nowrap">Recommended</div>
          <div className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all rounded-full text-sm whitespace-nowrap">Favorites</div>
          <div className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all rounded-full text-sm whitespace-nowrap">Recent</div>
        </div>

        {/* Main List Sections */}
        <div className="space-y-6">
          {displayDishes.map((dish, idx) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onMouseEnter={(e) => moveHighlight(e, { borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.04)', opacity: 1, scaleEnabled: true, scale: 1.02 })}
              className="relative z-10 flex items-center gap-6 p-4 rounded-[40px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all group/item"
            >
              <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 rounded-[32px] overflow-hidden shadow-2xl">
                <ImageWithFallback src={dish.imageUrl ?? ''} alt={dish.name} fill placeholderMode="horizontal" className="object-cover group-hover/item:scale-110 transition-transform duration-700" />
              </div>

              <div className="flex-1">
                <h4 className="text-lg md:text-2xl font-anton font-bold text-white uppercase tracking-tight mb-2 underline decoration-transparent group-hover/item:decoration-amber-500/50 transition-all underline-offset-4">
                  {dish.name}
                </h4>
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-500 mb-4 font-medium italic">
                  <span>Free Delivery</span>
                  <div className="w-1 h-1 rounded-full bg-gray-600" />
                  <span>{20 + idx * 5} Min</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-anton font-bold text-white">
                    ${(dish.price / 1000).toFixed(0)}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500 group/fav transition-all">
                    <Heart className="w-4 h-4 text-gray-400 group-hover/fav:text-black transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Floating Nav Mockup (Visual only) */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-6 p-4 px-8 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
            <Home className="w-6 h-6 text-gray-500" />
            <LayoutGrid className="w-6 h-6 text-gray-500" />
            <div className="relative">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <ShoppingCart className="w-6 h-6 text-black" />
              </div>
            </div>
            <Wand2 className="w-6 h-6 text-gray-500" />
            <SkeletonAvatar isLoading={false} size="sm" className="w-6 h-6 opacity-50" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
