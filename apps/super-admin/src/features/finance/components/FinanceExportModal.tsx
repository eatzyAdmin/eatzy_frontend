'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Clock, useNotification } from '@repo/ui';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, Download, FileText, Check, LayoutGrid, ListFilter,
  ChevronDown, Eye, CheckCircle, Database,
  Calendar, CreditCard, Hash, User, ShoppingBag, Phone, MapPin, AlertCircle,
  Wallet, ArrowUpRight, ArrowDownLeft, Info
} from 'lucide-react';
import { WalletTransactionResponse } from '@repo/types';
import { createPortal } from 'react-dom';

// Define Column Groups Configuration for Finance
const COLUMN_GROUPS = {
  general: {
    label: 'Transaction Details',
    icon: <Hash className="w-4 h-4" />,
    columns: [
      { key: 'id', label: 'Reference ID', icon: <Hash className="w-3 h-3" /> },
      { key: 'createdAt', label: 'Process Date', icon: <Calendar className="w-3 h-3" /> },
      { key: 'transactionType', label: 'Entry Type', icon: <Info className="w-3 h-3" /> },
      { key: 'status', label: 'Audit Status', icon: <CheckCircle className="w-3 h-3" /> }
    ]
  },
  account: {
    label: 'Account Identity',
    icon: <User className="w-4 h-4" />,
    columns: [
      { key: 'userName', label: 'Owner Name', icon: <User className="w-3 h-3" /> },
      { key: 'description', label: 'Audit Log', icon: <FileText className="w-3 h-3" /> }
    ]
  },
  financial: {
    label: 'Ledger Impact',
    icon: <CreditCard className="w-4 h-4" />,
    columns: [
      { key: 'amount', label: 'Transferred Amount', icon: <CreditCard className="w-3 h-3" /> },
      { key: 'balanceAfter', label: 'Running Balance', icon: <Wallet className="w-3 h-3" /> }
    ]
  }
};

interface FinanceExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => Promise<void>;
  previewData?: WalletTransactionResponse[];
}

