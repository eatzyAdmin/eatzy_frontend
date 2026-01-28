'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, CheckCircle, AlertCircle, Calendar, Filter, Check,
  RotateCcw, Clock, CreditCard, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

interface FilterFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (query: string) => void;
  activeQuery: string;
}

const TRANSACTION_TYPES = [
  { label: 'Deposit', value: 'DEPOSIT', icon: ArrowDownLeft, color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-500' },
  { label: 'Withdrawal', value: 'WITHDRAWAL', icon: ArrowUpRight, color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-500' },
  { label: 'Payment', value: 'PAYMENT', icon: CreditCard, color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-500' },
  { label: 'Refund', value: 'REFUND', icon: RotateCcw, color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-500' },
  { label: 'Earning', value: 'EARNING', icon: CheckCircle, color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-500' },
  { label: 'Top Up', value: 'TOP_UP', icon: Clock, color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-500' },
];

const STATUS_CONFIG = {
  SUCCESS: { label: 'Success', icon: CheckCircle, color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-500' },
  PENDING: { label: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-500' },
  FAILED: { label: 'Failed', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-500' },
  COMPLETED: { label: 'Done', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-500' },
};

export default function FilterFinanceModal({
  isOpen,
  onClose,
  onApply,
  activeQuery
}: FilterFinanceModalProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Reset for initial simplicity, could parse activeQuery if needed
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

  const activeCount = selectedTypes.length + selectedStatuses.length;

  return (
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
              className="bg-white w-[800px] max-w-[95vw] rounded-[40px] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Filter className="w-6 h-6" />
                  </div>
                  FILTER LEDGER
                  {activeCount > 0 && (
                    <span className="text-sm font-sans font-medium text-primary bg-primary/10 px-3 py-1 rounded-full ml-1">
                      {activeCount} Selection
                    </span>
                  )}
                </h2>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all shadow-inner"
                    title="Reset Filters"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleApply}
                    className="p-4 rounded-full bg-[#1A1A1A] text-white hover:bg-primary transition-all shadow-xl shadow-black/10 hover:-translate-y-0.5"
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
                <div className="space-y-10">

                  {/* Transaction Status */}
                  <div className="space-y-5">
                    <label className="text-xs font-black text-gray-400 flex items-center gap-3 uppercase tracking-[0.2em]">
                      Settlement Status
                      <div className="flex-1 h-px bg-gray-100" />
                    </label>
                    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                        const isSelected = selectedStatuses.includes(status);
                        const Icon = config.icon;
                        return (
                          <button
                            key={status}
                            onClick={() => toggleStatus(status)}
                            className={`py-3 px-4 text-[10px] font-black rounded-2xl transition-all border-2 flex items-center justify-center gap-2 uppercase tracking-widest
                              ${isSelected
                                ? `${config.bg} ${config.color} ${config.border} shadow-lg scale-105`
                                : 'bg-white text-gray-400 border-gray-50 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <Icon size={12} strokeWidth={isSelected ? 3 : 2} />
                            {config.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Transaction Type */}
                  <div className="space-y-5">
                    <label className="text-xs font-black text-gray-400 flex items-center gap-3 uppercase tracking-[0.2em]">
                      Transaction Category
                      <div className="flex-1 h-px bg-gray-100" />
                    </label>
                    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
                      {TRANSACTION_TYPES.map(type => {
                        const Icon = type.icon;
                        const isSelected = selectedTypes.includes(type.value);

                        return (
                          <button
                            key={type.value}
                            onClick={() => toggleType(type.value)}
                            className={`py-4 px-6 text-sm font-bold rounded-[24px] transition-all border-2 text-left flex items-center gap-4 group
                                                                    ${isSelected
                                ? `${type.bg} ${type.color} ${type.border} shadow-md`
                                : 'bg-white text-gray-500 border-gray-50 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                                                            ${isSelected ? 'bg-white/50' : 'bg-gray-50 group-hover:bg-white border border-gray-100'}`}>
                              <Icon size={18} className={isSelected ? 'scale-110 transition-transform' : ''} />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <span className="text-[10px] uppercase font-black tracking-widest leading-none mb-1 opacity-60">Category</span>
                              <span className="font-anton uppercase text-lg tracking-tight leading-none">{type.label}</span>
                            </div>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-current shadow-lg" />}
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
    </AnimatePresence>
  );
}
