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

// Layout 5: Full-bleed spread with overlapping elements
export default function MagazineLayout5({ restaurant, dishes }: Props) {
  const mainDish = dishes[0];
  const sideDishes = dishes.slice(1, 7);
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
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
        className="relative max-w-[1200px] mx-auto cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />
        {/* Page title block */}
        <div className="bg-gray-900 text-white px-12 py-8 mb-12">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                P.{Math.floor(Math.random() * 50) + 10}
              </div>
              <h2 className="text-6xl font-black leading-none" style={{ fontFamily: 'serif' }}>
                {restaurant.name}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-7 h-7 fill-amber-500 text-amber-500" />
              <span className="text-4xl font-bold">{restaurant.rating}</span>
            </div>
          </div>
          <p className="mt-4 text-gray-300 max-w-3xl leading-relaxed">
            {restaurant.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 items-start">
          {/* Featured dish - spans 2 columns */}
          <div onMouseEnter={(e) => moveHighlight(e, { borderRadius: 16, backgroundColor: '#f6f1e7', opacity: 1, scaleEnabled: true, scale: 1.12 })} className="col-span-2 relative z-10 cursor-pointer">
            <div className="relative">
              <div className="relative aspect-[16/10] overflow-hidden">
                <ImageWithFallback 
                  src={mainDish.imageUrl}
                  alt={mainDish.name}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Overlapping label */}
              <div className="absolute -bottom-6 left-8 bg-white px-8 py-4 shadow-xl">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Featured</div>
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                  {mainDish.name}
                </h3>
                <div className="flex items-center gap-6">
                  <p className="text-sm text-gray-600 flex-1">{mainDish.description}</p>
                  <span className="text-2xl font-bold text-amber-600">
                    {(mainDish.price / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-10 bg-amber-50 px-8 py-6 border-l-4 border-amber-400">
              <div className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-2">Editor&apos;s Column</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Seasonal highlights, chef&apos;s insights, and pairing notes curated by Eatzy Magazine.
              </p>
            </div>
          </div>

          {/* Side column */}
          <div className="space-y-8">
            <div className="bg-amber-50 p-6">
                      <div className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-3">
                        Chef&apos;s Pick
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Discover our carefully curated selection of signature dishes
                      </p>
                    </div>

            {sideDishes.slice(0, 2).map((dish, idx) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#f3ede4', opacity: 1, scaleEnabled: true, scale: 1.12 })}
                className="relative z-10 cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden mb-2">
                  <ImageWithFallback 
                    src={dish.imageUrl}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-bold mb-1">{dish.name}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 text-xs line-clamp-1">{dish.description}</span>
                  <span className="font-bold text-amber-600 ml-2">
                    {(dish.price / 1000).toFixed(0)}K
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-8">
          {sideDishes.slice(2, 6).map((dish, idx) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              viewport={{ once: true }}
              onMouseEnter={(e) => moveHighlight(e, { borderRadius: 10, backgroundColor: '#f0eadf', opacity: 1, scaleEnabled: true, scale: 1.12 })}
              className="group cursor-pointer relative z-10"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-3">
                <ImageWithFallback 
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                {String(idx + 3).padStart(2, '0')}
              </div>
              <h4 className="font-bold text-sm mb-1 line-clamp-2">{dish.name}</h4>
              <span className="text-amber-600 font-bold">
                {(dish.price / 1000).toFixed(0)}K
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