const FinanceExportModal: React.FC<FinanceExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  previewData = []
}) => {
  const [format, setFormat] = useState<'pdf' | 'excel'>('excel');
  const [scope, setScope] = useState<'current' | 'all'>('current');
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Initialize columns state
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    Object.values(COLUMN_GROUPS).forEach(group => {
      group.columns.forEach(col => {
        initial[col.key] = true;
      });
    });
    return initial;
  });

  const { showNotification } = useNotification();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    general: true,
    account: true,
    financial: true
  });

  const [lastChangedColumn, setLastChangedColumn] = useState<string | null>(null);

  // Refs for animation
  const tableRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // State for tracking column animations  
  const [columnAnimations, setColumnAnimations] = useState<Record<string, 'adding' | 'removing' | null>>({});
  const [lastAddedColumn, setLastAddedColumn] = useState<string | null>(null);

  // State for ghost columns (visual duplicates during animation)
  const [ghostColumns, setGhostColumns] = useState<Record<string, { value: boolean; position: { left: number; width: number } }>>({});

  // Helper functions
  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Find the position of a column in the table
  const findColumnPosition = (column: string) => {
    if (!tableRef.current) return { left: 0, width: 0 };

    const columnElement = tableRef.current.querySelector(`[data-column="${column}"]`);
    if (!columnElement) return { left: 0, width: 0 };

    const rect = columnElement.getBoundingClientRect();
    const tableRect = tableRef.current.getBoundingClientRect();

    return {
      left: rect.left - tableRect.left + (tableContainerRef.current?.scrollLeft || 0),
      width: rect.width
    };
  };

  const toggleColumn = (key: string) => {
    setLastChangedColumn(key);

    // Create ghost effect for animation
    if (selectedColumns[key]) {
      const position = findColumnPosition(key);
      setTimeout(() => {
        setGhostColumns(prev => ({
          ...prev,
          [key]: { value: true, position }
        }));
      }, 10);

      setTimeout(() => {
        setGhostColumns(prev => {
          const newGhosts = { ...prev };
          delete newGhosts[key];
          return newGhosts;
        });
      }, 500);
    } else {
      setLastAddedColumn(key);
    }

    // Update selected columns
    setSelectedColumns(prev => ({ ...prev, [key]: !prev[key] }));

    // Set animation state
    setColumnAnimations(prev => ({
      ...prev,
      [key]: !selectedColumns[key] ? 'adding' : 'removing'
    }));

    setTimeout(() => {
      setColumnAnimations(prev => ({ ...prev, [key]: null }));
      if (!selectedColumns[key]) setLastAddedColumn(null);
    }, 500);
  };

  const activeColumnsList = useMemo(() => {
    const list: { key: string; label: string; icon: React.ReactNode }[] = [];
    Object.values(COLUMN_GROUPS).forEach(group => {
      group.columns.forEach(col => {
        if (selectedColumns[col.key]) list.push(col);
      });
    });
    return list;
  }, [selectedColumns]);

  // Create a flat map of column keys to labels for fast lookup
  const columnLabels = useMemo(() => {
    const map: Record<string, string> = {};
    Object.values(COLUMN_GROUPS).forEach(group => {
      group.columns.forEach(col => {
        map[col.key] = col.label;
      });
    });
    return map;
  }, []);

  // Auto-scroll to newly added column
  useEffect(() => {
    if (tableContainerRef.current && lastChangedColumn) {
      const column = lastChangedColumn;
      const columnElement = tableContainerRef.current.querySelector(`[data-column="${column}"]`);

      if (columnElement) {
        const containerRect = tableContainerRef.current.getBoundingClientRect();
        const columnRect = columnElement.getBoundingClientRect();
        const containerScrollLeft = tableContainerRef.current.scrollLeft;

        const columnLeftInView = columnRect.left >= containerRect.left;
        const columnRightInView = columnRect.right <= containerRect.right;

        if (!columnLeftInView || !columnRightInView) {
          const scrollTarget = containerScrollLeft +
            (columnRect.left + columnRect.width / 2 - containerRect.left - containerRect.width / 2);

          tableContainerRef.current.scrollTo({
            left: scrollTarget,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [selectedColumns, lastChangedColumn]);

  const handleExportClick = async () => {
    if (activeColumnsList.length === 0) {
      showNotification({
        type: 'error',
        message: 'No Columns Selected',
        format: 'Please select at least one column to export.'
      });
      return;
    }

    setIsExporting(true);
    try {
      const activeKeys = Object.keys(selectedColumns).filter(k => selectedColumns[k]);
      await onExport(format, scope, activeKeys);
      showNotification({
        type: 'success',
        message: 'Audit Exported',
        format: 'Platform ledger has been exported successfully.'
      });
      onClose();
    } catch (error) {
      console.error('Export failed', error);
      showNotification({
        type: 'error',
        message: 'Export Failed',
        format: 'An error occurred while generating audit report.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const formatCell = (item: WalletTransactionResponse, key: string) => {
    if (key === 'id') return `TX-${item.id.toString().padStart(6, '0')}`;
    if (key === 'amount') return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount);
    if (key === 'balanceAfter') return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.balanceAfter);
    if (key === 'createdAt') return new Date(item.createdAt).toLocaleDateString('vi-VN');
    if (key === 'userName') return item.wallet.user.name;
    if (key === 'transactionType') return item.transactionType.replace('_', ' ');
    if (key === 'status') {
      const status = item.status as string;
      return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${status === 'SUCCESS' || status === 'COMPLETED' ? 'bg-lime-100 text-lime-700' :
          status === 'FAILED' || status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
            status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
              'bg-gray-100 text-gray-700'
          }`}>
          {status}
        </span>
      );
    }
    return (item as any)[key];
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[600]"
          />

          <div className="fixed inset-0 z-[610] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-6xl pointer-events-auto"
            >
              <div className="bg-white rounded-[36px] p-0 shadow-2xl border border-white/20 ring-1 ring-black/5 flex flex-col md:flex-row relative overflow-hidden h-[90vh]">

                {/* Left Panel: Settings */}
                <div className="w-full md:w-[30%] bg-gray-100 p-6 flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                      <Download className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] uppercase">FINANCE REPORT</h2>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Format Selection */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Select Format</label>
                      <div className="grid grid-cols-2 gap-4 px-2">
                        <motion.div
                          whileHover={{ y: -3, scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center relative overflow-hidden ${format === 'pdf'
                            ? 'border-red-300 shadow-[0_5px_20px_rgba(239,68,68,0.15)] bg-gradient-to-br from-red-50 to-red-100/50'
                            : 'bg-white border-gray-200 hover:border-red-200 hover:shadow-[0_5px_15px_rgba(0,0,0,0.05)]'
                            } transition-all duration-300`}
                          onClick={() => setFormat('pdf')}
                        >
                          <div className={`p-3 rounded-full mb-2 ${format === 'pdf' ? 'bg-red-100' : 'bg-gray-100'
                            } transition-colors duration-300`}>
                            <FileText className={`w-7 h-7 ${format === 'pdf' ? 'text-red-500' : 'text-gray-400'}`} />
                          </div>
                          <span className={`text-sm font-semibold ${format === 'pdf' ? 'text-red-600' : 'text-gray-600'}`}>
                            PDF
                          </span>
                          {format === 'pdf' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md"
                            >
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </motion.div>

                        <motion.div
                          whileHover={{ y: -3, scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setFormat('excel')}
                          className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center relative overflow-hidden transition-all duration-300 ${format === 'excel'
                            ? 'border-lime-500 shadow-[0_5px_20px_rgba(132,204,22,0.15)] bg-gradient-to-br from-lime-50 to-lime-100/50'
                            : 'bg-white border-gray-200 hover:border-lime-200 hover:shadow-[0_5px_15px_rgba(0,0,0,0.05)]'
                            }`}
                        >
                          <div className={`p-3 rounded-full mb-2 transition-colors duration-300 ${format === 'excel' ? 'bg-lime-100' : 'bg-gray-100'}`}>
                            <LayoutGrid className={`w-7 h-7 ${format === 'excel' ? 'text-lime-600' : 'text-gray-400'}`} />
                          </div>
                          <span className={`text-sm font-semibold ${format === 'excel' ? 'text-lime-600' : 'text-gray-600'}`}>
                            Excel
                          </span>
                          {format === 'excel' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 w-5 h-5 bg-lime-500 rounded-full flex items-center justify-center shadow-md"
                            >
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    </div>

                    {/* Scope Selection */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Export Scope</label>
                      <div className="space-y-3 px-2">
                        <motion.div
                          onClick={() => setScope('current')}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer flex items-start gap-4 transition-all duration-300 group ${scope === 'current'
                            ? 'border-lime-500 bg-lime-50/50 shadow-lg shadow-lime-100/50'
                            : 'bg-white border-gray-100 hover:border-lime-200 hover:shadow-md hover:bg-gray-50/50'
                            }`}
                        >
                          <div className={`p-3 rounded-xl shrink-0 transition-colors duration-300 ${scope === 'current' ? 'bg-lime-100 text-lime-600' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-lime-500'}`}>
                            <ListFilter className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-bold transition-colors ${scope === 'current' ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>Current View</span>
                              {scope === 'current' ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                  <div className="w-5 h-5 rounded-full bg-lime-500 flex items-center justify-center shadow-sm">
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                  </div>
                                </motion.div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-lime-300 transition-colors" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                              Export data based on your current active filters and search results.
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          onClick={() => setScope('all')}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer flex items-start gap-4 transition-all duration-300 group ${scope === 'all'
                            ? 'border-lime-500 bg-lime-50/50 shadow-lg shadow-lime-100/50'
                            : 'bg-white border-gray-100 hover:border-lime-200 hover:shadow-md hover:bg-gray-50/50'
                            }`}
                        >
                          <div className={`p-3 rounded-xl shrink-0 transition-colors duration-300 ${scope === 'all' ? 'bg-lime-100 text-lime-600' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-lime-500'}`}>
                            <Database className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-bold transition-colors ${scope === 'all' ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>All History</span>
                              {scope === 'all' ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                  <div className="w-5 h-5 rounded-full bg-lime-500 flex items-center justify-center shadow-sm">
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                  </div>
                                </motion.div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-lime-300 transition-colors" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                              Export your complete platform ledger history without any filters applied.
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Column Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Columns</label>
                        <span className="text-xs font-medium text-lime-600 bg-lime-50 px-2 py-1 rounded-full border border-lime-100">
                          {Object.values(selectedColumns).filter(Boolean).length} Selected
                        </span>
                      </div>

                      <div className="space-y-3 pb-2">
                        {Object.entries(COLUMN_GROUPS).map(([key, group]) => {
                          const groupCols = group.columns;
                          const selectedCount = groupCols.filter(c => selectedColumns[c.key]).length;
                          const isAllSelected = selectedCount === groupCols.length;
                          const isExpanded = !!expandedGroups[key];

                          return (
                            <div key={key} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                              <div
                                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => toggleGroup(key)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isExpanded ? 'bg-lime-500 border-lime-500 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                    {group.icon}
                                  </div>
                                  <div className="text-left">
                                    <span className="text-sm font-bold text-gray-900 block">{group.label}</span>
                                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{selectedCount}/{groupCols.length} Selected</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div
                                    role="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newState = { ...selectedColumns };
                                      groupCols.forEach(col => {
                                        newState[col.key] = !isAllSelected;
                                      });
                                      setSelectedColumns(newState);
                                    }}
                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isAllSelected
                                      ? 'bg-lime-500 border-lime-500 shadow-sm'
                                      : 'bg-white border-gray-200 hover:border-lime-400'
                                      }`}
                                    title={isAllSelected ? "Unselect All" : "Select All"}
                                  >
                                    {isAllSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                                  </div>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors`}>
                                    <ChevronDown
                                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                    />
                                  </div>
                                </div>
                              </div>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-gray-100"
                                  >
                                    <div className="p-2 space-y-1">
                                      {groupCols.map(col => {
                                        const isSelected = selectedColumns[col.key];
                                        return (
                                          <div
                                            key={col.key}
                                            onClick={() => toggleColumn(col.key)}
                                            className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border ${isSelected
                                              ? 'bg-lime-50/50 border-lime-200 shadow-sm'
                                              : 'bg-white border-transparent hover:bg-gray-50'
                                              }`}
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-lime-100 text-lime-700' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                                                }`}>
                                                {col.icon}
                                              </div>
                                              <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-gray-800' : 'text-gray-500 group-hover:text-gray-700'
                                                }`}>
                                                {col.label}
                                              </span>
                                            </div>

                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                                              ? 'bg-lime-500 border-lime-500 scale-110'
                                              : 'border-gray-300 bg-white group-hover:border-lime-400'
                                              }`}>
                                              {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Preview & Actions */}
                <div className="w-full md:w-[70%] flex flex-col bg-white p-6 relative">
                  {/* Decorative Background Blob */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 rounded-full blur-[80px] pointer-events-none" />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-gray-400" />
                      <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Live Preview</h3>
                    </div>
                    <div className="text-xs text-gray-400 italic pr-2">
                      Showing {previewData.length} records based on current filter
                    </div>
                  </div>

                  <style>{`
                    .preview-scrollbar::-webkit-scrollbar {
                      width: 6px;
                      height: 6px;
                    }
                    .preview-scrollbar::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .preview-scrollbar::-webkit-scrollbar-thumb {
                      background: rgba(0,0,0,0.1);
                      border-radius: 10px;
                    }
                    .preview-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: rgba(0,0,0,0.2);
                    }
                  `}</style>
                  <div className="flex-1 border-4 border-gray-100 rounded-[32px] overflow-hidden relative bg-gray-50/20 shadow-inner">
                    <div className="absolute inset-0 overflow-auto preview-scrollbar" ref={tableContainerRef}>
                      <motion.div
                        ref={tableRef}
                        className="w-full min-w-full relative"
                        layout="position"
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 30,
                          duration: 0.4
                        }}
                      >
                        <table className="min-w-full border-separate border-spacing-0">
                          <thead className="sticky top-0 z-20 bg-gray-100 shadow-sm">
                            <tr className="relative">
                              {/* Ghost headers for columns being removed */}
                              {Object.entries(ghostColumns).map(([column, ghost]) => (
                                <motion.th
                                  key={`ghost-${column}`}
                                  className="absolute px-5 py-4 text-left text-[10px] font-black text-gray-400/40 uppercase tracking-widest border-b border-gray-200/30 pointer-events-none"
                                  style={{
                                    left: ghost.position.left,
                                    width: ghost.position.width,
                                    zIndex: 5
                                  }}
                                  initial={{ opacity: 0.9 }}
                                  animate={{
                                    opacity: 0,
                                    y: -10,
                                    scale: 0.9
                                  }}
                                  transition={{
                                    duration: 0.4
                                  }}
                                >
                                  {columnLabels[column] || column}
                                </motion.th>
                              ))}

                              <AnimatePresence initial={false} mode="sync">
                                {activeColumnsList.map(col => (
                                  <motion.th
                                    key={col.key}
                                    data-column={col.key}
                                    className={`px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest border-b border-gray-200 relative whitespace-nowrap ${(col.key === lastAddedColumn || columnAnimations[col.key] === 'adding') ? 'text-lime-600 bg-lime-50/50' : 'text-gray-400'}`}
                                    initial={{
                                      opacity: 0,
                                      width: 0,
                                      scale: 0.8,
                                      x: columnAnimations[col.key] === 'adding' ? -20 : 0
                                    }}
                                    animate={{
                                      opacity: 1,
                                      width: 'auto',
                                      scale: 1,
                                      x: 0
                                    }}
                                    exit={{
                                      opacity: 0,
                                      width: 0,
                                      scale: 0.8,
                                      x: columnAnimations[col.key] === 'removing' ? 20 : 0
                                    }}
                                    transition={{
                                      layout: { type: "spring", bounce: 0, duration: 0.4 },
                                      width: { type: "spring", bounce: 0, duration: 0.4 },
                                      opacity: { duration: 0.2 }
                                    }}
                                    layout
                                  >
                                    {col.label}

                                    {/* Highlight effect for newly added column */}
                                    {(col.key === lastAddedColumn || columnAnimations[col.key] === 'adding') && (
                                      <motion.div
                                        className="absolute inset-0 bg-lime-200/20 z-0"
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 0 }}
                                        transition={{ duration: 1.5 }}
                                      />
                                    )}
                                  </motion.th>
                                ))}
                              </AnimatePresence>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {previewData.map((item, idx) => (
                              <motion.tr
                                key={idx}
                                className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0 relative"
                                layout="position"
                              >
                                {/* Ghost cells for columns being removed */}
                                {Object.entries(ghostColumns).map(([column, ghost]) => (
                                  <motion.td
                                    key={`ghost-${column}-${idx}`}
                                    className="absolute px-5 py-4 whitespace-nowrap text-xs font-bold text-gray-600/40 border-b border-gray-50/20 pointer-events-none"
                                    style={{
                                      left: ghost.position.left,
                                      width: ghost.position.width,
                                      zIndex: 5
                                    }}
                                    initial={{ opacity: 0.9 }}
                                    animate={{
                                      opacity: 0,
                                      y: 10,
                                      scale: 0.9
                                    }}
                                    transition={{
                                      duration: 0.4,
                                      delay: idx * 0.02
                                    }}
                                  >
                                    {formatCell(item, column)}
                                  </motion.td>
                                ))}

                                <AnimatePresence initial={false} mode="sync">
                                  {activeColumnsList.map(col => (
                                    <motion.td
                                      key={col.key}
                                      data-column={col.key}
                                      className={`px-5 py-4 whitespace-nowrap text-xs font-bold border-b border-gray-50/50 relative ${(col.key === lastAddedColumn || columnAnimations[col.key] === 'adding') ? 'text-lime-700 bg-lime-50/30' : 'text-gray-600'}`}
                                      initial={{
                                        opacity: 0,
                                        width: 0,
                                        x: columnAnimations[col.key] === 'adding' ? -20 : 0,
                                        scale: columnAnimations[col.key] === 'adding' ? 0.8 : 1
                                      }}
                                      animate={{
                                        opacity: 1,
                                        width: 'auto',
                                        x: 0,
                                        scale: 1
                                      }}
                                      exit={{
                                        opacity: 0,
                                        width: 0,
                                        x: columnAnimations[col.key] === 'removing' ? 20 : 0,
                                        scale: columnAnimations[col.key] === 'removing' ? 0.8 : 1
                                      }}
                                      transition={{
                                        layout: { type: "spring", bounce: 0, duration: 0.4 },
                                        width: { type: "spring", bounce: 0, duration: 0.4 },
                                        opacity: { duration: 0.2 },
                                        delay: idx * 0.01
                                      }}
                                      layout
                                    >
                                      {formatCell(item, col.key)}

                                      {/* Highlight effect for newly added column */}
                                      {(col.key === lastAddedColumn || columnAnimations[col.key] === 'adding') && (
                                        <motion.div
                                          className="absolute inset-0 bg-lime-100/20 z-0"
                                          initial={{ opacity: 1 }}
                                          animate={{ opacity: 0 }}
                                          transition={{ duration: 1.5 }}
                                        />
                                      )}
                                    </motion.td>
                                  ))}
                                </AnimatePresence>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExportClick}
                      disabled={isExporting}
                      className={`flex-1 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group ${activeColumnsList.length === 0 || previewData.length === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        : 'bg-[#1A1A1A] text-white hover:bg-black shadow-lg shadow-gray-200 active:scale-95'
                        }`}
                    >
                      {isExporting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className={`w-5 h-5 transition-transform ${activeColumnsList.length > 0 && previewData.length > 0 ? 'group-hover:-translate-y-0.5' : ''
                            }`} />
                          Export {previewData.length} Rows, {activeColumnsList.length} Cols
                        </>
                      )}
                    </button>
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
};

export default FinanceExportModal;
