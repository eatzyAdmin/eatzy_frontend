"use client";
import { motion } from "@repo/ui/motion";
import { MapPin, ChevronRight, Lock } from "@repo/ui/icons";

export default function AddressForm({
  value,
  onChange,
  onClick,
  onOpenSaved,
}: {
  value: string;
  onChange: (v: string) => void;
  onClick?: () => void;
  onOpenSaved?: () => void;
}) {
  return (
    <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
      {/* 📱 MOBILE VIEW (Visible on < 768px) */}
      <div
        className="md:hidden cursor-pointer hover:bg-gray-50/50 transition-all active:scale-[0.99]"
        onClick={onClick}
      >
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h4 className="font-bold text-[#1A1A1A]">Delivery Address</h4>
          </div>
          <div className="flex items-center gap-1 text-lime-600 font-bold text-[12px]">
            Change
            <ChevronRight className="w-4 h-4" strokeWidth={3} />
          </div>
        </div>

        <div className="p-4 pt-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lime-100 text-[var(--primary)] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="py-2 border-b border-gray-100 min-h-[40px] flex items-center group">
                <motion.span
                  key={value}
                  initial={{
                    backgroundColor: "rgba(132, 204, 22, 0.45)",
                    color: "#3f6212",
                    boxShadow: "0 0 20px rgba(132, 204, 22, 0.3)"
                  }}
                  animate={{
                    backgroundColor: "rgba(132, 204, 22, 0)",
                    color: "inherit",
                    boxShadow: "0 0 0px rgba(132, 204, 22, 0)"
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className={`text-[14px] font-bold ${value ? 'text-[#1A1A1A]' : 'text-gray-300'} flex-1 truncate px-2 py-0.5 rounded-lg overflow-hidden`}
                >
                  {value || "Choose your delivery address"}
                </motion.span>
              </div>
              <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Tap to search address on map
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-gray-50/20 cursor-default">
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-300" />
            <h4 className="font-bold text-gray-400">Delivery Address</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSaved}
              className="flex items-center gap-2 px-4 py-1.5 bg-[var(--primary)] text-white hover:bg-lime-600 transition-all rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm active:scale-95"
            >
              <MapPin size={12} className="text-white" />
              USE SAVED ADDRESS
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <Lock size={12} className="text-gray-300" />
              Fixed on Map
            </div>
          </div>
        </div>

        <div className="p-5 pt-0">
          <div className="flex items-center gap-3 mt-5">
            <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-300 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="py-2 border-b border-gray-100 min-h-[40px] flex items-center opacity-60">
                <motion.span
                  key={value}
                  initial={{
                    backgroundColor: "rgba(132, 204, 22, 0.45)",
                    color: "#3f6212",
                    boxShadow: "0 0 20px rgba(132, 204, 22, 0.3)"
                  }}
                  animate={{
                    backgroundColor: "rgba(132, 204, 22, 0)",
                    color: "inherit",
                    boxShadow: "0 0 0px rgba(132, 204, 22, 0)"
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="text-[14px] font-bold text-gray-500 truncate px-2 py-0.5 rounded-lg overflow-hidden"
                >
                  {value || "Location not identified"}
                </motion.span>
              </div>
              <div className="mt-2 text-[12px] font-bold italic flex items-start gap-1.5 text-lime-500">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1 animate-pulse flex-shrink-0" />
                <span>Please change location on the map in the right column</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
