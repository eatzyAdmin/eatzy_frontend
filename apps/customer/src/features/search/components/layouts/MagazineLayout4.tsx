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

// Layout 4: Table of Contents style with dish listings
export default function MagazineLayout4({ restaurant, dishes, menuCategories }: Props) {
  const firstCategory = menuCategories[0];
  const secondCategory = menuCategories[1];
  const cat1Dishes = dishes.filter(d => d.menuCategoryId === firstCategory?.id).slice(0, 4);
  const cat2Dishes = dishes.filter(d => d.menuCategoryId === secondCategory?.id).slice(0, 4);
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
        {/* Header */}
        <div className="text-center mb-12 pb-8 border-b-2 border-gray-900">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Menu Selection</div>
          <h2 className="text-6xl font-black mb-4" style={{ fontFamily: 'serif' }}>
            {restaurant.name}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span className="text-xl font-bold">{restaurant.rating}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600">{restaurant.address}</span>
          </div>
        </div>

        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          {restaurant.description}
        </p>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
          className="relative grid grid-cols-2 gap-16 cursor-pointer"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />
          {/* First category */}
          {firstCategory && (
            <div>
              <div className="mb-8">
                <h3 className="text-4xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                  {firstCategory.name}
                </h3>
                <div className="w-16 h-1 bg-amber-500" />
              </div>
              
              <div className="space-y-6">
                {cat1Dishes.map((dish, idx) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    onMouseEnter={(e) => moveHighlight(e, { borderRadius: 10, backgroundColor: '#f0eadf', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                    className="flex gap-4 group cursor-pointer relative z-10"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
                      <ImageWithFallback 
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-gray-900">{dish.name}</h4>
                        <span className="text-amber-600 font-bold ml-3">
                          {(dish.price / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {dish.description}
                      </p>
                      {dish.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-gray-500">{dish.rating}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Second category */}
          {secondCategory && (
            <div>
              <div className="mb-8">
                <h3 className="text-4xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                  {secondCategory.name}
                </h3>
                <div className="w-16 h-1 bg-amber-500" />
              </div>
              
              <div className="space-y-6">
                {cat2Dishes.map((dish, idx) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    onMouseEnter={(e) => moveHighlight(e, { borderRadius: 10, backgroundColor: '#f6f1e7', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                    className="flex gap-4 group cursor-pointer relative z-10"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
                      <ImageWithFallback 
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-gray-900">{dish.name}</h4>
                        <span className="text-amber-600 font-bold ml-3">
                          {(dish.price / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {dish.description}
                      </p>
                      {dish.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-gray-500">{dish.rating}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
