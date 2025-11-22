import { motion } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import Image from 'next/image';
import { useHoverHighlight, HoverHighlightOverlay } from '@repo/ui';

export default function MagazineLayout10({ restaurant, dishes }: { restaurant: Restaurant; dishes: Dish[]; menuCategories: MenuCategory[]; }) {
  const top = dishes.slice(0, 4);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  return (
    <motion.section className="mb-16">
      <div className="relative h-[420px] overflow-hidden">
        <Image src={restaurant.imageUrl ?? 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'} alt={restaurant.name} fill className="object-cover" />
        <div className="absolute inset-y-0 left-0 w-2/5 bg-white/90 clip-path-[polygon(0_0,100%_0,85%_100%,0_100%)] p-8">
          <h2 className="text-3xl font-bold text-[#1d1d1d]">{restaurant.name}</h2>
          <p className="mt-3 text-[#555]">{restaurant.description}</p>
        </div>
      </div>
      <div ref={containerRef} onMouseLeave={clearHover} className="relative grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        <HoverHighlightOverlay rect={rect} style={style} preset="tail" />
        {top.map((d) => (
          <div key={d.id} onMouseEnter={(e) => moveHighlight(e, { borderRadius: 12, backgroundColor: '#ffffff', opacity: 1, scaleEnabled: true, scale: 1.12 })} className="group bg-white hover:shadow-lg transition-shadow relative z-10 cursor-pointer">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={d.imageUrl} alt={d.name} fill className="object-cover" />
            </div>
            <div className="mt-2">
              <h3 className="text-[16px] font-semibold text-[#222] group-hover:underline">{d.name}</h3>
              <p className="text-[13px] text-[#666]">{d.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}