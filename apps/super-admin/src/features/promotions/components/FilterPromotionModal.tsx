'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, Check, Tag, Filter, RotateCcw, Activity,
  DollarSign, CheckCircle, Ban, Percent, Truck, List
} from '@repo/ui/icons';
import { DiscountType } from '@repo/types';

interface FilterPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (query: string) => void;
  onReset?: () => void;
}

export default function FilterPromotionModal({ isOpen, onClose, onApply }: FilterPromotionModalProps) {
  const [filters, setFilters] = useState({
    discountType: '',
    active: '',
    minOrderValue: '',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApply = () => {
    const queryParts: string[] = [];
    if (filters.discountType) queryParts.push(`discountType:'${filters.discountType}'`);
    if (filters.active !== '') queryParts.push(`active:${filters.active}`);
    if (filters.minOrderValue) queryParts.push(`minOrderValue >= ${filters.minOrderValue}`);

    onApply(queryParts.join(' and '));
    onClose();
  };

  const handleReset = () => {
    setFilters({ discountType: '', active: '', minOrderValue: '' });
  };

  const activeCount = [
    filters.discountType !== '',
    filters.active !== '',
    filters.minOrderValue !== ''
  ].filter(Boolean).length;

  const themeClasses: Record<string, any> = {
    lime: { bg: 'bg-lime-50 border-lime-100', text: 'text-lime-800', iconBox: 'bg-lime-200 text-lime-700', check: 'bg-lime-500' },
    amber: { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-800', iconBox: 'bg-amber-200 text-amber-700', check: 'bg-amber-500' },
    red: { bg: 'bg-red-50 border-red-100', text: 'text-red-800', iconBox: 'bg-red-200 text-red-700', check: 'bg-red-500' },
    gray: { bg: 'bg-gray-50 border-gray-100', text: 'text-gray-900', iconBox: 'bg-gray-100 text-gray-400', check: 'bg-gray-900' },
    indigo: { bg: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-800', iconBox: 'bg-indigo-200 text-indigo-700', check: 'bg-indigo-500' },
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[600]"
          />

          <div className="fixed inset-0 z-[610] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-[800px] max-w-[98vw] rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col max-h-[92vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="relative px-6 py-5 md:px-9 md:py-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 bg-white">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-lg shadow-black/10 shrink-0">
                    <Filter className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-anton font-bold text-[#1A1A1A] tracking-tight uppercase leading-none">Campaign Filtering</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Promotions</span>
                      {activeCount > 0 && (
                        <span className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-lime-700 bg-lime-100 px-2 py-0.5 rounded-full border border-lime-200">
                          <div className="w-1 h-1 rounded-full bg-lime-600 animate-pulse"></div>
                          {activeCount} ACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                  {activeCount > 0 && (
                    <button
                      onClick={handleReset}
                      className="group flex items-center gap-2 px-3 py-2 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl bg-white text-gray-400 font-bold text-[10px] md:text-xs border border-gray-100 shadow-sm hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all duration-300"
                    >
                      <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:rotate-[-120deg] transition-transform duration-500" />
                      RESET ALL
                    </button>
                  )}

                  <button
                    onClick={handleApply}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-3xl bg-lime-500 text-white font-bold text-xs md:text-sm tracking-widest hover:bg-lime-600 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                  >
                    <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                    APPLY FILTERS
                  </button>

                  <div className="hidden sm:block w-px h-8 bg-gray-200 mx-1"></div>

                  <button
                    onClick={onClose}
                    className="p-2 md:p-4 rounded-full bg-gray-100 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:shadow transition-all shrink-0"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                <div className="max-w-4xl mx-auto space-y-10">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Campaign Status */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                          <Activity size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Execution State</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Lifecycle of campaign</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { key: '', label: 'All Campaigns', icon: <List size={20} />, theme: 'lime' },
                          { key: 'true', label: 'Currently Running', icon: <CheckCircle size={20} />, theme: 'lime' },
                          { key: 'false', label: 'Paused / Draft', icon: <Ban size={20} />, theme: 'amber' },
                        ].map((item) => {
                          const active = filters.active === item.key;
                          const currentTheme = themeClasses[item.theme];
                          return (
                            <button
                              key={item.label}
                              onClick={() => setFilters(prev => ({ ...prev, active: item.key }))}
                              className={`
                                relative w-full text-left p-3.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                ${active
                                  ? `${currentTheme.bg} shadow-sm`
                                  : "bg-white border-gray-100 hover:border-gray-100 hover:bg-gray-50/30"
                                }
                              `}
                            >
                              <div className={`
                                w-11 h-11 rounded-[18px] flex items-center justify-center transition-all duration-300 shrink-0
                                ${active
                                  ? currentTheme.iconBox
                                  : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                }
                              `}>
                                {item.icon}
                              </div>
                              <span className={`flex-1 text-[15px] font-bold transition-all ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                {item.label}
                              </span>
                              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shrink-0
                                ${active
                                  ? `${currentTheme.check} text-white scale-100`
                                  : "bg-gray-100 text-transparent scale-90"
                                }
                              `}>
                                <Check size={14} strokeWidth={4} className={active ? "opacity-100" : "opacity-0"} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Promotion Type */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                          <Tag size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Promotion Logic</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Discount structural class</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { key: '', label: 'All Types', icon: <List size={20} />, theme: 'lime' },
                          { key: DiscountType.PERCENTAGE, label: 'Percentage Off', icon: <Percent size={20} />, theme: 'lime' },
                          { key: DiscountType.FIXED, label: 'Fixed Amount', icon: <DollarSign size={20} />, theme: 'lime' },
                          { key: DiscountType.FREESHIP, label: 'Free Delivery', icon: <Truck size={20} />, theme: 'lime' },
                        ].map((item) => {
                          const active = filters.discountType === item.key;
                          const currentTheme = themeClasses[item.theme];
                          return (
                            <button
                              key={item.label}
                              onClick={() => setFilters(prev => ({ ...prev, discountType: item.key }))}
                              className={`
                                relative w-full text-left p-3.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                ${active
                                  ? `${currentTheme.bg} shadow-sm`
                                  : "bg-white border-gray-100 hover:border-gray-100 hover:bg-gray-50/30"
                                }
                              `}
                            >
                              <div className={`
                                w-11 h-11 rounded-[18px] flex items-center justify-center transition-all duration-300 shrink-0
                                ${active
                                  ? currentTheme.iconBox
                                  : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                }
                              `}>
                                {item.icon}
                              </div>
                              <span className={`flex-1 text-[15px] font-bold transition-all ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                {item.label}
                              </span>
                              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shrink-0
                                ${active
                                  ? `${currentTheme.check} text-white scale-100`
                                  : "bg-gray-100 text-transparent scale-90"
                                }
                              `}>
                                <Check size={14} strokeWidth={4} className={active ? "opacity-100" : "opacity-0"} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Min Order Value Input */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-11 h-11 rounded-2xl bg-[#FFF7ED] text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                        <DollarSign size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Minimum Threshold</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Basket value filter</p>
                      </div>
                    </div>

                    <div className="relative group max-w-full">
                      <input
                        type="number"
                        placeholder="Enter min order value..."
                        value={filters.minOrderValue}
                        onChange={(e) => setFilters(prev => ({ ...prev, minOrderValue: e.target.value }))}
                        className="w-full bg-slate-100 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-[24px] py-6 px-6 text-xl font-anton text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 font-anton text-xl text-gray-300 pointer-events-none">Đ</div>
                    </div>
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
