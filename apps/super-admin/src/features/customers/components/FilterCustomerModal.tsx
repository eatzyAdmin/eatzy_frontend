'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, CheckCircle, AlertCircle, Filter, Check,
  RotateCcw, ShieldCheck, Lock
} from 'lucide-react';
import { createPortal } from 'react-dom';

interface FilterCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (query: string) => void;
  activeQuery: string;
}

export default function FilterCustomerModal({
  isOpen,
  onClose,
  onApply,
  activeQuery
}: FilterCustomerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Basic parsing if needed
      if (activeQuery.includes('user.isActive:true')) setSelectedStatuses(['active']);
      else if (activeQuery.includes('user.isActive:false')) setSelectedStatuses(['disabled']);
      else setSelectedStatuses([]);
    }
  }, [isOpen, activeQuery]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [status] // Radio-like for isActive
    );
  };

  const handleReset = () => {
    setSelectedStatuses([]);
  };

  const handleApply = () => {
    let query = '';
    if (selectedStatuses.includes('active')) {
      query = 'user.isActive:true';
    } else if (selectedStatuses.includes('disabled')) {
      query = 'user.isActive:false';
    }
    onApply(query);
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[600]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[610] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-[500px] max-w-[95vw] rounded-[40px] p-8 shadow-2xl relative overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Filter className="w-6 h-6" />
                  </div>
                  FILTER CUSTOMERS
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    title="Reset"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-4 mb-8">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] block">
                  Account Status
                </label>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => toggleStatus('active')}
                    className={`flex items-center justify-between p-5 rounded-[24px] border-2 transition-all
                      ${selectedStatuses.includes('active')
                        ? 'bg-lime-50 border-lime-500 shadow-lg shadow-lime-500/10'
                        : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedStatuses.includes('active') ? 'bg-lime-500 text-white' : 'bg-white text-gray-400'}`}>
                        <ShieldCheck size={18} />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-tight ${selectedStatuses.includes('active') ? 'text-lime-700' : 'text-gray-500'}`}>
                        Active Only
                      </span>
                    </div>
                    {selectedStatuses.includes('active') && <Check size={18} className="text-lime-500" />}
                  </button>

                  <button
                    onClick={() => toggleStatus('disabled')}
                    className={`flex items-center justify-between p-5 rounded-[24px] border-2 transition-all
                      ${selectedStatuses.includes('disabled')
                        ? 'bg-red-50 border-red-500 shadow-lg shadow-red-500/10'
                        : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedStatuses.includes('disabled') ? 'bg-red-500 text-white' : 'bg-white text-gray-400'}`}>
                        <Lock size={18} />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-tight ${selectedStatuses.includes('disabled') ? 'text-red-700' : 'text-gray-500'}`}>
                        Disabled Only
                      </span>
                    </div>
                    {selectedStatuses.includes('disabled') && <Check size={18} className="text-red-500" />}
                  </button>
                </div>
              </div>

              {/* Footer */}
              <button
                onClick={handleApply}
                className="w-full py-4 bg-[#1A1A1A] text-white rounded-[24px] font-anton text-lg uppercase tracking-wider hover:bg-primary transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
              >
                <Check className="w-6 h-6" strokeWidth={3} />
                Apply Filters
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
