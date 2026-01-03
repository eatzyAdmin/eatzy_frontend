import { useState } from "react";
import { motion } from "@repo/ui/motion";
import { MapPin, X, Save, Navigation, Edit2 } from "@repo/ui/icons";
import { useNotification, useSwipeConfirmation } from "@repo/ui";
import StoreLocationMap from "./StoreLocationMap";

interface StoreLocationEditProps {
  store: { address: string; coords: { lat: number; lng: number };[key: string]: unknown };
  onSave: (updates: { address: string; coords: { lat: number; lng: number } }) => void;
  onClose: () => void;
  layoutId?: string;
}

export default function StoreLocationEdit({ store, onSave, onClose, layoutId }: StoreLocationEditProps) {
  const [address, setAddress] = useState(store.address);
  const [coords, setCoords] = useState(store.coords);
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();
  const [initialJson] = useState(() => JSON.stringify({ address: store.address, coords: store.coords }));

  const handleSave = () => {
    const currentData = { address, coords };
    const currentJson = JSON.stringify(currentData);
    if (currentJson === initialJson) {
      showNotification({
        type: 'error',
        message: 'Bạn chưa thực hiện thay đổi nào!',
        format: 'Kiểm tra lại các thay đổi và thử lại!',
        autoHideDuration: 3000
      });
      return;
    }

    confirm({
      title: 'Cập nhật địa điểm',
      description: 'Địa chỉ và tọa độ của cửa hàng sẽ được cập nhật.',
      type: 'info',
      confirmText: 'Lưu thay đổi',
      onConfirm: async () => {
        onSave(currentData);
      }
    });
  };

  return (
    <motion.div
      layoutId={layoutId}
      className="bg-white w-[800px] max-w-full rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col h-[90vh]"
    >
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-3xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          EDIT LOCATION
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="p-4 rounded-full font-bold bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
          >
            <Save className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="p-4 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col h-full gap-6 overflow-hidden">
        {/* Address Input */}
        <div className="shrink-0">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Address</label>
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full text-lg font-medium p-4 pr-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 focus:border-[var(--primary)] focus:border-solid focus:bg-white outline-none transition-all"
              placeholder="Enter full address..."
            />
            <Edit2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative rounded-3xl overflow-hidden border-2 border-gray-100">
          <StoreLocationMap
            coords={coords}
            isEditing={true}
            onCoordsChange={setCoords}
          />
          <div className="absolute top-4 left-4 right-4 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white shadow-lg text-sm font-semibold text-gray-600 flex items-center gap-2 z-10">
            <Navigation className="w-4 h-4 text-emerald-500" />
            Di chuyển ghim trên bản đồ để cập nhật tọa độ chính xác.
          </div>
        </div>
      </div>


    </motion.div>
  );
}
