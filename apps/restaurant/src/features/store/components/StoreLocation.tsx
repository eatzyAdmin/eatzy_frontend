import { motion } from "@repo/ui/motion";
import { MapPin, Edit2 } from "@repo/ui/icons";
import StoreLocationMap from "./StoreLocationMap";

interface StoreLocationProps {
  store: { address: string; coords: { lat: number; lng: number };[key: string]: unknown };
  onEdit: () => void;
  layoutId?: string;
}

export default function StoreLocation({ store, onEdit, layoutId }: StoreLocationProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className="bg-white rounded-[32px] p-8 shadow-sm border-2 border-gray-200 flex flex-col h-full relative group"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          LOCATION & ADDRESS
        </h2>

        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-full bg-gray-100 text-gray-400 font-bold text-sm flex items-center gap-2 hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
        >
          <Edit2 className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Address</label>
          <div className="text-base font-medium text-[#1A1A1A] leading-relaxed">{store.address}</div>
        </div>

        <div className="h-[400px] w-full relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
          <StoreLocationMap
            coords={store.coords}
            isEditing={false}
          />
        </div>
      </div>
    </motion.div>
  );
}
