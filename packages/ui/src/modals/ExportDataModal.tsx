'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNotification } from '../providers/NotificationProvider';
import { ExportDataModalProps, ColumnConfig, ColumnGroup } from './export/types';
import { FormatSelection } from './export/FormatSelection';
import { ScopeSelection } from './export/ScopeSelection';
import { ColumnSelection } from './export/ColumnSelection';
import { PreviewTable } from './export/PreviewTable';

export type { ExportDataModalProps, ColumnConfig, ColumnGroup };

export function ExportDataModal<T>({
  isOpen,
  onClose,
  title,
  columnGroups,
  previewData = [],
  onExport,
  formatCell,
  scopeLabels = {
    current: {
      title: 'Current View',
      desc: 'Export data based on your current active filters and search results.'
    },
    all: {
      title: 'All History',
      desc: 'Export your complete platform history without any filters applied.'
    }
  },
  successMessage = 'Data has been exported successfully.',
  errorMessage = 'An error occurred while generating report.',
  defaultScope = 'current',
  defaultFormat = 'excel'
}: ExportDataModalProps<T>) {
  const [format, setFormat] = useState<'pdf' | 'excel'>(defaultFormat);
  const [scope, setScope] = useState<'current' | 'all'>(defaultScope);
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    Object.values(columnGroups).forEach(group => {
      group.columns.forEach(col => {
        initial[col.key] = true;
      });
    });
    return initial;
  });

  const { showNotification } = useNotification();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    Object.keys(columnGroups).forEach(key => {
      initial[key] = true;
    });
    return initial;
  });

  const [lastChangedColumn, setLastChangedColumn] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [columnAnimations, setColumnAnimations] = useState<Record<string, 'adding' | 'removing' | null>>({});
  const [lastAddedColumn, setLastAddedColumn] = useState<string | null>(null);
  const [ghostColumns, setGhostColumns] = useState<Record<string, { value: boolean; position: { left: number; width: number } }>>({});

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
    if (selectedColumns[key]) {
      const position = findColumnPosition(key);
      setTimeout(() => {
        setGhostColumns(prev => ({ ...prev, [key]: { value: true, position } }));
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

    setSelectedColumns(prev => ({ ...prev, [key]: !prev[key] }));
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
    Object.values(columnGroups).forEach(group => {
      group.columns.forEach(col => {
        if (selectedColumns[col.key]) list.push(col);
      });
    });
    return list;
  }, [selectedColumns, columnGroups]);

  const columnLabels = useMemo(() => {
    const map: Record<string, string> = {};
    Object.values(columnGroups).forEach(group => {
      group.columns.forEach(col => {
        map[col.key] = col.label;
      });
    });
    return map;
  }, [columnGroups]);

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
        message: 'Export Successful',
        format: successMessage
      });
      onClose();
    } catch (error) {
      console.error('Export failed', error);
      showNotification({
        type: 'error',
        message: 'Export Failed',
        format: errorMessage
      });
    } finally {
      setIsExporting(false);
    }
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
                  <div className="flex items-center gap-3 mb-6 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm">
                      <Download className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] uppercase leading-tight">{title}</h2>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <FormatSelection format={format} setFormat={setFormat} />
                    <ScopeSelection scope={scope} setScope={setScope} scopeLabels={scopeLabels} />
                    <ColumnSelection
                      columnGroups={columnGroups}
                      selectedColumns={selectedColumns}
                      expandedGroups={expandedGroups}
                      toggleGroup={toggleGroup}
                      toggleColumn={toggleColumn}
                      setSelectedColumns={setSelectedColumns}
                    />
                  </div>
                </div>

                {/* Right Panel: Preview & Actions */}
                <div className="w-full md:w-[70%] flex flex-col bg-white p-6 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 rounded-full blur-[80px] pointer-events-none" />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-gray-400" />
                      <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Live Preview</h3>
                    </div>
                    <div className="text-xs text-gray-400 italic pr-2">
                      Showing {previewData.length} records
                    </div>
                  </div>

                  <style>{`
                    .preview-scrollbar-custom::-webkit-scrollbar {
                      width: 6px;
                      height: 6px;
                    }
                    .preview-scrollbar-custom::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .preview-scrollbar-custom::-webkit-scrollbar-thumb {
                      background: rgba(0,0,0,0.1);
                      border-radius: 10px;
                    }
                    .preview-scrollbar-custom::-webkit-scrollbar-thumb:hover {
                      background: rgba(0,0,0,0.2);
                    }
                  `}</style>

                  <PreviewTable<T>
                    tableContainerRef={tableContainerRef}
                    tableRef={tableRef}
                    ghostColumns={ghostColumns}
                    columnLabels={columnLabels}
                    activeColumnsList={activeColumnsList}
                    lastAddedColumn={lastAddedColumn}
                    columnAnimations={columnAnimations}
                    previewData={previewData}
                    formatCell={formatCell}
                  />

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
}
