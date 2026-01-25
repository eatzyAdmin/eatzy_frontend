'use client';

import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Check, Building2, Tag, Filter, RotateCcw, Activity, DollarSign, Clock, CheckCircle, Ban, Percent, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[150]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-[1000px] max-w-[95vw] rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3 underline-offset-8">
                  <div className="w-12 h-12 rounded-full bg-lime-50 text-lime-500 flex items-center justify-center">
                    <Filter className="w-6 h-6" />
                  </div>
                  FILTER CAMPAIGNS
                  {activeCount > 0 && (
                    <span className="text-sm font-sans font-medium text-lime-700 bg-lime-50 px-3 py-1 rounded-full ml-1">
                      {activeCount} Active
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

                  {/* Campaign Status */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <Activity size={18} className="text-primary" />
                      Campaign Status
                    </label>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-3 gap-3">
                      {[
                        { label: 'All', value: '', icon: Filter, activeColor: 'bg-gray-50 text-gray-700 border-gray-500' },
                        { label: 'Running', value: 'true', icon: CheckCircle, activeColor: 'bg-lime-50 text-lime-700 border-lime-500' },
                        { label: 'Paused', value: 'false', icon: Ban, activeColor: 'bg-amber-50 text-amber-700 border-amber-500' },
                      ].map(status => {
                        const Icon = status.icon;
                        const isSelected = filters.active === status.value;
                        return (
                          <button
                            key={status.label}
                            onClick={() => setFilters(prev => ({ ...prev, active: status.value }))}
                            className={`py-4 px-6 text-sm font-bold rounded-2xl transition-all border-2 text-left flex items-center gap-4 group
                              ${isSelected
                                ? `${status.activeColor} shadow-md`
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/50' : 'bg-gray-100 group-hover:bg-white transition-colors'}`}>
                              <Icon size={18} />
                            </div>
                            <span className="flex-1">{status.label}</span>
                            {isSelected && <CheckCircle className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Discount Type */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <Tag size={18} className="text-primary" />
                      Promotion Type
                    </label>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 gap-3">
                      {[
                        { label: 'All', value: '', icon: Filter },
                        { label: 'Percentage (%)', value: DiscountType.PERCENTAGE, icon: Percent },
                        { label: 'Fixed (đ)', value: DiscountType.FIXED, icon: DollarSign },
                        { label: 'Free Ship', value: DiscountType.FREESHIP, icon: Truck },
                      ].map(type => {
                        const Icon = type.icon;
                        const isSelected = filters.discountType === type.value;
                        return (
                          <button
                            key={type.label}
                            onClick={() => setFilters(prev => ({ ...prev, discountType: type.value }))}
                            className={`py-4 px-6 text-sm font-bold rounded-2xl transition-all border-2 text-left flex items-center gap-4 group
                              ${isSelected
                                ? 'bg-lime-50 text-lime-700 border-lime-500 shadow-md'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/50' : 'bg-gray-100 group-hover:bg-white transition-colors'}`}>
                              <Icon size={18} />
                            </div>
                            <span className="flex-1">{type.label}</span>
                            {isSelected && <CheckCircle className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Min Order Value */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <DollarSign size={18} className="text-primary" />
                      Minimum Order Value (&gt;=)
                    </label>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="relative max-w-xl mx-auto group">
                        <input
                          type="number"
                          placeholder="Nhập giá trị tối thiểu..."
                          value={filters.minOrderValue}
                          onChange={(e) => setFilters({ ...filters, minOrderValue: e.target.value })}
                          className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-primary/20 rounded-[20px] py-5 px-8 text-xl font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 font-anton text-2xl text-gray-300">đ</div>
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
