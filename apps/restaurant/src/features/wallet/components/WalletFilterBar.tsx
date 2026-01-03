import React, { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { Filter, X, CheckCircle, Calendar, CreditCard } from '@repo/ui/icons';
import WalletDateRangePicker from './WalletDateRangePicker';
import WalletPriceRangeFilter from './WalletPriceRangeFilter';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface WalletFilterBarProps {
  filterFields: { status: string; dateRange: DateRange; amountRange: { min: number; max: number } };
  handleFilterChange: (key: string, value: string | DateRange | { min: number; max: number } | number) => void;
  clearFilterFields: () => void;
  isExpanded: boolean;
  toggleExpanded: () => void;
  className?: string;
}

const WalletFilterBar: React.FC<WalletFilterBarProps> = ({
  filterFields,
  handleFilterChange,
  clearFilterFields,
  isExpanded,
  toggleExpanded,
  className = ''
}) => {
  const [localFilters, setLocalFilters] = useState(filterFields);

  useEffect(() => {
    setLocalFilters(filterFields);
  }, [filterFields]);

  const handleApplyFilter = () => {
    Object.keys(localFilters).forEach(key => {
      handleFilterChange(key, localFilters[key as keyof typeof localFilters]);
    });
  };

  const handleClearAndCollapse = () => {
    clearFilterFields();
    setLocalFilters({ status: '', dateRange: { from: null, to: null }, amountRange: { min: 0, max: 100000000 } });
    toggleExpanded();
  };

  const setStatus = (status: string) => {
    setLocalFilters(prev => ({ ...prev, status }));
  };

  const setDateRange = (range: DateRange) => {
    setLocalFilters(prev => ({ ...prev, dateRange: range }));
  };

  const setAmountRange = (range: { min: number; max: number }) => {
    setLocalFilters(prev => ({ ...prev, amountRange: range }));
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0, marginBottom: 0 }}
      animate={{
        height: isExpanded ? 'auto' : 0,
        opacity: isExpanded ? 1 : 0,
        marginBottom: isExpanded ? 24 : 0
      }}
      transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
      className={`relative bg-gradient-to-br from-lime-50/80 to-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-lime-100 overflow-hidden ${className}`}
    >
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-100/30 rounded-full -ml-16 -mb-16 blur-xl"></div>

      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-lime-500 to-green-600 p-2.5 rounded-xl shadow-md cursor-default">
              <Filter size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">Filter Transactions</h3>
              <p className="text-sm text-lime-700 mt-0.5">Refine by Date or Status</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleApplyFilter}
              className="text-sm font-medium bg-lime-100 text-lime-700 hover:bg-lime-200 px-4 py-2 rounded-xl flex items-center transition-all duration-200 border border-lime-200 shadow-sm"
            >
              <Filter size={16} className="mr-2" />
              Apply Results
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearAndCollapse}
              className="text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl flex items-center transition-all duration-200 border border-red-200 shadow-sm"
            >
              <X size={16} className="mr-2" />
              Clear
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8 items-start">
          {/* Date Range Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-2">
              <Calendar size={16} className="text-lime-600" />
              Date Range
            </label>
            <WalletDateRangePicker
              dateRange={localFilters.dateRange || { from: null, to: null }}
              onChange={setDateRange}
            />
          </div>

          <div className="space-y-6">
            {/* Status Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-2">
                <CheckCircle size={16} className="text-lime-600" />
                Transaction Status
              </label>
              <div className="flex bg-white p-1 rounded-xl border border-lime-100 shadow-sm">
                <button
                  onClick={() => setStatus('')}
                  className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${localFilters.status === '' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatus('success')}
                  className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${localFilters.status === 'success' ? 'bg-lime-100 text-lime-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Success
                </button>
                <button
                  onClick={() => setStatus('failed')}
                  className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${localFilters.status === 'failed' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Failed
                </button>
              </div>
            </div>

            {/* Amount Range Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-2">
                <CreditCard size={16} className="text-lime-600" />
                Amount Range
              </label>
              <WalletPriceRangeFilter
                min={0}
                max={100000000}
                value={localFilters.amountRange || { min: 0, max: 100000000 }}
                onChange={setAmountRange}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletFilterBar;
