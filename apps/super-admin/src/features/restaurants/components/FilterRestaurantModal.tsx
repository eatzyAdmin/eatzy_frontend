'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, Filter, Check, RotateCcw,
  Play, Pause, Lock, Clock, Building2
} from 'lucide-react';
import { RestaurantStatus } from '@repo/types';

interface FilterRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (query: string) => void;
  activeQuery?: string;
}

export default function FilterRestaurantModal({
  isOpen,
  onClose,
  onApply,
  activeQuery = ''
}: FilterRestaurantModalProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<RestaurantStatus[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (activeQuery) {
        const statuses: RestaurantStatus[] = [];

        // Check for account locked
        if (activeQuery.includes('owner.isActive:false')) {
          statuses.push('LOCKED' as RestaurantStatus);
        }

        // Simple parser for status in ['A', 'B']
        const match = activeQuery.match(/status in \[(.*)\]/);
        if (match && match[1]) {
          const ops = match[1].split(',').map(s => s.trim().replace(/'/g, '')) as RestaurantStatus[];
          statuses.push(...ops);
        }
        setSelectedStatuses(statuses);
      } else {
        setSelectedStatuses([]);
      }
    }
  }, [isOpen, activeQuery]);

  const toggleStatus = (status: RestaurantStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleReset = () => {
    setSelectedStatuses([]);
  };

  const handleApply = () => {
    const filters: string[] = [];
    const opStatuses = selectedStatuses.filter(s => s !== 'LOCKED');
    const isLockedSelected = selectedStatuses.includes('LOCKED' as RestaurantStatus);

    if (opStatuses.length > 0 && isLockedSelected) {
      filters.push(`(status in [${opStatuses.map(s => `'${s}'`).join(',')}] or owner.isActive:false)`);
    } else if (opStatuses.length > 0) {
      filters.push(`status in [${opStatuses.map(s => `'${s}'`).join(',')}]`);
    } else if (isLockedSelected) {
      filters.push('owner.isActive:false');
    }

    onApply(filters.join(''));
    onClose();
  };

  const activeCount = selectedStatuses.length > 0 ? 1 : 0;

  const STATUS_CONFIG = [
    { value: 'OPEN', label: 'Open', icon: Play, activeBg: 'bg-lime-50', activeText: 'text-lime-700', activeBorder: 'border-lime-500' },
    { value: 'CLOSED', label: 'Closed', icon: Pause, activeBg: 'bg-gray-50', activeText: 'text-gray-700', activeBorder: 'border-gray-500' },
    { value: 'LOCKED', label: 'Locked', icon: Lock, activeBg: 'bg-red-50', activeText: 'text-red-700', activeBorder: 'border-red-500' },
    { value: 'PENDING', label: 'Pending', icon: Clock, activeBg: 'bg-amber-50', activeText: 'text-amber-700', activeBorder: 'border-amber-500' },
  ] as const;

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
          <div className="fixed inset-0 z-[601] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-[800px] max-w-[95vw] rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-lime-100 text-primary flex items-center justify-center">
                    <Filter className="w-6 h-6" />
                  </div>
                  FILTER RESTAURANTS
                  {activeCount > 0 && (
                    <span className="text-sm font-sans font-medium text-primary bg-lime-50 px-3 py-1 rounded-full ml-1">
                      {activeCount} Active Section
                    </span>
                  )}
                </h2>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all"
                    title="Reset Filters"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleApply}
                    className="p-4 rounded-full bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-primary/20 hover:-translate-y-0.5"
                    title="Apply Filters"
                  >
                    <Check className="w-5 h-5" strokeWidth={3} />
                  </button>

                  <button
                    onClick={onClose}
                    className="p-4 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto pr-2 pb-4 custom-scrollbar">
                <div className="space-y-8">

                  {/* Operational Status */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <Building2 size={18} className="text-primary" />
                      Operational Status
                    </label>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 gap-3">
                      {STATUS_CONFIG.map(config => {
                        const Icon = config.icon;
                        const isSelected = selectedStatuses.includes(config.value);

                        return (
                          <button
                            key={config.value}
                            onClick={() => toggleStatus(config.value)}
                            className={`py-4 px-5 text-sm font-bold rounded-2xl transition-all border-2 text-left flex items-center gap-3 group
                                        ${isSelected
                                ? `${config.activeBg} ${config.activeText} ${config.activeBorder} shadow-md`
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/50' : 'bg-gray-100 group-hover:bg-white transition-colors'}`}>
                              <Icon size={18} className={isSelected ? 'scale-110 transition-transform text-current' : ''} />
                            </div>
                            <span className="flex-1 uppercase tracking-tight">{config.label}</span>
                            {isSelected && <Check className="w-5 h-5" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Coming Soon Section */}
                  <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 border-dashed text-center">
                    <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center text-gray-300 mb-4 shadow-sm">
                      <Clock size={32} />
                    </div>
                    <h3 className="text-sm font-anton text-gray-900 uppercase tracking-wider mb-2">More Filters Coming Soon</h3>
                    <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
                      We are working on adding Rating Range, Commission Tiers, and Category filters to further refine your restaurant network management.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
