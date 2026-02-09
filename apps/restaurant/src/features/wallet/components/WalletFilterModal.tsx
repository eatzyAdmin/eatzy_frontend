'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, CheckCircle, AlertCircle, Calendar, Banknote, Filter, Check,
  RotateCcw, List, ArrowUpCircle, ArrowDownCircle, XCircle
} from '@repo/ui/icons';
import { PremiumDateRangePicker, PremiumPriceRangeFilter } from '@repo/ui';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface WalletFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterFields: {
    status: string;
    dateRange: DateRange;
    amountRange: { min: number; max: number }
  };
  onApply: (filters: {
    status: string;
    dateRange: DateRange;
    amountRange: { min: number; max: number }
  }) => void;
}

export default function WalletFilterModal({ isOpen, onClose, filterFields, onApply }: WalletFilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filterFields);
  const [sliderBounds, setSliderBounds] = useState({ min: -100000000, max: 100000000 });

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filterFields);
      // Smart bounds adjustment
      if (filterFields.amountRange.min >= 0) {
        setSliderBounds({ min: 0, max: 100000000 });
      } else if (filterFields.amountRange.max <= 0) {
        setSliderBounds({ min: -100000000, max: 0 });
      } else {
        setSliderBounds({ min: -100000000, max: 100000000 });
      }
    }
  }, [isOpen, filterFields]);

  const setStatus = (status: string) => {
    setLocalFilters(prev => ({ ...prev, status }));
  };

  const setDateRange = (range: DateRange) => {
    setLocalFilters(prev => ({ ...prev, dateRange: range }));
  };

  const setAmountRange = (range: { min: number; max: number }) => {
    setLocalFilters(prev => ({ ...prev, amountRange: range }));
  };

  const handleReset = () => {
    setLocalFilters({
      status: '',
      dateRange: { from: null, to: null },
      amountRange: { min: -100000000, max: 100000000 }
    });
    setSliderBounds({ min: -100000000, max: 100000000 });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const activeCount = [
    localFilters.status !== '',
    localFilters.dateRange.from !== null,
    localFilters.amountRange.min !== -100000000 || localFilters.amountRange.max !== 100000000
  ].filter(Boolean).length;

  const statusItems = [
    { key: '', label: 'All Status', icon: <List size={20} />, theme: 'lime' },
    { key: 'SUCCESS', label: 'Success', icon: <CheckCircle size={20} />, theme: 'lime' },
    { key: 'FAILED', label: 'Failed', icon: <XCircle size={20} />, theme: 'red' },
  ];

  const themeClasses: Record<string, any> = {
    gray: { bg: 'bg-gray-50 border-gray-100', text: 'text-gray-900', iconBox: 'bg-gray-100 text-gray-400', check: 'bg-gray-900' },
    lime: { bg: 'bg-lime-50 border-lime-100', text: 'text-lime-800', iconBox: 'bg-lime-200 text-lime-700', check: 'bg-lime-500' },
    red: { bg: 'bg-red-50 border-red-100', text: 'text-red-800', iconBox: 'bg-red-200 text-red-700', check: 'bg-red-500' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[60]"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-[1100px] max-w-[98vw] rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col max-h-[95vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="relative px-9 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-lg shadow-black/10">
                      <Filter className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] tracking-tight uppercase">Transaction Filters</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Refine wallet history</span>
                        {activeCount > 0 && (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-lime-700 bg-lime-100 px-2 py-0.5 rounded-full border border-lime-200">
                            <div className="w-1 h-1 rounded-full bg-lime-600 animate-pulse"></div>
                            {activeCount} ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {activeCount > 0 && (
                    <button
                      onClick={handleReset}
                      className="group flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-gray-400 font-bold text-xs border border-gray-100 shadow-sm hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all duration-300"
                    >
                      <RotateCcw className="w-4 h-4 group-hover:rotate-[-120deg] transition-transform duration-500" />
                      RESET ALL
                    </button>
                  )}

                  <button
                    onClick={handleApply}
                    className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-lime-500 text-white font-bold text-sm tracking-widest hover:bg-lime-600 transition-all shadow-[0_8px_30px_rgba(132,204,22,0.3)] hover:shadow-lime-300 hover:-translate-y-1 active:scale-95"
                  >
                    <Check className="w-5 h-5" strokeWidth={3} />
                    APPLY FILTERS
                  </button>

                  <div className="w-px h-10 bg-gray-200 ml-2 mr-2"></div>

                  <button
                    onClick={onClose}
                    className="p-4 rounded-full bg-gray-100 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:shadow-lg transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                  {/* Left Column: Date and Amount */}
                  <div className="xl:col-span-8 space-y-12">

                    {/* Date Range */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                          <Calendar size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Time Horizon</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Select transaction date range</p>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-[40px] shadow-sm border border-gray-100">
                        <PremiumDateRangePicker
                          dateRange={localFilters.dateRange}
                          onChange={setDateRange}
                        />
                      </div>
                    </div>

                    {/* Amount Range Slider */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#FFF7ED] text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                          <Banknote size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Amount Scope</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Filter by transaction value</p>
                        </div>
                      </div>
                      <PremiumPriceRangeFilter
                        min={sliderBounds.min}
                        max={sliderBounds.max}
                        step={100000}
                        value={localFilters.amountRange}
                        onChange={setAmountRange}
                      />
                    </div>
                  </div>

                  {/* Right Column: Status Selection & Cash Flow */}
                  <div className="xl:col-span-4 space-y-10">

                    {/* Section: Status Selection */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#F0FDF4] text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                          <CheckCircle size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Status Check</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Select transaction state</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {statusItems.map((item, idx) => {
                          const active = localFilters.status === item.key;
                          const currentTheme = themeClasses[item.theme];
                          return (
                            <motion.div
                              key={item.key}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <button
                                onClick={() => setStatus(item.key)}
                                className={`
                                  relative w-full text-left p-2.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                  ${active
                                    ? `${currentTheme.bg} shadow-sm border-lime-100`
                                    : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
                                  }
                                `}
                              >
                                {/* Icon Box */}
                                <div className={`
                                  w-11 h-11 rounded-[18px] flex items-center justify-center flex-shrink-0 transition-all duration-300
                                  ${active
                                    ? currentTheme.iconBox
                                    : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                  }
                                `}>
                                  {item.icon}
                                </div>

                                {/* Label */}
                                <span className={`flex-1 text-[15px] font-bold tracking-tight transition-all ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                  {item.label}
                                </span>

                                {/* Checkmark Circle at the end */}
                                <div className={`
                                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                                  ${active
                                    ? `${currentTheme.check} text-white scale-100`
                                    : "bg-gray-100 text-transparent scale-90"
                                  }
                                `}>
                                  <Check size={16} strokeWidth={4} className={active ? "opacity-100" : "opacity-0"} />
                                </div>
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Decorative Info Card moved here */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="p-6 rounded-[32px] bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden shadow-xl"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-3xl" />
                      <div className="relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 border border-white/10">
                          <AlertCircle size={20} className="text-lime-400" />
                        </div>
                        <h4 className="text-sm font-bold mb-1">Detailed Filtering</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-medium">Use multiple filters simultaneously to pinpoint specific transactions in your wallet history.</p>
                      </div>
                    </motion.div>

                    {/* Section: Cash Flow Mode */}
                    <div className="space-y-5 pt-2">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#FEF2F2] text-red-600 flex items-center justify-center border border-red-100 shadow-sm">
                          <RotateCcw size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Cash Flow</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Direct filter by direction</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {[
                          {
                            key: 'in',
                            label: 'Money In (Income)',
                            icon: <ArrowUpCircle size={20} />,
                            active: localFilters.amountRange.min >= 0 && localFilters.amountRange.max > 0,
                            theme: 'lime',
                            onClick: () => {
                              setAmountRange({ min: 0, max: 100000000 });
                              setSliderBounds({ min: 0, max: 100000000 });
                            }
                          },
                          {
                            key: 'out',
                            label: 'Money Out (Expense)',
                            icon: <ArrowDownCircle size={20} />,
                            active: localFilters.amountRange.max <= 0 && localFilters.amountRange.min < 0,
                            theme: 'red',
                            onClick: () => {
                              setAmountRange({ min: -100000000, max: 0 });
                              setSliderBounds({ min: -100000000, max: 0 });
                            }
                          },
                        ].map((item, idx) => {
                          const currentTheme = themeClasses[item.theme];
                          return (
                            <motion.div
                              key={item.key}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + idx * 0.05 }}
                            >
                              <button
                                onClick={item.onClick}
                                className={`
                                  relative w-full text-left p-2.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                  ${item.active
                                    ? `${currentTheme.bg} shadow-sm border-${item.theme === 'lime' ? 'lime-100' : 'red-100'}`
                                    : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
                                  }
                                `}
                              >
                                <div className={`
                                  w-11 h-11 rounded-[18px] flex items-center justify-center flex-shrink-0 transition-all duration-300
                                  ${item.active
                                    ? currentTheme.iconBox
                                    : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                  }
                                `}>
                                  {item.icon}
                                </div>
                                <span className={`flex-1 text-[15px] font-bold tracking-tight transition-all ${item.active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                  {item.label}
                                </span>
                                <div className={`
                                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                                  ${item.active
                                    ? `${currentTheme.check} text-white scale-100`
                                    : "bg-gray-100 text-transparent scale-90"
                                  }
                                `}>
                                  <Check size={16} strokeWidth={4} className={item.active ? "opacity-100" : "opacity-0"} />
                                </div>
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>


                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
