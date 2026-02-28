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

// Layout 3: "Look At This Plate" feature style
export default function MagazineLayout3({ restaurant, dishes, menuCategories }: Props) {
  const hero = dishes[0];
  const secondary = dishes.slice(1, 4);
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
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
        className="relative max-w-[1240px] mx-auto cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Left: Editorial text */}
          <div className="col-span-1 md:col-span-5 flex flex-col justify-center">
            <div className="text-[10px] text-amber-600 font-anton font-bold uppercase tracking-[0.4em] mb-10 flex items-center">
              <span className="inline-block w-12 h-[2px] bg-amber-500 mr-4" />
              Signature Showcase
            </div>

            <h2 className="text-4xl md:text-9xl font-anton font-bold leading-[0.85] tracking-tighter mb-8 md:mb-10 text-black uppercase">
              LOOK<br />
              AT THIS<br />
              <span className="text-amber-500 italic font-medium">PLATE.</span>
            </h2>

            <div className="mb-10 relative">
              <div className="flex items-center gap-4 mb-3">
                <h3 className="text-2xl md:text-4xl font-anton font-bold text-black uppercase tracking-tight">{restaurant.name}</h3>
                <div className="px-3 py-1 bg-black text-white rounded-xl flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-anton text-lg leading-none translate-y-[2px]">{restaurant.rating}</span>
                </div>
              </div>
              <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-sm">
                {restaurant.description}
              </p>
            </div>

            {/* Quote callout - Premium Glassmorphism */}
            <div className="relative p-6 md:p-8 rounded-[32px] bg-gray-50/50 backdrop-blur-xl border border-gray-100 overflow-hidden group/quote">
              <div className="absolute top-0 left-0 w-2 h-full bg-black group-hover/quote:w-4 transition-all" />
              <p className="text-sm md:text-base italic text-gray-800 font-medium leading-relaxed">
                &quot;{menuCategories[0]?.name || 'Signature dishes'} that define culinary excellence in every single bite.&quot;
              </p>
            </div>
          </div>

          <div onMouseEnter={(e) => moveHighlight(e, { borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.02 })} className="col-span-1 md:col-span-7 relative z-10">
            <div className="relative aspect-[3/4] overflow-hidden mb-8 rounded-[40px] shadow-2xl bg-gray-100 group">
              <ImageWithFallback
                src={hero.imageUrl}
                alt={hero.name}
                fill
                placeholderMode="horizontal"
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Floating Price Badge */}
              <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-[10px] font-anton font-bold text-amber-600 uppercase tracking-widest mb-1 block">Hero Dish</span>
                    <h3 className="text-2xl md:text-4xl font-anton font-bold text-black uppercase tracking-tight">
                      {hero.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-anton font-bold text-black leading-none">
                      {(hero.price / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">
                  {hero.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row - secondary dishes */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 mt-16 pt-16 border-t-[3px] border-black">
          {secondary.map((dish, idx) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05 })}
              className="relative z-10 group"
            >
              <div className="relative aspect-square overflow-hidden mb-6 rounded-[32px] shadow-lg border border-gray-100 bg-white">
                <ImageWithFallback
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  placeholderMode="horizontal"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl">
                  <span className="font-anton text-sm text-white">{(dish.price / 1000).toFixed(0)}K</span>
                </div>
              </div>
              <h4 className="font-anton font-bold text-lg md:text-2xl text-black uppercase tracking-tight mb-2 px-2">{dish.name}</h4>
              <p className="hidden md:block text-gray-500 text-sm font-medium leading-relaxed line-clamp-2 px-2">
                {dish.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
