import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, X } from "lucide-react";
import StatusBadge from "../feedback/StatusBadge";
import DateRangePicker from "../forms/DateRangePicker";

export type FilterConfig = { type: 'status' | 'options' | 'dateRange'; options?: string[]; label?: string };

export type DataTableFilterProps = {
  filters?: Record<string, FilterConfig>;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  activeFilters?: Record<string, any>;
  columnLabels?: Record<string, string>;
  title?: string;
  subtitle?: string;
  className?: string;
};

const DataTableFilter = ({ filters = {}, onFilterChange, onClearFilters, activeFilters = {}, columnLabels = {}, title = 'Bộ lọc dữ liệu', subtitle = 'Lọc và tìm kiếm dữ liệu theo tiêu chí', className = '' }: DataTableFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeFilterCount = Object.keys(activeFilters).filter(key => { if (Array.isArray(activeFilters[key])) return activeFilters[key].length > 0; if (key.includes('Date') && typeof activeFilters[key] === 'object') return activeFilters[key].startDate || activeFilters[key].endDate; return activeFilters[key] !== undefined && activeFilters[key] !== ''; }).length;
  const handleOptionChange = (filterKey: string, option: string, isMulti = true) => { let newValue; if (isMulti) { const currentValues: string[] = activeFilters[filterKey] || []; if (option === 'all') newValue = []; else if (currentValues.includes(option)) newValue = currentValues.filter((item: string) => item !== option); else newValue = [...currentValues, option]; } else { newValue = activeFilters[filterKey] === option ? '' : option; } onFilterChange(filterKey, newValue); };
  const handleDateRangeChange = (filterKey: string, type: 'startDate' | 'endDate', value: string) => { const currentDateRange = activeFilters[filterKey] || { startDate: '', endDate: '' }; const newDateRange = { ...currentDateRange, [type]: value }; onFilterChange(filterKey, newDateRange); };
  const handleClearAllFilters = () => { onClearFilters(); };
  const handleClearAndCollapse = () => { handleClearAllFilters(); setIsExpanded(false); };
  const renderFilterByType = (key: string, config: FilterConfig, index: number) => {
    const label = columnLabels[key] || key;
    switch (config.type) {
      case 'status':
        return (
          <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4, delay: 0.1 + (index * 0.1) }} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200"><div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary rounded-full"></div><h4 className="text-sm font-semibold text-gray-900">{label}</h4>{activeFilters[key]?.length > 0 && (<span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">{activeFilters[key].length} đã chọn</span>)}</div></div>
            <div className="p-6"><div className="flex flex-wrap gap-3">{(config.options || []).map(option => (<motion.div key={option} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => handleOptionChange(key, option)} className="cursor-pointer transform transition-all duration-200"><StatusBadge status={option} active={(activeFilters[key] || []).includes(option)} /></motion.div>))}</div></div>
          </motion.div>
        );
      case 'options':
        return (
          <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4, delay: 0.1 + (index * 0.1) }} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200"><div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary rounded-full"></div><h4 className="text-sm font-semibold text-gray-900">{label}</h4>{activeFilters[key]?.length > 0 && (<span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">{activeFilters[key].length} đã chọn</span>)}</div></div>
            <div className="p-6"><div className="flex flex-wrap gap-3"><motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => handleOptionChange(key, 'all')} className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm transform ${(!activeFilters[key] || activeFilters[key].length === 0) ? 'bg-primary text-white shadow-md border-0' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}>Tất cả</motion.button>{(config.options || []).map(option => (<motion.button key={option} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => handleOptionChange(key, option)} className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm transform ${(activeFilters[key] || []).includes(option) ? 'bg-primary text-white shadow-md border-0' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}>{option}</motion.button>))}</div></div>
          </motion.div>
        );
      case 'dateRange':
        return (
          <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4, delay: 0.1 + (index * 0.1) }} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="bg-gray-50 px-6 py-2 border-b border-gray-200 rounded-t-2xl"><div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary rounded-full"></div><h4 className="text-sm font-semibold text-gray-900">{config.label || label}</h4>{(activeFilters[key]?.startDate || activeFilters[key]?.endDate) && (<span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">Đã thiết lập</span>)}</div></div>
            <div className="px-2 md:px-6 p-2"><DateRangePicker startDate={activeFilters[key]?.startDate || ''} endDate={activeFilters[key]?.endDate || ''} onStartDateChange={(value) => handleDateRangeChange(key, 'startDate', value)} onEndDateChange={(value) => handleDateRangeChange(key, 'endDate', value)} label="" startPlaceholder="Từ ngày" endPlaceholder="Đến ngày" /></div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={`relative bg-white rounded-2xl shadow-sm mb-8 -mt-4 border border-gray-200 ${className}`}>
      <AnimatePresence mode="wait">
        {!isExpanded && (
          <motion.div key="filter-icon" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="opacity-[0.05] text-primary transform scale-[2] translate-y-6 translate-x-20"><Filter size={50} strokeWidth={3.2} /></div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="p-6 cursor-pointer relative z-10" onClick={() => setIsExpanded(!isExpanded)} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }} transition={{ duration: 0.15 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div animate={{ scale: [1, 1.15, 1], rotate: isExpanded ? 180 : 0 }} transition={{ scale: { repeat: Infinity, duration: 2, repeatType: "loop" }, rotate: { duration: 0.3 } }} className="bg-primary p-2.5 rounded-xl shadow-md"><Filter size={20} className="text-white" /></motion.div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">{isExpanded ? title : "Nhấp để lọc dữ liệu"}{activeFilterCount > 0 && (<motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">{activeFilterCount}</motion.span>)}</h3>
              <motion.p initial={false} animate={{ opacity: isExpanded ? 1 : 0.7, y: isExpanded ? 0 : 2 }} transition={{ duration: 0.3 }} className="text-sm text-gray-500 mt-0.5">{isExpanded ? subtitle : "Mở rộng để sử dụng bộ lọc dữ liệu"}</motion.p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} onClick={(e) => { e.stopPropagation(); handleClearAndCollapse(); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-sm font-medium bg-danger/10 text-danger hover:bg-danger/20 px-4 py-2 rounded-xl flex items-center transition-all duration-200 border border-danger/20 shadow-sm"><X size={16} className="mr-2" />Xóa</motion.button>
              )}
            </AnimatePresence>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="bg-primary/10 p-2 rounded-full"><ChevronDown size={20} className="text-primary" /></motion.div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1], opacity: { duration: 0.3 } }}>
            <div className="px-6 pb-6 relative z-10">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-col lg:flex-row gap-6">
                <div className="flex flex-col gap-6 lg:hidden">{Object.entries(filters).map(([key, config], index) => renderFilterByType(key, config as FilterConfig, index))}</div>
                <>
                  <div className="hidden lg:flex">
                    {(() => {
                      const entries = Object.entries(filters);
                      const firstEntry = entries[0];
                      if (firstEntry) {
                        const [firstKey, firstConfig] = firstEntry;
                        return renderFilterByType(firstKey, firstConfig as FilterConfig, 0);
                      }
                      return null;
                    })()}
                  </div>
                  {Object.entries(filters).length > 1 && (
                    <div className="hidden lg:flex lg:flex-col lg:flex-1 gap-6">
                      {Object.entries(filters).slice(1).map(([key, config], index) => renderFilterByType(key, config as FilterConfig, index + 1))}
                    </div>
                  )}
                </>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default DataTableFilter;