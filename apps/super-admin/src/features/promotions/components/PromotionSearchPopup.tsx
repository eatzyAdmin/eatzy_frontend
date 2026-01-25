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
          className="fixed top-10 left-1/2 z-[200] w-[90%] md:w-[600px]"
        >
          <div className="absolute -inset-10 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-black/10 blur-[60px] rounded-[60px]" />
          </div>

          <div className="relative bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[32px] p-6 flex flex-col gap-5 border border-gray-100/50">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Search className="w-5 h-5" />
                </div>
                SEARCH CAMPAIGNS
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSearchSubmit}
                  className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                  title="Search"
                >
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => { handleClear(); onClose(); }}
                  className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Input Container */}
            <div className="flex flex-col gap-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search Campaign Name or Code..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-200 focus:bg-white rounded-2xl py-4 pl-11 pr-4 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-center mt-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">
                <Tag size={12} /> Code
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg">
                <FileText size={12} /> Name
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
