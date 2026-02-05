'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, CheckCircle, AlertCircle, Filter, Check,
  RotateCcw, ShieldCheck, Lock, User, List
} from '@repo/ui/icons';
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
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (activeQuery.includes('user.isActive:true')) setSelectedStatus('active');
      else if (activeQuery.includes('user.isActive:false')) setSelectedStatus('disabled');
      else setSelectedStatus('');
    }
  }, [isOpen, activeQuery]);

  const handleReset = () => {
    setSelectedStatus('');
  };

  const handleApply = () => {
    let query = '';
    if (selectedStatus === 'active') {
      query = 'user.isActive:true';
    } else if (selectedStatus === 'disabled') {
      query = 'user.isActive:false';
    }
    onApply(query);
    onClose();
  };

  const activeCount = selectedStatus !== '' ? 1 : 0;

  const statusItems = [
    { key: '', label: 'All Customers', icon: <List size={20} />, theme: 'lime' },
    { key: 'active', label: 'Active Only', icon: <ShieldCheck size={20} />, theme: 'lime' },
    { key: 'disabled', label: 'Disabled Only', icon: <Lock size={20} />, theme: 'red' },
  ];

  const themeClasses: Record<string, any> = {
    gray: { bg: 'bg-gray-50 border-gray-100', text: 'text-gray-900', iconBox: 'bg-gray-100 text-gray-400', check: 'bg-gray-900' },
    lime: { bg: 'bg-lime-50 border-lime-100', text: 'text-lime-800', iconBox: 'bg-lime-200 text-lime-700', check: 'bg-lime-500' },
    red: { bg: 'bg-red-50 border-red-100', text: 'text-red-800', iconBox: 'bg-red-200 text-red-700', check: 'bg-red-500' },
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
              className="bg-[#F8F9FA] w-[800px] max-w-[98vw] rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col max-h-[95vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="relative px-9 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-lg shadow-black/10">
                      <Filter className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] tracking-tight uppercase">Customer Filters</h2>
                      <div className="flex items-center gap-2">
                        {activeCount > 0 && (
                          <span className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-lime-700 bg-lime-100 px-2 py-0.5 rounded-full border border-lime-200">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                  {/* Account Status Selection */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-11 h-11 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                        <ShieldCheck size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Account Status</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Select user activity state</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {statusItems.map((item, idx) => {
                        const active = selectedStatus === item.key;
                        const currentTheme = themeClasses[item.theme];
                        return (
                          <motion.div
                            key={item.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <button
                              onClick={() => setSelectedStatus(item.key)}
                              className={`
                                relative w-full text-left p-2.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                ${active
                                  ? `${currentTheme.bg} shadow-sm`
                                  : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
                                }
                              `}
                            >
                              <div className={`
                                w-11 h-11 rounded-[18px] flex items-center justify-center flex-shrink-0 transition-all duration-300
                                ${active
                                  ? currentTheme.iconBox
                                  : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                }
                              `}>
                                {item.icon}
                              </div>

                              <span className={`flex-1 text-[15px] font-bold tracking-tight transition-all ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                {item.label}
                              </span>

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

                  {/* Decorative Info Card */}
                  <div className="flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="p-8 rounded-[40px] bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden shadow-2xl"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-3xl" />
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10">
                          <User size={24} className="text-lime-400" />
                        </div>
                        <h4 className="text-xl font-anton mb-2 tracking-tight">CUSTOMER INSIGHTS</h4>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                          Use these filters to segment your customer base. You can view only active shoppers or identify disabled accounts that might need attention.
                        </p>
                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4">
                          <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-700 overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-lime-400 to-lime-600 opacity-50" />
                              </div>
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Advanced Segmentation</span>
                        </div>
                      </div>
                    </motion.div>
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
