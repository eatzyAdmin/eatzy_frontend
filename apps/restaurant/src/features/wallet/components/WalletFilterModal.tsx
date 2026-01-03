import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, CheckCircle, AlertCircle, Calendar, CreditCard, Filter, Check, RotateCcw } from '@repo/ui/icons';
import WalletDateRangePicker from './WalletDateRangePicker';
import WalletPriceRangeFilter from './WalletPriceRangeFilter';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface WalletFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterFields: { status: string; dateRange: DateRange; amountRange: { min: number; max: number } };
  onApply: (filters: { status: string; dateRange: DateRange; amountRange: { min: number; max: number } }) => void;
}

export default function WalletFilterModal({ isOpen, onClose, filterFields, onApply }: WalletFilterModalProps) {
  // Local state to hold changes before applying
  const [localFilters, setLocalFilters] = useState(filterFields);

  // Sync local state when modal opens or props change
  // Dynamic slider bounds based on filter selection
  const [sliderBounds, setSliderBounds] = useState({ min: -100000000, max: 100000000 });

  // Sync local state when modal opens or props change
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

  // Count active filters for badge
  const activeCount = [
    localFilters.status !== '',
    localFilters.dateRange.from !== null,
    localFilters.amountRange.min > 0 || localFilters.amountRange.max < 100000000
  ].filter(Boolean).length;

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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-[1000px] max-w-[95vw] rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center">
                    <Filter className="w-6 h-6" />
                  </div>
                  FILTER TRANSACTIONS
                  {activeCount > 0 && (
                    <span className="text-sm font-sans font-medium text-lime-700 bg-lime-100 px-3 py-1 rounded-full ml-1">
                      {activeCount} Active
                    </span>
                  )}
                </h2>

                <div className="flex items-center gap-3">
                  {/* Reset Button */}
                  <button
                    onClick={handleReset}
                    className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all"
                    title="Reset Filters"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  {/* Apply Button */}
                  <button
                    onClick={handleApply}
                    className="p-4 rounded-full bg-gray-100 text-gray-700 hover:bg-lime-500 hover:text-white transition-all shadow-sm hover:shadow-lime-200 hover:-translate-y-0.5"
                    title="Apply Filters"
                  >
                    <Check className="w-5 h-5" strokeWidth={3} />
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="p-4 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body - Scrollable */}
              <div className="flex-1 overflow-y-auto pr-2 pb-4 custom-scrollbar">
                <div className="space-y-8">

                  {/* Section 1: Date Range */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <Calendar size={18} className="text-lime-600" />
                      Date Custom Range
                    </label>
                    <div className="max-w-3xl mx-auto">
                      <WalletDateRangePicker
                        dateRange={localFilters.dateRange}
                        onChange={setDateRange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Section 2: Amount Range */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                        <CreditCard size={18} className="text-lime-600" />
                        Amount Range
                      </label>
                      <div className="flex flex-col gap-3">
                        <WalletPriceRangeFilter
                          min={sliderBounds.min}
                          max={sliderBounds.max}
                          step={100000}
                          value={localFilters.amountRange}
                          onChange={setAmountRange}
                        />
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <button
                            onClick={() => {
                              setAmountRange({ min: 0, max: 100000000 });
                              setSliderBounds({ min: 0, max: 100000000 });
                            }}
                            className={`w-full py-3 px-3 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center justify-between group ${localFilters.amountRange.min >= 0 && localFilters.amountRange.max > 0
                                ? 'bg-lime-50 text-lime-800 border-lime-500 shadow-lg shadow-lime-100'
                                : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <span className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${localFilters.amountRange.min >= 0 && localFilters.amountRange.max > 0 ? 'bg-lime-500' : 'bg-gray-300'}`} />
                              Money In
                            </span>
                            {localFilters.amountRange.min >= 0 && localFilters.amountRange.max > 0 && <CheckCircle className="w-5 h-5 text-lime-600" />}
                          </button>

                          <button
                            onClick={() => {
                              setAmountRange({ min: -100000000, max: 0 });
                              setSliderBounds({ min: -100000000, max: 0 });
                            }}
                            className={`w-full py-3 px-3 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center justify-between group ${localFilters.amountRange.max <= 0 && localFilters.amountRange.min < 0
                                ? 'bg-red-50 text-red-800 border-red-500 shadow-lg shadow-red-100'
                                : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <span className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${localFilters.amountRange.max <= 0 && localFilters.amountRange.min < 0 ? 'bg-red-500' : 'bg-gray-300'}`} />
                              Money Out
                            </span>
                            {localFilters.amountRange.max <= 0 && localFilters.amountRange.min < 0 && <AlertCircle className="w-5 h-5 text-red-600" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Status */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                        <CheckCircle size={18} className="text-lime-600" />
                        Transaction Status
                      </label>
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col justify-center gap-3">
                        <button
                          onClick={() => setStatus('')}
                          className={`w-full py-3.5 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center justify-between group ${localFilters.status === ''
                            ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <span>All Stats</span>
                          {localFilters.status === '' && <CheckCircle className="w-5 h-5 text-lime-400" />}
                        </button>

                        <button
                          onClick={() => setStatus('success')}
                          className={`w-full py-3.5 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center justify-between group ${localFilters.status === 'success'
                            ? 'bg-lime-50 text-lime-800 border-lime-500 shadow-lg shadow-lime-100'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${localFilters.status === 'success' ? 'bg-lime-500' : 'bg-gray-300'}`} />
                            Success
                          </span>
                          {localFilters.status === 'success' && <CheckCircle className="w-5 h-5 text-lime-600" />}
                        </button>

                        <button
                          onClick={() => setStatus('failed')}
                          className={`w-full py-3.5 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center justify-between group ${localFilters.status === 'failed'
                            ? 'bg-red-50 text-red-800 border-red-500 shadow-lg shadow-red-100'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${localFilters.status === 'failed' ? 'bg-red-500' : 'bg-gray-300'}`} />
                            Failed
                          </span>
                          {localFilters.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-600" />}
                        </button>
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
