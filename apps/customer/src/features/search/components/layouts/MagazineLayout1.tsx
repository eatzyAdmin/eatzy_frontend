import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { Star } from '@repo/ui/icons';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { ImageWithFallback } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  restaurant: Restaurant;
  dishes: Dish[];
  menuCategories: MenuCategory[];
}

// Layout 1: Editorial Hero - Large featured dish with editorial typography
export default function MagazineLayout1({ restaurant, dishes }: Props) {
  const featured = dishes[0];
  const sideDishes = dishes.slice(1, 5);
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
        {/* Magazine page indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs text-gray-400 font-mono">P.{Math.floor(Math.random() * 50) + 1}</div>
          <div className="h-px flex-1 mx-8 bg-gray-200" />
          <div className="text-xs text-gray-400 uppercase tracking-wider">{restaurant.categories[0]?.name}</div>
        </div>

        {/* Restaurant title - editorial style */}
        <div className="mb-12">
          <h2 className="text-7xl font-bold leading-none mb-4" style={{ fontFamily: 'serif' }}>
            {restaurant.name}
          </h2>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="font-semibold">{restaurant.rating}</span>
            </div>
            <span className="text-gray-300">|</span>
            <p className="max-w-2xl leading-relaxed">{restaurant.description}</p>
          </div>
        </div>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
          className="relative grid grid-cols-12 gap-8 cursor-pointer"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />
          {/* Large featured dish */}
          <div onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f5efe6', opacity: 1, scaleEnabled: true, scale: 1.12 })} className="col-span-8 relative z-10 cursor-pointer">
            <div className="relative aspect-[4/3] overflow-hidden mb-4">
              <ImageWithFallback 
                src={featured.imageUrl}
                alt={featured.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-4xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                  {featured.name}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                  {featured.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-amber-600">
                  {(featured.price / 1000).toFixed(0)}K
                </div>
                {featured.rating && (
                  <div className="text-sm text-gray-500 mt-1">★ {featured.rating}</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold border-b border-gray-200 pb-2">
              More Dishes
            </div>
            {sideDishes.map((dish, idx) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 10, backgroundColor: '#f0eadf', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                className="group cursor-pointer relative z-10"
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
                    <ImageWithFallback 
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">
                      {dish.name}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {dish.description}
                    </p>
                    <div className="text-sm font-bold text-amber-600">
                      {(dish.price / 1000).toFixed(0)}K
                    </div>
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
