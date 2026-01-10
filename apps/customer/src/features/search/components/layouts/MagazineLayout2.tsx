import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { Star } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { ImageWithFallback } from '@repo/ui';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  restaurant: Restaurant;
  dishes: Dish[];
  menuCategories: MenuCategory[];
}

// Layout 2: Multi-column editorial with asymmetric grid
export default function MagazineLayout2({ restaurant, dishes }: Props) {
  const leftDishes = dishes.slice(0, 3);
  const rightDishes = dishes.slice(3, 6);
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
      className="mb-16 px-4"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Page header */}
        <div className="flex items-baseline gap-4 mb-8">
          <div className="text-5xl md:text-8xl font-black text-gray-100" style={{ fontFamily: 'serif' }}>
            {Math.floor(Math.random() * 99) + 1}
          </div>
          <div className="flex-1">
            <div className="h-px bg-gray-200 mb-2" />
            <div className="text-xs text-gray-400 uppercase tracking-widest">Featured Restaurant</div>
          </div>
        </div>

        {/* Restaurant info bar */}
        <div className="bg-gray-50 px-4 py-4 md:px-8 md:py-6 mb-8 md:mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                {restaurant.name}
              </h2>
              <p className="text-gray-600 max-w-2xl leading-relaxed">
                {restaurant.description}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-4 md:ml-0">
              <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
              <span className="text-xl md:text-3xl font-bold">{restaurant.rating}</span>
            </div>
          </div>
        </div>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
          className="relative grid grid-cols-2 gap-3 md:gap-12 cursor-pointer"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />
          {/* Left column */}
          <div className="space-y-6 md:space-y-10">
            {leftDishes.map((dish, idx) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f6f1e7', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                className="relative z-10 cursor-pointer"
              >
                <div className="relative aspect-[3/2] overflow-hidden mb-3 md:mb-4 rounded-2xl">
                  <ImageWithFallback
                    src={dish.imageUrl}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div className="flex-1">
                    <div className="hidden md:block text-xs text-gray-400 uppercase tracking-wider mb-1">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-sm md:text-2xl font-bold mb-1 md:mb-2 line-clamp-1 md:line-clamp-none" style={{ fontFamily: 'serif' }}>
                      {dish.name}
                    </h3>
                    <p className="hidden md:block text-sm text-gray-600 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                  <div className="text-sm md:text-xl font-bold text-amber-600 md:ml-4">
                    {(dish.price / 1000).toFixed(0)}K
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-6 md:space-y-10 pt-8 md:pt-16">
            {rightDishes.map((dish, idx) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx + 3) * 0.15 }}
                viewport={{ once: true }}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f3ede4', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                className="relative z-10 cursor-pointer"
              >
                <div className="relative aspect-[3/2] overflow-hidden mb-3 md:mb-4 rounded-2xl">
                  <ImageWithFallback
                    src={dish.imageUrl}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div className="flex-1">
                    <div className="hidden md:block text-xs text-gray-400 uppercase tracking-wider mb-1">
                      {String(idx + 4).padStart(2, '0')}
                    </div>
                    <h3 className="text-sm md:text-2xl font-bold mb-1 md:mb-2 line-clamp-1 md:line-clamp-none" style={{ fontFamily: 'serif' }}>
                      {dish.name}
                    </h3>
                    <p className="hidden md:block text-sm text-gray-600 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                  <div className="text-sm md:text-xl font-bold text-amber-600 md:ml-4">
                    {(dish.price / 1000).toFixed(0)}K
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
