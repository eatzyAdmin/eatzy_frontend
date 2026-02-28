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

// Layout 5: Full-bleed spread with overlapping elements
export default function MagazineLayout5({ restaurant, dishes }: Props) {
  const mainDish = dishes[0];
  const spotlightDishes = dishes.slice(1, 3);
  const sidebarDishes = dishes.slice(3, 5);
  const bottomDishes = dishes.slice(5, 9);
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
      className="mb-16 md:mb-32 px-4"
    >
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
        className="relative max-w-[1240px] mx-auto cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />

        {/* Page title block - More compact and integrated */}
        <div className="bg-black text-white px-8 py-8 md:px-14 md:py-10 mb-12 rounded-[36px] shadow-2xl relative overflow-hidden group/header border border-white/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover/header:bg-white/10 transition-colors duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="text-[9px] md:text-[11px] uppercase font-anton font-bold tracking-[0.4em] text-gray-500 mb-4 flex items-center gap-3">
                <span className="w-10 h-px bg-gray-800" />
                Featured Selection
              </div>
              <h2 className="text-4xl md:text-6xl font-anton font-bold leading-[0.85] tracking-tighter uppercase mb-4">
                {restaurant.name}
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl line-clamp-2 opacity-80 italic">
                {restaurant.description}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 bg-white/5 backdrop-blur-md p-4 md:p-5 rounded-[24px] border border-white/10 min-w-[100px] md:min-w-[120px]">
              <Star className="w-5 md:w-6 h-5 md:h-6 fill-amber-400 text-amber-400" />
              <span className="text-2xl md:text-3xl font-anton font-bold leading-none translate-y-[2px]">{restaurant.rating}</span>
              <span className="text-[8px] uppercase font-anton tracking-[0.2em] opacity-30">Verified</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
          {/* Main column (2/3) */}
          <div className="col-span-1 md:col-span-2 space-y-24 md:space-y-32">
            {/* Hero dish */}
            <div
              onMouseEnter={(e) => moveHighlight(e, { borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.02 })}
              className="relative group/main"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[40px] shadow-2xl bg-gray-100">
                <ImageWithFallback
                  src={mainDish.imageUrl}
                  alt={mainDish.name}
                  fill
                  placeholderMode="horizontal"
                  className="object-cover transition-transform duration-[2s] group-hover/main:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent opacity-0 group-hover/main:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Overlapping label - Liquid Glass style - Restored original look */}
              <div className="absolute -bottom-10 left-10 right-10 md:right-auto bg-white/90 backdrop-blur-2xl px-10 py-8 rounded-[32px] shadow-2xl border border-white/40 max-w-xl transform -rotate-1 transition-transform group-hover/main:rotate-0 duration-700">
                <div className="text-[10px] font-anton font-bold text-amber-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-amber-500" />
                  Hero Plate
                </div>
                <h3 className="text-3xl md:text-4xl font-anton font-bold mb-4 uppercase tracking-tight text-black">
                  {mainDish.name}
                </h3>
                <div className="flex items-center gap-8">
                  <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed flex-1 line-clamp-2">{mainDish.description}</p>
                  <div className="flex flex-col items-end">
                    <span className="text-4xl font-anton font-bold text-black leading-none">
                      {(mainDish.price / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spotlight sub-grid (replacing info blocks) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
              {spotlightDishes.map((dish, idx) => (
                <div
                  key={dish.id}
                  onMouseEnter={(e) => moveHighlight(e, { borderRadius: 36, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05, paddingX: 10, paddingY: 6 })}
                  className="flex flex-col rounded-[36px] p-2 relative group/spotlight"
                >
                  <div className="relative aspect-square rounded-[28px] overflow-hidden mb-6 shadow-xl">
                    <ImageWithFallback src={dish.imageUrl} alt={dish.name} fill placeholderMode="horizontal" className="object-cover transition-transform duration-[1.5s] group-hover/spotlight:scale-110" />
                    <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-anton leading-none border border-white/20">
                      {(dish.price / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="text-[9px] uppercase font-anton font-bold tracking-[0.3em] text-amber-600 mb-2">Editor&apos;s Pick {idx + 1}</div>
                    <h4 className="text-2xl font-anton font-bold text-black uppercase mb-3 line-clamp-1 group-hover/spotlight:text-amber-600 transition-colors">
                      {dish.name}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar column */}
          <div className="grid grid-cols-2 gap-6 md:block md:space-y-12">
            <div className="col-span-2 md:col-span-1 bg-amber-50/40 backdrop-blur-md p-8 rounded-[36px] border border-amber-100/50">
              <div className="text-[10px] uppercase font-anton font-bold tracking-[0.4em] text-amber-700 mb-4">Masterclass Details</div>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Handpicked by our curators for their exceptional balance of seasonal flavors and artistic presentation.
              </p>
            </div>

            {sidebarDishes.map((dish, idx) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05 })}
                className="relative z-10 group"
              >
                <div className="relative aspect-square overflow-hidden mb-4 rounded-[32px] shadow-lg border border-gray-100 bg-white">
                  <ImageWithFallback
                    src={dish.imageUrl}
                    alt={dish.name}
                    fill
                    placeholderMode="horizontal"
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="font-anton text-sm text-white">{(dish.price / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <h4 className="font-anton font-bold text-lg md:text-xl text-black uppercase tracking-tight line-clamp-1 px-2">{dish.name}</h4>
                <div className="flex items-center justify-between mt-1 px-2">
                  <span className="hidden md:block text-gray-400 text-[10px] font-bold uppercase tracking-widest line-clamp-1">Discover more</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom grid (remaining side dishes) - Responsive layout based on count */}
        {bottomDishes.length > 1 && (
          <div
            className={`
              grid gap-8 md:gap-12 mt-32 pt-16 border-t-[4px] border-black
              grid-cols-2 
              ${bottomDishes.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : ''}
              ${bottomDishes.length === 3 ? 'md:grid-cols-3' : ''}
              ${bottomDishes.length === 4 ? 'md:grid-cols-4' : ''}
            `}
          >
            {bottomDishes.map((dish, idx) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05 })}
                className="group cursor-pointer relative z-10"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6 rounded-[24px] shadow-lg border border-gray-100 bg-white">
                  <ImageWithFallback
                    src={dish.imageUrl}
                    alt={dish.name}
                    fill
                    placeholderMode="horizontal"
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col gap-1 px-2">
                  <div className="text-[10px] font-anton font-bold text-gray-300 uppercase tracking-widest">
                    Series {String(idx + 3).padStart(2, '0')}
                  </div>
                  <h4 className="font-anton font-bold text-lg md:text-xl text-black uppercase tracking-tight line-clamp-2 leading-none">{dish.name}</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-anton font-bold text-amber-600">
                      {(dish.price / 1000).toFixed(0)}K
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      <Star className="w-3 h-3 text-black fill-current" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
