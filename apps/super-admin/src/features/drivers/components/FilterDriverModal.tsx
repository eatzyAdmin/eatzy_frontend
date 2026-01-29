'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  Filter, X, RotateCcw, Check,
  Clock, ShieldCheck, Wallet, Bike,
  FileText, Pause, Play, Navigation
} from 'lucide-react';
import { Lock } from '@repo/ui';

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

    if (status.length > 0) {
      filters.push(`status in [${status.map(s => `'${s}'`).join(',')}]`);
    }

    if (accountStatus.includes('active')) {
      filters.push('user.isActive:true');
    } else if (accountStatus.includes('locked')) {
      filters.push('user.isActive:false');
    }

    if (verification.includes('NATIONAL_ID')) {
      filters.push("national_id_status == 'APPROVED'");
    }
    if (verification.includes('LICENSE')) {
      filters.push("driver_license_status == 'APPROVED'");
    }
    if (verification.includes('BANK')) {
      filters.push("bank_account_status == 'APPROVED'");
    }

    if (vehicleType.length > 0) {
      filters.push(`vehicle_type in [${vehicleType.map(v => `'${v}'`).join(',')}]`);
    }

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
    setStatus(current => current.includes(s) ? current.filter(i => i !== s) : [...current, s]);
  };

  const toggleAccountStatus = (s: string) => {
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
                  FILTER DRIVERS
                  {activeCount > 0 && (
                    <span className="text-sm font-sans font-medium text-primary bg-lime-50 px-3 py-1 rounded-full ml-1">
                      {activeCount} Active Section{activeCount > 1 ? 's' : ''}
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
              <div className="flex-1 overflow-y-auto pr-2 pb-4 custom-scrollbar space-y-10">
                {/* Account Status */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={16} className="text-lime-500" />
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Account Security (Lock/Unlock)</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => toggleAccountStatus('active')}
                      className={`flex items-center justify-between p-5 rounded-[24px] border-2 transition-all
                        ${accountStatus.includes('active')
                          ? 'bg-lime-50 border-lime-500 shadow-lg shadow-lime-500/10'
                          : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 shadow-sm'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accountStatus.includes('active') ? 'bg-lime-500 text-white' : 'bg-white text-gray-400'}`}>
                          <ShieldCheck size={18} />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-tight ${accountStatus.includes('active') ? 'text-lime-700' : 'text-gray-500'}`}>
                          Unlocked Only
                        </span>
                      </div>
                      {accountStatus.includes('active') && <Check size={18} className="text-lime-500" />}
                    </button>

                    <button
                      onClick={() => toggleAccountStatus('locked')}
                      className={`flex items-center justify-between p-5 rounded-[24px] border-2 transition-all
                        ${accountStatus.includes('locked')
                          ? 'bg-red-50 border-red-500 shadow-lg shadow-red-500/10'
                          : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 shadow-sm'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accountStatus.includes('locked') ? 'bg-red-500 text-white' : 'bg-white text-gray-400'}`}>
                          <Lock size={18} />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-tight ${accountStatus.includes('locked') ? 'text-red-700' : 'text-gray-500'}`}>
                          Locked Only
                        </span>
                      </div>
                      {accountStatus.includes('locked') && <Check size={18} className="text-red-500" />}
                    </button>
                  </div>
                </section>

                {/* Status Selection */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={16} className="text-blue-500" />
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Status</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {['AVAILABLE', 'BUSY', 'OFFLINE'].map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleStatus(s)}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 group
                          ${status.includes(s)
                            ? 'bg-lime-50 border-lime-500 shadow-[0_8px_16px_rgba(132,204,22,0.1)]'
                            : 'bg-white border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className={`p-2 rounded-xl border ${status.includes(s) ? 'bg-lime-500 text-white border-lime-500' : 'bg-gray-50 text-gray-400 border-gray-100 group-hover:bg-white group-hover:border-gray-200'}`}>
                            {s === 'AVAILABLE' ? <Play size={16} /> : s === 'BUSY' ? <Navigation size={16} /> : <Pause size={16} />}
                          </div>
                          {status.includes(s) && <Check size={16} className="text-lime-500" />}
                        </div>
                        <span className={`text-xs font-anton uppercase tracking-wider ${status.includes(s) ? 'text-gray-900' : 'text-gray-400'}`}>
                          {s === 'AVAILABLE' ? 'Ready to Work' : s === 'BUSY' ? 'In Delivery' : 'Not Working'}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Verification Checkpoint */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={16} className="text-lime-500" />
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Compliance & Verification</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'NATIONAL_ID', label: 'Verified ID Card', icon: <FileText size={18} /> },
                      { id: 'LICENSE', label: 'Valid Driving License', icon: <Bike size={18} /> },
                      { id: 'BANK', label: 'Approved Payout Method', icon: <Wallet size={18} /> }
                    ].map((v) => (
                      <button
                        key={v.id}
                        onClick={() => toggleVerification(v.id)}
                        className={`flex items-center justify-between p-5 rounded-[24px] border-2 transition-all
                          ${verification.includes(v.id)
                            ? 'bg-lime-50 border-lime-500 shadow-lg shadow-lime-500/10'
                            : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 shadow-sm'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${verification.includes(v.id) ? 'bg-lime-500 text-white' : 'bg-white text-gray-400'}`}>
                            {v.icon}
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-tight ${verification.includes(v.id) ? 'text-lime-700' : 'text-gray-500'}`}>
                            {v.label}
                          </span>
                        </div>
                        {verification.includes(v.id) && <Check size={18} className="text-lime-500" />}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Vehicle Types */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Bike size={16} className="text-lime-500" />
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fleet Classification</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {['Motorcycle', 'Electric Bike'].map((v) => (
                      <button
                        key={v}
                        onClick={() => toggleVehicle(v)}
                        className={`px-6 py-3 rounded-2xl border transition-all text-xs font-bold uppercase tracking-widest
                          ${vehicleType.includes(v)
                            ? 'bg-lime-100 border-lime-300 text-lime-700 shadow-md translate-y-[-2px]'
                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
