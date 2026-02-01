import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, CheckCircle, AlertCircle, Calendar, CreditCard, Filter, Check,
  RotateCcw, Banknote, Wallet, List, Clock, Package, Utensils, Truck, Bike, MapPin, XCircle
} from '@repo/ui/icons';
import WalletDateRangePicker from '@/features/wallet/components/WalletDateRangePicker';
import WalletPriceRangeFilter from '@/features/wallet/components/WalletPriceRangeFilter';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface OrderHistoryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterFields: {
    status: string;
    paymentMethod: string[];
    paymentStatus: string;
    dateRange: DateRange;
    amountRange: { min: number; max: number }
  };
  onApply: (filters: {
    status: string;
    paymentMethod: string[];
    paymentStatus: string;
    dateRange: DateRange;
    amountRange: { min: number; max: number }
  }) => void;
}

export default function OrderHistoryFilterModal({ isOpen, onClose, filterFields, onApply }: OrderHistoryFilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filterFields);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filterFields);
    }
  }, [isOpen, filterFields]);

  const setStatus = (status: string) => {
    setLocalFilters(prev => ({ ...prev, status }));
  };

  const setPaymentStatus = (paymentStatus: string) => {
    setLocalFilters(prev => ({ ...prev, paymentStatus }));
  };

  const togglePaymentMethod = (method: string) => {
    setLocalFilters(prev => {
      if (method === '') return { ...prev, paymentMethod: [] };

      const current = prev.paymentMethod;
      const newMethods = current.includes(method)
        ? current.filter(m => m !== method)
        : [...current, method];

      return { ...prev, paymentMethod: newMethods };
    });
  };

  const isPaymentSelected = (method: string) => {
    if (method === '') return localFilters.paymentMethod.length === 0;
    return localFilters.paymentMethod.includes(method);
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
      paymentMethod: [],
      paymentStatus: '',
      dateRange: { from: null, to: null },
      amountRange: { min: 0, max: 100000000 }
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const activeCount = [
    localFilters.status !== '',
    localFilters.paymentMethod.length > 0,
    localFilters.paymentStatus !== '',
    localFilters.dateRange.from !== null,
    localFilters.amountRange.min > 0 || localFilters.amountRange.max < 100000000
  ].filter(Boolean).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with enhanced blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[60]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-[1100px] max-w-[98vw] rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col max-h-[95vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header Container - Solid white to fix transparency artifacts at rounded corners */}
              <div className="relative px-9 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-lg shadow-black/10">
                      <Filter className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] tracking-tight">FILTER SYSTEM</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Refine your results</span>
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

              {/* Scrollable Body Content */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12">

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                  {/* Left Section: Visual Parameters (Date & Range) */}
                  <div className="xl:col-span-12 space-y-10">
                    {/* Date Range Section */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                          <Calendar size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Time Horizon</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Select date range for filtering</p>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-[40px] shadow-sm border border-gray-100">
                        <WalletDateRangePicker
                          dateRange={localFilters.dateRange}
                          onChange={setDateRange}
                        />
                      </div>
                    </div>

                    {/* Amount Range Section */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#FFF7ED] text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                          <Banknote size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Amount Scope</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Refine by order value range</p>
                        </div>
                      </div>
                      <WalletPriceRangeFilter
                        min={0}
                        max={100000000}
                        step={10000}
                        value={localFilters.amountRange}
                        onChange={setAmountRange}
                      />
                    </div>
                  </div>

                  {/* Bottom Row: Multiple Selection Areas */}
                  <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-gray-100">

                    {/* 1. Payment Method */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#F7FEE7] text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                          <CreditCard size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Billing Flow</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Payment Method Selection</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { key: '', label: 'All Methods', icon: <List size={18} /> },
                          { key: 'COD', label: 'Cash on Delivery', icon: <Banknote size={18} /> },
                          { key: 'VNPAY', label: 'VNPAY Gateway', icon: <CreditCard size={18} /> },
                          { key: 'WALLET', label: 'Eatzy Wallet', icon: <Wallet size={18} /> },
                        ].map((item) => {
                          const active = isPaymentSelected(item.key);
                          return (
                            <button
                              key={item.key}
                              onClick={() => togglePaymentMethod(item.key)}
                              className={`
                                relative w-full text-left p-2.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                ${active
                                  ? "bg-lime-50 border-lime-100 shadow-sm"
                                  : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
                                }
                              `}
                            >
                              {/* Icon Box */}
                              <div className={`
                                w-11 h-11 rounded-[18px] flex items-center justify-center flex-shrink-0 transition-all duration-300
                                ${active
                                  ? 'bg-lime-200 text-lime-700'
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
                                  ? "bg-lime-500 text-white scale-100"
                                  : "bg-gray-100 text-transparent scale-90"
                                }
                              `}>
                                <Check size={16} strokeWidth={4} className={active ? "opacity-100" : "opacity-0"} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Payment Status */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#F7FEE7] text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                          <CheckCircle size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Settlement</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Financial Status Filter</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { key: '', label: 'All Status', icon: <List size={18} /> },
                          { key: 'PAID', label: 'Fully Paid', icon: <CheckCircle size={18} /> },
                          { key: 'UNPAID', label: 'Outstanding', icon: <Clock size={18} /> },
                          { key: 'REFUNDED', label: 'Reversed', icon: <RotateCcw size={18} /> },
                        ].map((item) => {
                          const active = localFilters.paymentStatus === item.key;
                          return (
                            <button
                              key={item.key}
                              onClick={() => setPaymentStatus(item.key)}
                              className={`
                                relative w-full text-left p-2.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                ${active
                                  ? "bg-lime-50 border-lime-100 shadow-sm"
                                  : "bg-white border-gray-100 hover:border-gray-100 hover:bg-gray-50/30"
                                }
                              `}
                            >
                              {/* Icon Box */}
                              <div className={`
                                w-11 h-11 rounded-[18px] flex items-center justify-center flex-shrink-0 transition-all duration-300
                                ${active
                                  ? 'bg-lime-200 text-lime-700'
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
                                  ? "bg-lime-500 text-white scale-100"
                                  : "bg-gray-100 text-transparent scale-90"
                                }
                              `}>
                                <Check size={16} strokeWidth={4} className={active ? "opacity-100" : "opacity-0"} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Order Status */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#F7FEE7] text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                          <Package size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Logistics</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Operational State Tracker</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-2">
                        {[
                          { key: '', label: 'All Actions', group: 'green', icon: <List size={18} /> },
                          { key: 'Pending Ops', label: 'Pending Ops', group: 'yellow', icon: <Clock size={18} /> },
                          { key: 'In Kitchen', label: 'In Kitchen', group: 'yellow', icon: <Utensils size={18} /> },
                          { key: 'Ready to Ship', label: 'Ready to Ship', group: 'yellow', icon: <Package size={18} /> },
                          { key: 'Driver Out', label: 'Driver Out', group: 'yellow', icon: <Bike size={18} /> },
                          { key: 'In Transit', label: 'In Transit', group: 'yellow', icon: <Truck size={18} /> },
                          { key: 'Nearby', label: 'Nearby', group: 'green', icon: <MapPin size={18} /> },
                          { key: 'Have Dinner', label: 'Have Dinner', group: 'green', icon: <CheckCircle size={18} /> },
                          { key: 'Voided', label: 'Voided', group: 'red', icon: <XCircle size={18} /> },
                        ].map((item) => {
                          const active = localFilters.status === item.key;

                          let themeColor = 'lime';
                          if (item.group === 'yellow') themeColor = 'amber';
                          else if (item.group === 'red') themeColor = 'red';

                          const themeClasses: Record<string, any> = {
                            lime: {
                              bg: 'bg-lime-50 border-lime-100',
                              check: 'bg-lime-500',
                              iconBox: 'bg-lime-200 text-lime-700',
                            },
                            amber: {
                              bg: 'bg-amber-50 border-amber-100',
                              check: 'bg-amber-500',
                              iconBox: 'bg-amber-200 text-amber-700',
                            },
                            red: {
                              bg: 'bg-red-50 border-red-100',
                              check: 'bg-red-500',
                              iconBox: 'bg-red-200 text-red-700',
                            }
                          };

                          return (
                            <button
                              key={item.key}
                              onClick={() => setStatus(item.key)}
                              className={`
                                relative w-full text-left p-2.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                ${active
                                  ? `${themeClasses[themeColor].bg} shadow-sm`
                                  : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
                                }
                              `}
                            >
                              {/* Icon Box */}
                              <div className={`
                                w-10 h-10 rounded-[16px] flex items-center justify-center flex-shrink-0 transition-all duration-300
                                ${active
                                  ? themeClasses[themeColor].iconBox
                                  : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                }
                              `}>
                                {item.icon}
                              </div>

                              {/* Label */}
                              <span className={`flex-1 text-[14px] font-bold tracking-tight transition-all ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                {item.label}
                              </span>

                              {/* Checkmark Circle at the end */}
                              <div className={`
                                w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                                ${active
                                  ? `${themeClasses[themeColor].check} text-white scale-100`
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
                </div>
              </div>



            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
