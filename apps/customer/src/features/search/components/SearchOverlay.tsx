"use client";
import { AnimatePresence, motion } from "@repo/ui/motion";
import { Search, X } from "@repo/ui/icons";

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            layoutId="search"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: 0.2,
              layout: {
                type: "spring",
                damping: 18,
                stiffness: 150,
              },
            }}
            className="fixed z-[70] inset-x-60 top-[16vh] -translate-x-1/2 max-w-[92vw]"
          >
            <div className="flex items-center gap-3 px-5 h-20 text-xl rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white">
              <Search className="w-8 h-8" />
              <input
                autoFocus
                placeholder="Tìm món, nhà hàng, khu vực..."
                className="flex-1 bg-transparent text-white font-medium placeholder:text-white/60 focus:outline-none"
              />
              <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
          <div className="fixed left-1/2 top-[32vh] -translate-x-1/2 flex flex-wrap gap-4 z-[70] text-white/80">
            {["Sushi", "Bún bò", "Cà phê", "Pizza"].map((s) => (
              <button key={s} className="px-6 py-2 rounded-full bg-white/10 border border-white/20 text-md hover:bg-white/20">{s}</button>
            ))}
          </div>
        </>
      )}
    </AnimatePresence>
  );
}