import { motion } from "@repo/ui/motion";
import { ChevronRight, Plus } from "lucide-react";
import { ImageWithFallback } from "@repo/ui";

interface TopRestaurant {
  id: string;
  name: string;
  type: string;
  revenue: number;
  image: string;
}

interface TopRestaurantsScrollProps {
  restaurants: TopRestaurant[];
}

export function TopRestaurantsScroll({ restaurants }: TopRestaurantsScrollProps) {
  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Top Cửa hàng hiệu quả</h3>
        <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
          Xem tất cả <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2 min-w-[80px] snap-start"
        >
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-xs font-medium text-gray-600 text-center">Thêm mới</span>
        </motion.button>

        {restaurants.map((restaurant) => (
          <motion.div
            key={restaurant.id}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center gap-2 min-w-[100px] snap-start cursor-pointer group"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:border-blue-600 transition-colors duration-300">
              <ImageWithFallback
                src={restaurant.image}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-900 truncate w-24">{restaurant.name}</p>
              <p className="text-[10px] text-gray-500">{restaurant.type}</p>
            </div>
            <div className="text-xs font-bold text-blue-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(restaurant.revenue)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
