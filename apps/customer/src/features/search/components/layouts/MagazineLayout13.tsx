import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import { ImageWithFallback } from '@repo/ui';
import { useHoverHighlight, HoverHighlightOverlay, useTapRipple, TapRippleOverlay, useLoading } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SkeletonAvatar } from '@repo/ui';
import { ChefHat, MessageSquare, Repeat, Instagram, Play } from '@repo/ui/icons';

export default function MagazineLayout13({ restaurant, dishes }: { restaurant: Restaurant; dishes: Dish[]; menuCategories: MenuCategory[]; }) {
  const featured = dishes[0];
  const gallery = dishes.slice(1, 4);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: tapRef, ripple, triggerTap } = useTapRipple<HTMLDivElement>();
  const { show } = useLoading();
  const router = useRouter();
  const setRefs = useCallback((el: HTMLDivElement | null) => { containerRef.current = el; tapRef.current = el; }, [containerRef, tapRef]);

  return (
    <motion.section
      className="relative w-full max-w-[800px] mx-auto overflow-hidden mb-16 md:mb-32 rounded-[48px] shadow-[0_40px_80px_rgba(0,0,0,0.4)] bg-[#111] group"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div
        ref={setRefs}
        onMouseLeave={clearHover}
        onClick={(e) => { triggerTap(e); setTimeout(() => { show('Đang mở chi tiết quán'); router.push(`/restaurants/${restaurant.slug}`); }, 300); }}
        className="relative cursor-pointer"
      >
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        <TapRippleOverlay ripple={ripple} />

        {/* Hero Section */}
        <div className="relative aspect-[4/5] md:aspect-[3.5/4] w-full overflow-hidden">
          <ImageWithFallback
            src={featured.imageUrl ?? restaurant.imageUrl ?? ''}
            alt={featured.name}
            fill
            placeholderMode="horizontal"
            className="object-cover transition-transform duration-[4s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#111]" />
        </div>

        {/* Content Section */}
        <div className="relative px-8 pb-10 -mt-20 z-10">
          {/* Creator/Restaurant Info */}
          <div className="flex items-center gap-3 mb-6">
            <SkeletonAvatar isLoading={false} size="md" className="border-2 border-white/20 overflow-hidden bg-zinc-800">
              <ImageWithFallback src={restaurant.imageUrl ?? ''} alt={restaurant.name} fill placeholderMode="horizontal" className="object-cover" />
            </SkeletonAvatar>
            <span className="text-white font-medium tracking-tight text-lg">{restaurant.name}</span>
          </div>

          {/* Title - Large Serif-like Anton */}
          <h2 className="text-4xl md:text-5xl font-anton font-bold text-white leading-[1.1] mb-8 max-w-[90%] uppercase tracking-tight">
            {featured.name}
          </h2>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
            <button className="flex items-center gap-2.5 px-6 py-3 bg-[#222] hover:bg-[#333] text-white rounded-full transition-colors border border-white/5">
              <ChefHat className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold tracking-wide">Menu</span>
            </button>
            <button className="flex items-center gap-2.5 px-6 py-3 bg-[#222] hover:bg-[#333] text-white rounded-full transition-colors border border-white/5">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold tracking-wide">Review</span>
            </button>
            <button className="flex items-center gap-2.5 px-6 py-3 bg-[#222] hover:bg-[#333] text-white rounded-full transition-colors border border-white/5">
              <Repeat className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold tracking-wide">Similar</span>
            </button>
            <button className="flex items-center gap-2.5 px-6 py-3 bg-[#222] hover:bg-[#333] text-white rounded-full transition-colors border border-white/5">
              <Instagram className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold tracking-wide">Story</span>
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-12 line-clamp-3 italic">
            &quot;{featured.description || restaurant.description}&quot;
          </p>

          {/* Gallery Row */}
          <div className="grid grid-cols-3 gap-4">
            {gallery.map((dish, i) => (
              <div
                key={dish.id}
                onMouseEnter={(e) => moveHighlight(e, { borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.06)', opacity: 1, scaleEnabled: true, scale: 1.05 })}
                className="relative aspect-square md:aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 group/item"
              >
                <ImageWithFallback
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  placeholderMode="horizontal"
                  className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                />
                {/* Floating "Play" indicator like the time in the photo */}
                <div className="absolute bottom-4 left-4 right-4 py-1.5 px-3 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-anton font-bold flex items-center justify-center gap-1 opacity-80 group-hover/item:opacity-100 transition-opacity">
                  <Play className="w-3 h-3 fill-white text-white" />
                  PREVIEW
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
