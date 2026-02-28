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
  distance?: number;
}

// Layout 4: Table of Contents style with dish listings
export default function MagazineLayout4({ restaurant, dishes, menuCategories }: Props) {
  const firstCategory = menuCategories[0];
  const secondCategory = menuCategories[1];

  // Logic to balance the two sections (diff <= 1)
  let cat1Dishes = dishes.filter(d => d.menuCategoryId === firstCategory?.id).slice(0, 4);
  let cat2Dishes = dishes.filter(d => d.menuCategoryId === secondCategory?.id).slice(0, 4);

  // If we have two categories, balance them (diff <= 2)
  if (firstCategory && secondCategory) {
    const diff = cat1Dishes.length - cat2Dishes.length;
    if (diff > 2) {
      cat1Dishes = cat1Dishes.slice(0, cat2Dishes.length + 2);
    } else if (diff < -2) {
      cat2Dishes = cat2Dishes.slice(0, cat1Dishes.length + 2);
    }
  } else if (firstCategory && dishes.length > 1) {
    // If only one category, split all dishes for that category into two sections
    const all = dishes.filter(d => d.menuCategoryId === firstCategory.id).slice(0, 8);
    const mid = Math.ceil(all.length / 2);
    cat1Dishes = all.slice(0, mid);
    cat2Dishes = all.slice(mid);
  }
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
      className="mb-12 md:mb-24 px-4"
    >
      <div className="max-w-[1240px] mx-auto">
        {/* Header - Modern High Fashion Look - Compacted */}
        <div className="text-center mb-10 md:mb-14 relative">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-black" />
          <div className="pt-8 mb-6">
            <div className="text-[9px] md:text-[10px] text-amber-600 font-anton font-bold uppercase tracking-[0.6em] mb-4">Contemporary Dining Selection</div>
            <h2 className="text-4xl md:text-7xl font-anton font-bold mb-6 uppercase tracking-tighter text-black leading-[0.85]">
              {restaurant.name}
            </h2>
            <div className="flex items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xl font-anton font-bold translate-y-[1.5px]">{restaurant.rating}</span>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-xs md:text-sm font-medium text-gray-500 max-w-[250px] leading-tight text-left italic opacity-80">
                {restaurant.address}
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-black/5" />
        </div>

        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium italic">
            &quot;{restaurant.description}&quot;
          </p>
        </div>

        <div
          ref={setRefs}
          onMouseLeave={clearHover}
          onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
          className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 cursor-pointer"
        >
          <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
          <TapRippleOverlay ripple={ripple} />

          {/* First section */}
          {cat1Dishes.length > 0 && (
            <div className="relative">
              <div className="mb-12 border-l-[6px] border-black pl-8">
                <span className="text-[10px] font-anton font-bold text-gray-400 uppercase tracking-[0.3em] block mb-2">Section 01</span>
                <h3 className="text-4xl md:text-6xl font-anton font-bold mb-4 uppercase tracking-tighter text-black">
                  {firstCategory?.name || 'Highlights'}
                </h3>
              </div>

              <div className="space-y-10 md:space-y-12">
                {cat1Dishes.map((dish, idx) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.02, paddingX: 8, paddingY: 12 })}
                    className="flex flex-col sm:flex-row gap-6 group cursor-pointer relative z-10"
                  >
                    <div className="relative w-full sm:w-36 aspect-square sm:h-36 flex-shrink-0 overflow-hidden rounded-[32px] shadow-lg border border-gray-100 bg-white">
                      <ImageWithFallback
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        placeholderMode="horizontal"
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-1 sm:px-0 px-2 pb-4 sm:pb-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-anton font-bold text-2xl md:text-3xl text-black uppercase tracking-tight leading-none">{dish.name}</h4>
                        <div className="flex flex-col items-end">
                          <span className="font-anton text-2xl text-amber-600 leading-none">
                            {(dish.price / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-2 md:max-w-[280px]">
                        {dish.description}
                      </p>
                      {dish.rating && (
                        <div className="flex items-center gap-1.5 mt-2 bg-gray-50 self-start px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="text-[10px] font-anton font-bold text-gray-500 translate-y-[1px]">{dish.rating} Score</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Second section */}
          {cat2Dishes.length > 0 && (
            <div className="relative">
              <div className="mb-12 border-l-[6px] border-black pl-8">
                <span className="text-[10px] font-anton font-bold text-gray-400 uppercase tracking-[0.3em] block mb-2">Section 02</span>
                <h3 className="text-4xl md:text-6xl font-anton font-bold mb-4 uppercase tracking-tighter text-black">
                  {secondCategory?.name || firstCategory?.name || 'Selection'}
                </h3>
              </div>

              <div className="space-y-10 md:space-y-12">
                {cat2Dishes.map((dish, idx) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.02, paddingX: 8, paddingY: 12 })}
                    className="flex flex-col sm:flex-row gap-6 group cursor-pointer relative z-10"
                  >
                    <div className="relative w-full sm:w-36 aspect-square sm:h-36 flex-shrink-0 overflow-hidden rounded-[32px] shadow-lg border border-gray-100 bg-white">
                      <ImageWithFallback
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        placeholderMode="horizontal"
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-1 sm:px-0 px-2 pb-4 sm:pb-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-anton font-bold text-2xl md:text-3xl text-black uppercase tracking-tight leading-none">{dish.name}</h4>
                        <div className="flex flex-col items-end">
                          <span className="font-anton text-2xl text-amber-600 leading-none">
                            {(dish.price / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-2 md:max-w-[280px]">
                        {dish.description}
                      </p>
                      {dish.rating && (
                        <div className="flex items-center gap-1.5 mt-2 bg-gray-50 self-start px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="text-[10px] font-anton font-bold text-gray-500 translate-y-[1px]">{dish.rating} Score</span>
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
