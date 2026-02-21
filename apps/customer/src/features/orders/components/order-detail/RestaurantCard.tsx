import { motion } from "@repo/ui/motion";
import { Store, Star, ChevronRight } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import { useRouter } from "next/navigation";

export function RestaurantCard({ restaurant }: { restaurant: any }) {
  const router = useRouter();
  if (!restaurant) return null;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/restaurants/${restaurant.slug || restaurant.id}`)}
      className="group relative bg-white rounded-[36px] md:rounded-[40px] shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100/50 overflow-hidden flex flex-col min-h-[160px] cursor-pointer h-full"
    >
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={restaurant.imageUrl || ""}
          alt={restaurant.name}
          fill
          placeholderMode="vertical"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col h-full p-6 justify-between flex-1">
        <div className="flex justify-between items-start">
          <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:bg-[var(--primary)] group-hover:border-[var(--primary)] transition-all duration-300">
            <Store className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-white/20">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-[15px] font-anton text-amber-700">{restaurant.averageRating?.toFixed(1) || "4.9"}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mb-0.5">Cửa hàng</span>
            <h3 className="font-anton text-2xl text-white uppercase leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] line-clamp-1">{restaurant.name}</h3>
          </div>
          <div className="flex items-center gap-2 pt-1 group/visit">
            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest border-b border-white/30 pb-0.5 group-hover:text-white group-hover:border-white transition-all">
              Xem cửa hàng
            </span>
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-[var(--primary)] transition-colors">
              <ChevronRight className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}
