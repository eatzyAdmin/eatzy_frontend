import { ImageWithFallback } from "@repo/ui";
import { Image as ImageIcon, Settings } from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";

interface StoreMediaProps {
  store: { images: string[];[key: string]: unknown };
  onEdit: () => void;
  layoutId?: string; // Add this
}

export default function StoreMedia({ store, onEdit, layoutId }: StoreMediaProps) {
  return (
    <motion.div
      layoutId={layoutId} // Apply to root
      className="bg-white rounded-[32px] p-8 shadow-sm border-2 border-gray-200 h-full flex flex-col"
    >
      <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-6 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
          <ImageIcon className="w-5 h-5" />
        </div>
        PHOTO GALLERY
        <span className="text-sm font-medium text-gray-400 font-sans ml-auto">{store.images.length} photos</span>
      </h2>

      <div className="flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {store.images.slice(0, 3).map((img: string, index: number) => (
            <div
              key={img + index}
              className="aspect-square relative rounded-2xl overflow-hidden group border border-gray-100"
            >
              <ImageWithFallback src={img} alt="Gallery" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </div>
          ))}

          {/* 4th Image - Show normally if exactly 4 images */}
          {store.images.length === 4 && (
            <div className="aspect-square relative rounded-2xl overflow-hidden group border border-gray-100">
              <ImageWithFallback src={store.images[3]} alt="Gallery" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </div>
          )}

          {/* +N More Photos Card - Only if more than 4 */}
          {store.images.length > 4 && (
            <div className="aspect-square relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-900">
              <ImageWithFallback src={store.images[3]} alt="More" fill className="object-cover opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="text-center text-white">
                  <div className="text-4xl font-black font-anton">+{store.images.length - 3}</div>
                  <div className="text-xs font-medium opacity-80 mt-1">more</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Manage Button - Fills remaining space */}
        <button
          onClick={onEdit}
          className="flex-1 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform text-gray-300 group-hover:text-[var(--primary)]">
            <Settings className="w-8 h-8" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base font-bold uppercase tracking-wider">Manage Gallery</span>
            <span className="text-xs font-medium opacity-60">Add, remove, or reorder photos</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
