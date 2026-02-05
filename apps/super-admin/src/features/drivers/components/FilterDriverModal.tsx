'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  Filter, X, RotateCcw, Check,
  Clock, ShieldCheck, Wallet, Bike,
  FileText, Pause, Play, Navigation, Lock, List, Truck, CheckCircle,
  AlertCircle
} from '@repo/ui/icons';

interface FilterDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (query: string) => void;
  activeQuery?: string;
}

export default function FilterDriverModal({
  isOpen,
  onClose,
  onApply,
  activeQuery = ''
}: FilterDriverModalProps) {
  const [status, setStatus] = useState<string[]>([]);
  const [accountStatus, setAccountStatus] = useState<string[]>([]);
  const [verification, setVerification] = useState<string[]>([]);
  const [vehicleType, setVehicleType] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (activeQuery) {
        if (activeQuery.includes('user.isActive:true')) setAccountStatus(['active']);
        else if (activeQuery.includes('user.isActive:false')) setAccountStatus(['locked']);
        else setAccountStatus([]);
      } else {
        setStatus([]);
        setAccountStatus([]);
        setVerification([]);
        setVehicleType([]);
      }
    }
  }, [isOpen, activeQuery]);

  const handleApply = () => {
    const filters: string[] = [];
    if (status.length > 0) filters.push(`status in [${status.map(s => `'${s}'`).join(',')}]`);
    if (accountStatus.includes('active')) filters.push('user.isActive:true');
    else if (accountStatus.includes('locked')) filters.push('user.isActive:false');
    if (verification.includes('NATIONAL_ID')) filters.push("national_id_status == 'APPROVED'");
    if (verification.includes('LICENSE')) filters.push("driver_license_status == 'APPROVED'");
    if (verification.includes('BANK')) filters.push("bank_account_status == 'APPROVED'");
    if (vehicleType.length > 0) filters.push(`vehicle_type in [${vehicleType.map(v => `'${v}'`).join(',')}]`);
    onApply(filters.join(' and '));
    onClose();
  };

  const handleReset = () => {
    setStatus([]);
    setAccountStatus([]);
    setVerification([]);
    setVehicleType([]);
  };

  const toggleStatus = (s: string) => {
    if (s === '') { setStatus([]); return; }
    setStatus(current => current.includes(s) ? current.filter(i => i !== s) : [...current, s]);
  };

  const toggleAccountStatus = (s: string) => {
    if (s === '') { setAccountStatus([]); return; }
    setAccountStatus(current => current.includes(s) ? [] : [s]);
  };

  const toggleVerification = (v: string) => {
    setVerification(current => current.includes(v) ? current.filter(i => i !== v) : [...current, v]);
  };

  const toggleVehicle = (v: string) => {
    setVehicleType(current => current.includes(v) ? current.filter(i => i !== v) : [...current, v]);
  };

  if (!mounted) return null;

  const activeCount = (status.length > 0 ? 1 : 0) + (accountStatus.length > 0 ? 1 : 0) + (verification.length > 0 ? 1 : 0) + (vehicleType.length > 0 ? 1 : 0);

  const themeClasses: Record<string, any> = {
    lime: { bg: 'bg-lime-50 border-lime-100', text: 'text-lime-800', iconBox: 'bg-lime-200 text-lime-700', check: 'bg-lime-500' },
    amber: { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-800', iconBox: 'bg-amber-200 text-amber-700', check: 'bg-amber-500' },
    red: { bg: 'bg-red-50 border-red-100', text: 'text-red-800', iconBox: 'bg-red-200 text-red-700', check: 'bg-red-500' },
    gray: { bg: 'bg-gray-50 border-gray-100', text: 'text-gray-900', iconBox: 'bg-gray-100 text-gray-400', check: 'bg-gray-900' },
  };

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
              className="bg-[#F8F9FA] w-[1100px] max-w-[98vw] rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col max-h-[95vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="relative px-6 py-5 md:px-9 md:py-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 bg-white">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-lg shadow-black/10 shrink-0">
                    <Filter className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-anton font-bold text-[#1A1A1A] tracking-tight uppercase leading-none">Driver Filtering</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Refine fleet operations</span>
                      {activeCount > 0 && (
                        <span className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-lime-700 bg-lime-100 px-2 py-0.5 rounded-full border border-lime-200">
                          <div className="w-1 h-1 rounded-full bg-lime-600 animate-pulse"></div>
                          {activeCount} ACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
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
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-3xl bg-lime-500 text-white font-bold text-xs md:text-sm tracking-widest hover:bg-lime-600 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                  >
                    <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                    APPLY FILTERS
                  </button>

                  <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                  {/* Column 1: Account & Fleet */}
                  <div className="space-y-10">
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                          <ShieldCheck size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Account Trust</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Security & state</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { key: '', label: 'All Accounts', icon: <List size={20} />, theme: 'lime' },
                          { key: 'active', label: 'Active (Unlocked)', icon: <ShieldCheck size={20} />, theme: 'lime' },
                          { key: 'locked', label: 'Locked Accounts', icon: <Lock size={20} />, theme: 'red' },
                        ].map((item) => {
                          const active = (item.key === '' && accountStatus.length === 0) || accountStatus.includes(item.key);
                          const currentTheme = themeClasses[item.theme];
                          return (
                            <button
                              key={item.label}
                              onClick={() => toggleAccountStatus(item.key)}
                              className={`
                                relative w-full text-left p-2.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                ${active
                                  ? `${currentTheme.bg} shadow-sm`
                                  : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
                                }
                              `}
                            >
                              <div className={`
                                w-10 h-10 rounded-[16px] flex items-center justify-center transition-all duration-300
                                ${active
                                  ? currentTheme.iconBox
                                  : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                }
                              `}>
                                {item.icon}
                              </div>
                              <span className={`flex-1 text-[14px] font-bold transition-all ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                {item.label}
                              </span>
                              <div className={`
                                w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500
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

                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                          <Bike size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Fleet Type</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Vehicle classification</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { key: 'Motorcycle', label: 'Gas Motorcycle', icon: <Bike size={20} />, theme: 'lime' },
                          { key: 'Electric Bike', label: 'Electric Bike', icon: <Truck size={20} />, theme: 'lime' },
                        ].map((item) => {
                          const active = vehicleType.includes(item.key);
                          const currentTheme = themeClasses[item.theme];
                          return (
                            <button
                              key={item.key}
                              onClick={() => toggleVehicle(item.key)}
                              className={`
                                relative w-full text-left p-2.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                ${active
                                  ? `${currentTheme.bg} shadow-sm`
                                  : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
                                }
                              `}
                            >
                              <div className={`
                                w-10 h-10 rounded-[16px] flex items-center justify-center transition-all duration-300
                                ${active
                                  ? currentTheme.iconBox
                                  : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                }
                              `}>
                                {item.icon}
                              </div>
                              <span className={`flex-1 text-[14px] font-bold transition-all ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                {item.label}
                              </span>
                              <div className={`
                                w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500
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

                  {/* Column 2: Operational Status */}
                  <div className="space-y-10">
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                          <Clock size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Current Pulse</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Operational Activity</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { key: '', label: 'All Status', icon: <List size={20} />, theme: 'lime' },
                          { key: 'AVAILABLE', label: 'Ready to Work', icon: <Play size={20} />, theme: 'lime' },
                          { key: 'BUSY', label: 'Busy (In Delivery)', icon: <Navigation size={20} />, theme: 'amber' },
                          { key: 'OFFLINE', label: 'Offline / Rest', icon: <Pause size={20} />, theme: 'red' },
                        ].map((item) => {
                          const active = (item.key === '' && status.length === 0) || status.includes(item.key);
                          const currentTheme = themeClasses[item.theme];
                          return (
                            <button
                              key={item.label}
                              onClick={() => toggleStatus(item.key)}
                              className={`
                                relative w-full text-left p-2.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                ${active
                                  ? `${currentTheme.bg} shadow-sm`
                                  : "bg-white border-gray-100 hover:border-gray-100 hover:bg-gray-50/30"
                                }
                              `}
                            >
                              <div className={`
                                w-10 h-10 rounded-[16px] flex items-center justify-center transition-all duration-300
                                ${active
                                  ? currentTheme.iconBox
                                  : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                }
                              `}>
                                {item.icon}
                              </div>
                              <span className={`flex-1 text-[14px] font-bold transition-all ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                {item.label}
                              </span>
                              <div className={`
                                w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500
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

                  {/* Column 3: Compliance & Verification */}
                  <div className="space-y-10">
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-11 h-11 rounded-2xl bg-[#FFF7ED] text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                          <CheckCircle size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1A1A1A] tracking-tight leading-none uppercase">Compliance</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">KYC & Document Verification</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: 'NATIONAL_ID', label: 'Verified ID Card', icon: <FileText size={20} /> },
                          { id: 'LICENSE', label: 'Valid Driving License', icon: <Bike size={20} /> },
                          { id: 'BANK', label: 'Approved Bank Payout', icon: <Wallet size={20} /> }
                        ].map((v) => {
                          const active = verification.includes(v.id);
                          return (
                            <button
                              key={v.label}
                              onClick={() => toggleVerification(v.id)}
                              className={`
                                relative w-full text-left p-2.5 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
                                ${active
                                  ? "bg-orange-50 border-orange-100 shadow-sm"
                                  : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
                                }
                              `}
                            >
                              <div className={`
                                w-10 h-10 rounded-[16px] flex items-center justify-center transition-all duration-300
                                ${active
                                  ? 'bg-orange-200 text-orange-700'
                                  : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                }
                              `}>
                                {v.icon}
                              </div>
                              <span className={`flex-1 text-[14px] font-bold transition-all ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                {v.label}
                              </span>
                              <div className={`
                                w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500
                                ${active
                                  ? "bg-orange-500 text-white scale-100"
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
    </AnimatePresence>,
    document.body
  );
}
