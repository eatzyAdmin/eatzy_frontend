import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Edit, Trash, RefreshCcw } from "lucide-react";
import StatusBadge from "../feedback/StatusBadge";
import DataTableRowShimmer from "../feedback/shimmer/DataTableRowShimmer";

export type ColumnDef<T> = { key: string; label: string; className?: string; sortable?: boolean; type?: 'status'; formatter?: (value: any, item: T) => React.ReactNode };

export type DataTableProps<T> = {
  data?: T[];
  columns?: ColumnDef<T>[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  handleSort: (key: string) => void;
  onRowClick?: (item: T) => void;
  onEditClick?: (item: T) => void;
  onDeleteClick?: (item: T) => void;
  keyField?: keyof T;
  className?: string;
  headerClassName?: string;
  renderActions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
  filters?: Record<string, any>;
  dateRangeFilters?: Record<string, any>;
  statusFilters?: Record<string, any>;
  changeTableData?: (list: T[]) => void;
};

const DataTable = <T extends Record<string, any>>({
  data = [],
  columns = [],
  sortField,
  sortDirection,
  handleSort,
  onRowClick,
  onEditClick,
  onDeleteClick,
  keyField = 'id' as keyof T,
  className = "",
  headerClassName = "bg-gradient-to-r from-blue-500 to-indigo-600",
  renderActions,
  emptyMessage = "Không có dữ liệu để hiển thị",
  isLoading = false,
  filters = {},
  dateRangeFilters = {},
  statusFilters = {},
  changeTableData
}: DataTableProps<T>) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [displayedData, setDisplayedData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showShimmer, setShowShimmer] = useState(false);
  const [isFilteringData, setIsFilteringData] = useState(false);
  const itemsPerPage = 10;
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => { applyFilters(); }, [data, activeFilters]);
  useEffect(() => {
    if (filteredData.length > 0) {
      setCurrentPage(1);
      setDisplayedData([]);
      setShowShimmer(true);
      setIsFilteringData(true);
      setTimeout(() => { setDisplayedData(filteredData.slice(0, itemsPerPage)); setShowShimmer(false); setIsFilteringData(false); }, 1500);
    } else {
      setDisplayedData([]);
      setShowShimmer(true);
      setIsFilteringData(true);
      setTimeout(() => { setShowShimmer(false); setIsFilteringData(false); }, 1500);
    }
  }, [filteredData]);

  const handleFilterChange = (key: string, value: any) => {
    setIsFilteringData(true);
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && value.startDate === null && value.endDate === null)) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  };

  const clearAllFilters = () => { setIsFilteringData(true); setActiveFilters({}); };
  const hasMoreData = useCallback(() => displayedData.length < filteredData.length, [displayedData.length, filteredData.length]);
  const loadMoreData = useCallback(() => {
    if (isLoadingMore || !hasMoreData()) return;
    setIsLoadingMore(true); setShowShimmer(true);
    setTimeout(() => { const nextPage = currentPage + 1; const startIndex = currentPage * itemsPerPage; const endIndex = startIndex + itemsPerPage; const newData = filteredData.slice(startIndex, endIndex); setDisplayedData(prev => [...prev, ...newData]); setCurrentPage(nextPage); setShowShimmer(false); setIsLoadingMore(false); }, 1500);
  }, [currentPage, filteredData, isLoadingMore, hasMoreData]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    const observer = new IntersectionObserver((entries) => { const entry = entries[0]; if (entry && entry.isIntersecting && !isLoadingMore && hasMoreData()) { loadMoreData(); } }, { threshold: 0.1, rootMargin: '50px' });
    observerRef.current = observer;
    const timeoutId = setTimeout(() => { const targetElement = document.querySelector('[data-scroll-target="true"]'); if (targetElement && hasMoreData()) { observer.observe(targetElement); } }, 100);
    return () => { clearTimeout(timeoutId); if (observerRef.current) observerRef.current.disconnect(); };
  }, [isLoadingMore, displayedData, filteredData, hasMoreData, loadMoreData]);

  const applyFilters = () => {
    if (!data) { setFilteredData([]); changeTableData && changeTableData([]); return; }
    if (Object.keys(activeFilters).length === 0) { setFilteredData(data); changeTableData && changeTableData(data); return; }
    let result = [...data];
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && (value as any).startDate === null && (value as any).endDate === null)) return;
      if (Array.isArray(value)) {
        result = result.filter(item => { const itemValue = getNestedValue(item, key); if (itemValue === undefined || itemValue === null) return false; return value.includes(itemValue); });
      } else if (typeof value === 'object' && ((value as any).startDate || (value as any).endDate)) {
        result = result.filter(item => {
          const dateValue = getNestedValue(item, key); if (!dateValue) return false;
          const itemDate = parseDate(dateValue); if (!itemDate) return false;
          let startDate: Date | null = null; let endDate: Date | null = null;
          if (typeof (value as any).startDate === 'string') { startDate = parseDate((value as any).startDate); startDate && startDate.setHours(0, 0, 0, 0); }
          if (typeof (value as any).endDate === 'string') { endDate = parseDate((value as any).endDate); endDate && endDate.setHours(23, 59, 59, 999); }
          if (startDate && endDate) return itemDate >= startDate && itemDate <= endDate;
          if (startDate) return itemDate >= startDate;
          if (endDate) return itemDate <= endDate;
          return true;
        });
      } else if (typeof value === 'string' && value !== '') {
        result = result.filter(item => { const itemValue = getNestedValue(item, key); if (itemValue === undefined || itemValue === null) return false; const stringValue = String(itemValue).toLowerCase(); const filterValue = (value as string).toLowerCase(); return stringValue.includes(filterValue); });
      }
    });
    setFilteredData(result); changeTableData && changeTableData(result);
  };

  const getNestedValue = (item: any, key: string) => { if (!key.includes('.')) return item[key]; return key.split('.').reduce((obj, k) => (obj ? obj[k] : obj), item); };
  const parseDate = (dateString: string | Date | null | undefined): Date | null => {
    if (!dateString) return null;
    if (dateString instanceof Date) return dateString;
    if (typeof dateString === 'string') {
      const ds: string = dateString ?? '';
      const slashMatch = ds.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/);
      if (slashMatch) { const [, dStr, mStr, yStr] = slashMatch; if (dStr && mStr && yStr) { const day = parseInt(dStr, 10); const month = parseInt(mStr, 10) - 1; const year = parseInt(yStr, 10); return new Date(year, month, day); } }
      const dashMatch = ds.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
      if (dashMatch) { const [, yStr, mStr, dStr] = dashMatch; if (yStr && mStr && dStr) { const year = parseInt(yStr, 10); const month = parseInt(mStr, 10) - 1; const day = parseInt(dStr, 10); return new Date(year, month, day); } }
      const date = new Date(ds);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  };

  const tableRowVariants = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: (i % itemsPerPage) * 0.05, duration: 0.4, ease: 'easeOut' } }), exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeInOut' } } };

  return (
    <div className={className}>
      <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, layout: { type: "tween", ease: "easeOut" } }} ref={tableContainerRef} className={`bg-white rounded-2xl border border-blue-100 shadow-[0_4px_24px_rgba(0,170,255,0.08)] overflow-hidden`} style={{ overflowY: 'hidden' }}>
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="min-w-full divide-y divide-blue-100">
            <thead className={headerClassName}>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} scope="col" className={`px-3 sm:px-4 lg:px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-blue-600/80 transition-colors ${column.className || ''}`} onClick={() => column.sortable !== false && handleSort(column.key)}>
                    <div className="flex items-center">
                      <span>{column.label}</span>
                      {sortField === column.key && (
                        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.4 }}>{sortDirection === 'asc' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}</motion.span>
                      )}
                    </div>
                  </th>
                ))}
                <th scope="col" className="px-3 sm:px-4 lg:px-6 py-4 text-right text-xs font-medium text-white uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-50">
              <AnimatePresence mode="wait">
                {showShimmer && (isFilteringData || displayedData.length === 0) ? (
                  Array.from({ length: itemsPerPage }, (_, index) => (<DataTableRowShimmer key={`filter-shimmer-${index}`} columnCount={columns.length} index={index} />))
                ) : displayedData.length === 0 && !isLoading && !showShimmer ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-10 text-center">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-gray-500">
                        {isLoading ? (<><RefreshCcw size={32} className="text-blue-400 animate-spin mb-3" /><p>Đang tải dữ liệu...</p></>) : (<><svg className="w-12 h-12 text-blue-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><p>{Object.keys(activeFilters).length > 0 ? 'Không có dữ liệu phù hợp với bộ lọc' : emptyMessage}</p></>)}
                      </motion.div>
                    </td>
                  </tr>
                ) : !(showShimmer && (isFilteringData || displayedData.length === 0)) && (
                  <>
                    {displayedData.map((item, i) => (
                      <motion.tr key={String(item[keyField])} custom={i} variants={tableRowVariants} initial="hidden" animate="visible" exit="exit" className="hover:bg-blue-50/60 transition-colors cursor-pointer" onClick={() => onRowClick && onRowClick(item)} layout transition={{ layout: { type: "spring", damping: 15, stiffness: 100 }, opacity: { duration: 0.6 } }}>
                        {columns.map((column) => {
                          if (column.type === 'status') { return (<td key={column.key} className={`px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap ${column.className || ''}`}><StatusBadge status={item[column.key]} /></td>); }
                          let value = item[column.key]; if (column.key.includes('.')) { const keys = column.key.split('.'); value = keys.reduce((obj: any, k: string) => obj && obj[k], item); }
                          if (column.formatter) { value = column.formatter(value, item); }
                          return (<td key={column.key} className={`px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap ${column.className || ''}`}>{column.formatter ? value : (<div className="text-sm text-gray-800">{value as any}</div>)}</td>);
                        })}
                        <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                            {renderActions ? renderActions(item) : (<>
                              {onEditClick && (<motion.button onClick={() => onEditClick(item)} whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.95 }} className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50"><Edit size={18} /></motion.button>)}
                              {onDeleteClick && (<motion.button onClick={() => onDeleteClick(item)} whileHover={{ scale: 1.15, rotate: -5 }} whileTap={{ scale: 0.95 }} className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50"><Trash size={18} /></motion.button>)}
                            </>)}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {showShimmer && hasMoreData() && !isFilteringData && displayedData.length > 0 && (
                      Array.from({ length: itemsPerPage }, (_, index) => (<DataTableRowShimmer key={`shimmer-${displayedData.length + index}`} columnCount={columns.length} index={index} />))
                    )}
                    {hasMoreData() && !showShimmer && (
                      <tr data-scroll-target="true" ref={(el) => { if (el && observerRef.current) { observerRef.current.observe(el); } }} style={{ height: '1px' }}>
                        <td colSpan={columns.length + 1} style={{ height: '1px', padding: 0 }}></td>
                      </tr>
                    )}
                  </>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
      {!hasMoreData() && displayedData.length > 0 && !showShimmer && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col items-center justify-center text-gray-500 py-6 mt-4">
          <svg className="w-8 h-8 text-blue-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-sm font-medium text-gray-600">Đã hiển thị tất cả dữ liệu</p>
          <p className="text-xs text-gray-400 mt-1">Tổng cộng {filteredData.length} mục</p>
        </motion.div>
      )}
    </div>
  );
};

export default DataTable;