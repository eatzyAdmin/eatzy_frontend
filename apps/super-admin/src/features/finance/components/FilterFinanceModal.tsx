'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, CheckCircle, AlertCircle, Filter, Check,
  RotateCcw, Clock, CreditCard, ArrowUpRight, ArrowDownLeft, Banknote, List, Receipt
} from '@repo/ui/icons';
import { createPortal } from 'react-dom';

interface FilterFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (query: string) => void;
  activeQuery: string;
}

const TRANSACTION_TYPES = [
  { label: 'Deposit', value: 'DEPOSIT', icon: <ArrowDownLeft size={20} />, theme: 'lime', desc: 'Inbound funds' },
  { label: 'Withdrawal', value: 'WITHDRAWAL', icon: <ArrowUpRight size={20} />, theme: 'lime', desc: 'Outbound payouts' },
  { label: 'Payment', value: 'PAYMENT', icon: <CreditCard size={20} />, theme: 'lime', desc: 'Sale transactions' },
  { label: 'Refund', value: 'REFUND', icon: <RotateCcw size={20} />, theme: 'lime', desc: 'Credited reversals' },
  { label: 'Earning', value: 'EARNING', icon: <CheckCircle size={20} />, theme: 'lime', desc: 'Commission accruals' },
  { label: 'Top Up', value: 'TOP_UP', icon: <Clock size={20} />, theme: 'lime', desc: 'Balance replenishment' },
];

const STATUS_CONFIG = [
  { key: 'SUCCESS', label: 'Success', icon: <CheckCircle size={20} />, theme: 'lime' },
  { key: 'PENDING', label: 'Pending', icon: <Clock size={20} />, theme: 'amber' },
  { key: 'FAILED', label: 'Failed', icon: <AlertCircle size={20} />, theme: 'red' },
  { key: 'COMPLETED', label: 'Completed', icon: <CheckCircle size={20} />, theme: 'lime' },
];

export default function FilterFinanceModal({
  isOpen,
  onClose,
  onApply,
  activeQuery
}: FilterFinanceModalProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedTypes([]);
      setSelectedStatuses([]);
    }
  }, [isOpen, activeQuery]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
  };

  const handleApply = () => {
    let queries: string[] = [];
    if (selectedTypes.length > 0) {
      queries.push(`transactionType in [${selectedTypes.map(t => `'${t}'`).join(',')}]`);
    }
    if (selectedStatuses.length > 0) {
      queries.push(`status in [${selectedStatuses.map(s => `'${s}'`).join(',')}]`);
    }
    onApply(queries.join(' and '));
    onClose();
  };

  const themeClasses: Record<string, any> = {
    lime: { bg: 'bg-lime-50 border-lime-100', text: 'text-lime-800', iconBox: 'bg-lime-200 text-lime-700', check: 'bg-lime-500' },
    amber: { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-800', iconBox: 'bg-amber-200 text-amber-700', check: 'bg-amber-500' },
    red: { bg: 'bg-red-50 border-red-100', text: 'text-red-800', iconBox: 'bg-red-200 text-red-700', check: 'bg-red-500' },
  };

  const activeCount = selectedTypes.length + selectedStatuses.length;

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
              className="bg-[#F8F9FA] w-[850px] max-w-[98vw] rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col max-h-[95vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="relative px-9 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-lg shadow-black/10">
                      <Filter className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] tracking-tight uppercase">Ledger Filtering</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Finance</span>
                        {activeCount > 0 && (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-lime-700 bg-lime-100 px-2 py-0.5 rounded-full border border-lime-200">
                            <div className="w-1 h-1 rounded-full bg-lime-600 animate-pulse"></div>
                            {activeCount} SELECTIONS
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
              <div className="flex-1 overflow-y-auto p-12">
                <div className="max-w-5xl mx-auto space-y-12">

                  {/* Settlement Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                        <CheckCircle size={26} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Settlement Scope</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Filter by transaction state</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {STATUS_CONFIG.map((item) => {
                        const active = selectedStatuses.includes(item.key);
                        const currentTheme = themeClasses[item.theme];
                        return (
                          <button
                            key={item.key}
                            onClick={() => toggleStatus(item.key)}
                            className={`
                              relative text-left p-3.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                              ${active
                                ? `${currentTheme.bg} shadow-sm`
                                : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
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

                  {/* Transaction Class Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                      <div className="w-12 h-12 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                        <Banknote size={26} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Transaction Class</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Select ledger categories</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {TRANSACTION_TYPES.map((item) => {
                        const active = selectedTypes.includes(item.value);
                        const currentTheme = themeClasses[item.theme];
                        return (
                          <button
                            key={item.value}
                            onClick={() => toggleType(item.value)}
                            className={`
                              relative text-left p-5 rounded-[40px] border-2 transition-all duration-300 group flex flex-col items-center justify-center gap-4 min-h-[145px]
                              ${active
                                ? `${currentTheme.bg} shadow-sm`
                                : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
                              }
                            `}
                          >
                            <div className={`
                              w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-300
                              ${active
                                ? currentTheme.iconBox
                                : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                              }
                            `}>
                              {item.icon}
                            </div>
                            <div className="text-center">
                              <span className={`block text-[16px] font-bold transition-all ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                {item.label}
                              </span>
                              <p className={`text-[9px] mt-1 font-bold uppercase tracking-widest transition-all ${active ? "text-lime-700/60" : "text-gray-400"}`}>
                                {item.desc}
                              </p>
                            </div>

                            <div className={`
                              absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500
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
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
