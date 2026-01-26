'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { createPortal } from 'react-dom';
import { Search, X, Tag, FileText } from 'lucide-react';

interface PromotionSearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

export default function PromotionSearchPopup({
  isOpen,
  onClose,
  searchTerm,
  onSearch
}: PromotionSearchPopupProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      setLocalSearch(searchTerm);
    }
  }, [isOpen, searchTerm]);

  const handleSearchSubmit = () => {
    onSearch(localSearch);
    onClose();
  };

  const handleClear = () => {
    setLocalSearch('');
    onSearch('');
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: -150, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          exit={{ y: -150, x: "-50%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-6 left-1/2 z-[200] w-[90%] md:w-[600px]"
        >
          <div className="absolute -inset-10 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-black/10 blur-[60px] rounded-[60px]" />
          </div>

          <div className="relative bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[32px] p-6 flex flex-col gap-5 border border-gray-100/50">

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                  <Search className="w-5 h-5" />
                </div>
                Quick Search
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { handleClear(); onClose(); }}
                  className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Input Container */}
            <div className="flex flex-col gap-4">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-lime-500 transition-colors pointer-events-none">
                  <Search size={22} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  placeholder="Type campaign code or description..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  autoFocus
                  className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-lime-500/20 rounded-[24px] py-6 pl-14 pr-6 text-xl font-anton text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-8 focus:ring-lime-500/5 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="flex justify-between items-center px-4 mt-1">
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Tag size={10} /> CODE
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <FileText size={10} /> NAME
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                Press <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">Enter</span> to search
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
