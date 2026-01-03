import { motion } from "@repo/ui/motion";
import { ImageWithFallback, StatusBadge } from "@repo/ui";
import { MapPin, Star, Phone, Camera } from "@repo/ui/icons";

interface StoreHeaderProps {
  store: { imageUrl?: string; name: string; status: string; rating: number; reviewCount: number; address: string; phone: string;[key: string]: unknown };
}

export default function StoreHeader({ store }: StoreHeaderProps) {
  return (
    <div className="relative h-[300px] w-full shrink-0 group rounded-b-[40px] overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={store.imageUrl || ''}
          alt={store.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-8 pb-24 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-32">
        <div className="text-white space-y-3">
          <div className="flex items-center gap-3">
            <StatusBadge status={store.status} />
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>{store.rating} ({store.reviewCount} đánh giá)</span>
            </div>
          </div>
          <h1 className="text-5xl font-anton font-bold tracking-wide drop-shadow-md">{store.name}</h1>
          <div className="flex items-center gap-6 text-sm font-medium text-white/90">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--primary)]" />
              <span>{store.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[var(--primary)]" />
              <span>{store.phone}</span>
            </div>
          </div>
        </div>

        {/* Change Cover Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => alert("Mock feature: Change Cover Image")}
          className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-white/30 transition-colors border border-white/30"
        >
          <Camera className="w-4 h-4" />
          <span>Thay đổi ảnh bìa</span>
        </motion.button>
      </div>
    </div>
  );
}
