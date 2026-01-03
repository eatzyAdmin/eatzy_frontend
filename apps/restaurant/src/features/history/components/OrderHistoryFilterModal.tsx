import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, CheckCircle, AlertCircle, Calendar, CreditCard, Filter, Check, RotateCcw, Banknote } from '@repo/ui/icons';
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
    dateRange: DateRange;
    amountRange: { min: number; max: number }
  };
  onApply: (filters: {
    status: string;
    paymentMethod: string[];
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
                  FILTER ORDERS
                  {activeCount > 0 && (
                    <span className="text-sm font-sans font-medium text-lime-700 bg-lime-100 px-3 py-1 rounded-full ml-1">
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
                    className="p-4 rounded-full bg-gray-100 text-gray-700 hover:bg-lime-500 hover:text-white transition-all shadow-sm hover:shadow-lime-200 hover:-translate-y-0.5"
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

                  {/* Date Range */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <Calendar size={18} className="text-lime-600" />
                      Date Range
                    </label>
                    <div className="max-w-3xl mx-auto">
                      <WalletDateRangePicker
                        dateRange={localFilters.dateRange}
                        onChange={setDateRange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1: Payment Method */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                        <CreditCard size={18} className="text-lime-600" />
                        Payment Method
                      </label>
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        {['', 'cash', 'vnpay', 'wallet'].map((method) => {
                          const active = isPaymentSelected(method);
                          return (
                            <button
                              key={method}
                              onClick={() => togglePaymentMethod(method)}
                              className={`w-full py-3.5 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center justify-between group ${active
                                ? 'bg-lime-50 text-lime-800 border-lime-500 shadow-lg shadow-lime-100'
                                : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                              <span className="capitalize">{method === '' ? 'All Methods' : method === 'vnpay' ? 'VNPAY' : method}</span>
                              {active && <CheckCircle className="w-5 h-5 text-lime-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 2: Status */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                        <CheckCircle size={18} className="text-lime-600" />
                        Order Status
                      </label>
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        {/* All */}
                        <button
                          onClick={() => setStatus('')}
                          className={`w-full py-3.5 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center justify-between group ${localFilters.status === ''
                            ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <span>All Status</span>
                          {localFilters.status === '' && <CheckCircle className="w-5 h-5 text-lime-400" />}
                        </button>

                        {/* Completed */}
                        <button
                          onClick={() => setStatus('completed')}
                          className={`w-full py-3.5 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center justify-between group ${localFilters.status === 'completed'
                            ? 'bg-lime-50 text-lime-800 border-lime-500 shadow-lg shadow-lime-100'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${localFilters.status === 'completed' ? 'bg-lime-500' : 'bg-gray-300'}`} />
                            Completed
                          </span>
                          {localFilters.status === 'completed' && <CheckCircle className="w-5 h-5 text-lime-600" />}
                        </button>

                        {/* Cancelled */}
                        <button
                          onClick={() => setStatus('cancelled')}
                          className={`w-full py-3.5 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center justify-between group ${localFilters.status === 'cancelled'
                            ? 'bg-red-50 text-red-800 border-red-500 shadow-lg shadow-red-100'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${localFilters.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-300'}`} />
                            Cancelled
                          </span>
                          {localFilters.status === 'cancelled' && <AlertCircle className="w-5 h-5 text-red-600" />}
                        </button>

                        {/* Refunded */}
                        <button
                          onClick={() => setStatus('refunded')}
                          className={`w-full py-3.5 px-4 text-sm font-bold rounded-xl transition-all border-2 text-left flex items-center justify-between group ${localFilters.status === 'refunded'
                            ? 'bg-orange-50 text-orange-800 border-orange-500 shadow-lg shadow-orange-100'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${localFilters.status === 'refunded' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                            Refunded
                          </span>
                          {localFilters.status === 'refunded' && <RotateCcw className="w-5 h-5 text-orange-600" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Amount Range (Moved to bottom) */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                      <Banknote size={18} className="text-lime-600" />
                      Amount Range
                    </label>
                    <WalletPriceRangeFilter
                      min={0}
                      max={5000000}
                      step={10000}
                      value={localFilters.amountRange}
                      onChange={setAmountRange}
                    />
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
