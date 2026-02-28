import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { ImageWithFallback } from '@repo/ui';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function MagazineLayout6({ restaurant, dishes }: { restaurant: Restaurant; dishes: Dish[]; menuCategories: MenuCategory[]; }) {
  const items = dishes.slice(0, 10);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.section
      className="bg-white rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-[3px] border-black mb-16 md:mb-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
        className="relative flex flex-col md:flex-row min-h-auto md:min-h-[900px] cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />

        {/* Mobile Header (Horizontal) */}
        <div className="md:hidden w-full bg-black text-white p-8 flex items-center justify-between relative z-10 border-b-[3px] border-black">
          <h1 className="text-4xl font-anton font-bold uppercase tracking-tighter">{restaurant.name}</h1>
          <div className="bg-amber-500 text-black px-3 py-1 rounded-xl font-anton text-xl">{restaurant.rating}</div>
        </div>

        {/* Desktop Header (Vertical) - High Fashion Vertical Typography */}
        <div onMouseEnter={(e) => moveHighlight(e, { borderRadius: 0, backgroundColor: 'rgba(255,255,255,0.1)', opacity: 1 })} className="hidden md:flex w-[160px] bg-black text-white border-r-[3px] border-black items-start justify-center pt-12 pb-12 relative z-10">
          <div className="flex flex-col h-full items-center justify-between">
            <div className="bg-amber-500 text-black p-4 rounded-2xl rotate-90 transform -translate-y-4">
              <span className="font-anton text-3xl font-bold">{restaurant.rating}</span>
            </div>
            <h1
              className="text-[85px] font-anton font-bold leading-none tracking-tighter uppercase whitespace-nowrap"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
              }}
            >
              {restaurant.name}
            </h1>
            <div className="text-[10px] font-anton font-bold tracking-[0.5em] uppercase text-gray-500 py-4 rotate-180" style={{ writingMode: 'vertical-rl' }}>
              Established Presence
            </div>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Row 1 - Single large item */}
          <div onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.02 })} className="border-b-[3px] border-black p-6 md:p-12 flex-shrink-0 relative z-10">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 h-full min-h-auto md:min-h-[600px] items-start md:items-center">
              <div className="flex-1 order-2 md:order-1 flex flex-col gap-4 md:gap-6 w-full">
                <div className="flex items-start gap-4 md:gap-6">
                  <span className="text-5xl md:text-9xl font-anton font-bold text-amber-500 leading-none">01</span>
                  <div className="pt-2 md:pt-4">
                    <div className="text-[8px] md:text-[10px] font-anton font-bold text-gray-400 uppercase tracking-[0.4em] mb-2 md:mb-3">Master Plate Selection</div>
                    <h3 className="text-2xl md:text-6xl font-anton font-bold text-black uppercase tracking-tighter mb-3 md:mb-4 leading-tight">{items[0]?.name}</h3>
                    <p className="text-base md:text-xl text-gray-500 font-medium leading-relaxed max-w-md line-clamp-2 md:line-clamp-3 italic">
                      &quot;{items[0]?.description}&quot;
                    </p>
                    <div className="mt-6 md:mt-8">
                      <span className="px-6 py-2 md:px-8 md:py-3 bg-black text-white font-anton text-lg md:text-2xl rounded-xl md:rounded-2xl uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 block w-fit">
                        Explore Now
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex-shrink-0 w-full md:w-[60%] aspect-[16/10] md:aspect-[4/3] order-1 md:order-2 overflow-hidden rounded-[32px] md:rounded-[40px] shadow-2xl group/img">
                <ImageWithFallback
                  src={items[0]?.imageUrl || ''}
                  alt={items[0]?.name || ''}
                  fill
                  placeholderMode="horizontal"
                  className="object-cover transition-transform duration-[2s] group-hover/img:scale-110"
                />
                <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/90 backdrop-blur-xl px-4 py-2 md:px-6 md:py-4 rounded-xl md:rounded-[24px] shadow-xl border border-white/40">
                  <span className="font-anton text-xl md:text-3xl text-black">{(items[0]?.price / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 - Multi Item Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b-[3px] border-black flex-shrink-0">
            {items.slice(1, 5).map((dish, idx) => (
              <div
                key={dish.id}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05 })}
                className={`relative z-10 cursor-pointer p-6 md:p-8 ${idx < 3 ? 'md:border-r-[3px] border-black' : ''} ${idx % 2 === 0 ? 'border-r-[3px] md:border-r-[0px] border-black' : ''} flex flex-col group/dish`}
              >
                <div className="text-3xl md:text-5xl font-anton font-bold text-gray-200 leading-none mb-4 md:mb-6 transition-colors group-hover/dish:text-amber-500">{String(idx + 2).padStart(2, '0')}</div>
                <div className="relative mb-4 md:mb-6 aspect-square overflow-hidden rounded-2xl md:rounded-[24px] shadow-md border border-gray-100 bg-white">
                  <ImageWithFallback
                    src={dish.imageUrl}
                    alt={dish.name}
                    fill
                    placeholderMode="horizontal"
                    className="object-cover transition-transform duration-700 group-hover/dish:scale-110"
                  />
                </div>
                <h3 className="text-sm md:text-lg font-anton font-bold text-black uppercase tracking-tight leading-tight mb-1 md:mb-2 line-clamp-1">{dish.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg md:text-xl font-anton font-bold text-amber-600">{(dish.price / 1000).toFixed(0)}K</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 3 - Large Pairs (Smart-filling) */}
          {items.slice(5, 7).length > 0 && (
            <div className={`grid ${items.slice(5, 7).length === 1 ? 'grid-cols-1' : 'grid-cols-2'} flex-shrink-0 flex-1 min-h-auto md:min-h-[350px]`}>
              {items.slice(5, 7).map((dish, idx) => (
                <div
                  key={dish.id}
                  onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05 })}
                  className={`relative z-10 cursor-pointer p-6 md:p-12 ${idx === 0 && items.slice(5, 7).length > 1 ? 'border-r-[3px] border-black' : ''} group/pair`}
                >
                  <div className={`flex ${items.slice(5, 7).length === 1 ? 'flex-row' : 'flex-col md:flex-row'} gap-4 md:gap-8 h-full items-start md:items-center`}>
                    <div className={`relative flex-shrink-0 overflow-hidden rounded-2xl md:rounded-[32px] shadow-xl border border-gray-100 bg-white aspect-square ${items.slice(5, 7).length === 1 ? 'w-32 h-32 md:w-[240px] md:h-[240px]' : 'w-full md:w-[240px] md:h-[240px]'}`}>
                      <ImageWithFallback
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        placeholderMode="horizontal"
                        className="object-cover transition-transform duration-700 group-hover/pair:scale-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-3xl md:text-7xl font-anton font-bold text-gray-200 leading-none mb-2 md:mb-4 group-hover/pair:text-black transition-colors">{String(idx + 6).padStart(2, '0')}</div>
                      <h3 className="text-base md:text-5xl font-anton font-bold text-black uppercase tracking-tighter mb-2 md:mb-4 leading-none line-clamp-1 md:line-clamp-none">{dish.name}</h3>
                      <div className="flex items-center gap-3 md:gap-6">
                        <span className="text-lg md:text-3xl font-anton font-bold text-amber-600">{(dish.price / 1000).toFixed(0)}K</span>
                        <div className="hidden md:block h-[2px] w-16 bg-black/10" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}