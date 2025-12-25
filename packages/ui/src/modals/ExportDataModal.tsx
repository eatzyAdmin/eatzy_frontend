import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Eye, Download, File, ChevronDown, Calendar, Hash, Check, Info } from "lucide-react";

export type ExportDataModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, any>[];
  onExport?: (payload: { data: Record<string, any>[]; format: 'pdf' | 'excel'; selectedColumns: string[] }) => void;
  initialSelectedColumns?: string[] | Record<string, boolean> | null;
  title?: string;
  columnLabels?: Record<string, string> | null;
  formatData?: (value: any, column: string) => any;
  defaultFormat?: 'pdf' | 'excel';
  customColumnCategories?: Record<string, string[]> | null;
  enableGrouping?: boolean;
};

const ExportDataModal = ({ isOpen, onClose, data = [], onExport, initialSelectedColumns = null, title = "Xuất dữ liệu", columnLabels = null, formatData = (v) => v, defaultFormat = "pdf", customColumnCategories = null, enableGrouping = true }: ExportDataModalProps) => {
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({});
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>(defaultFormat);
  const [previewData, setPreviewData] = useState<Record<string, any>[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ personal: true, contact: true, address: true, other: true });
  const [columnAnimations, setColumnAnimations] = useState<Record<string, 'adding' | 'removing' | null>>({});
  const [lastAddedColumn, setLastAddedColumn] = useState<string | null>(null);
  const [lastRemovedColumn, setLastRemovedColumn] = useState<string | null>(null);
  const [ghostColumns, setGhostColumns] = useState<Record<string, { value: boolean; position: { left: number; width: number } }>>({});
  const tableRef = useRef<HTMLDivElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const lastToggledColumn = useRef<string | null>(null);
  const previousSelectedColumns = useRef<Record<string, boolean>>({});

  const defaultColumnCategories: Record<string, string[]> = { personal: ['fullName', 'birthDate', 'age', 'idNumber', 'code'], contact: ['email', 'phone'], address: ['permanentAddress', 'contactAddress'], other: ['registrationDate', 'status'] };
  const columnCategories = customColumnCategories || defaultColumnCategories;
  const toggleSection = (section: string) => { setExpandedSections(prev => ({ ...prev, [section]: !prev[section] })); };

  useEffect(() => {
    if (initialSelectedColumns && Array.isArray(initialSelectedColumns)) { const columns: Record<string, boolean> = {}; initialSelectedColumns.forEach(column => { columns[column] = true; }); setSelectedColumns(columns); }
    else if (initialSelectedColumns && typeof initialSelectedColumns === 'object') { setSelectedColumns(initialSelectedColumns as Record<string, boolean>); }
    else if (data && data.length > 0) { const firstItem = data[0]!; const columns: Record<string, boolean> = {}; if (enableGrouping && columnCategories) { Object.values(columnCategories).flat().forEach(column => { if (column.includes('.')) { columns[column] = true; } else { if (firstItem && column in firstItem) { columns[column] = true; } } }); } else { Object.keys(firstItem).forEach(key => { columns[key] = true; }); } setSelectedColumns(columns); }
  }, [data, initialSelectedColumns, columnCategories, enableGrouping]);

  const getColumnLabels = () => { if (columnLabels) return columnLabels; const labels: Record<string, string> = {}; const first = data && data.length > 0 ? data[0] : undefined; if (first) { Object.keys(first).forEach(key => { labels[key] = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); }); } return labels; };
  const formatValue = (value: any, column: string) => { if (formatData) return formatData(value, column); if (value === null || value === undefined) return ''; if (typeof value === 'object') return JSON.stringify(value); return String(value); };
  const getNestedValue = (obj: any, path: string) => { if (!path.includes('.')) return obj[path]; const parts = path.split('.'); let value = obj; for (const part of parts) { if (value && typeof value === 'object') { value = value[part]; } else { return undefined; } } return value; };
  useEffect(() => { if (data && data.length > 0) { const preview = data.slice(0, 3).map(item => { const row: Record<string, any> = {}; Object.keys(selectedColumns).forEach(column => { if (selectedColumns[column]) { const value = getNestedValue(item, column); row[column] = formatValue(value, column); } }); return row; }); setPreviewData(preview); } }, [selectedColumns, data]);
  const findColumnPosition = (column: string) => { if (!tableRef.current) return { left: 0, width: 0 }; const columnElement = tableRef.current.querySelector(`[data-column="${column}"]`); if (!columnElement) return { left: 0, width: 0 }; const rect = columnElement.getBoundingClientRect(); const tableRect = tableRef.current.getBoundingClientRect(); return { left: rect.left - tableRect.left + tableRef.current.scrollLeft, width: rect.width }; };

  const toggleColumn = (column: string) => {
    lastToggledColumn.current = column; previousSelectedColumns.current = { ...selectedColumns };
    if (selectedColumns[column]) { setLastRemovedColumn(column); const position = findColumnPosition(column); setTimeout(() => { setGhostColumns(prev => ({ ...prev, [column]: { value: true, position } })); }, 10); setTimeout(() => { setGhostColumns(prev => { const newGhosts = { ...prev }; delete newGhosts[column]; return newGhosts; }); }, 500); } else { setLastAddedColumn(column); }
    setSelectedColumns(prev => ({ ...prev, [column]: !prev[column] })); setColumnAnimations(prev => ({ ...prev, [column]: !selectedColumns[column] ? 'adding' : 'removing' }));
    setTimeout(() => { setColumnAnimations(prev => ({ ...prev, [column]: null })); if (selectedColumns[column]) { setLastRemovedColumn(null); } else { setLastAddedColumn(null); } }, 500);
  };

  const toggleSectionColumns = (section: string, value: boolean) => {
    const newSelectedColumns = { ...selectedColumns }; const columnsToAnimate: Record<string, 'adding' | 'removing'> = {}; const newGhostColumns = { ...ghostColumns }; previousSelectedColumns.current = { ...selectedColumns };
    (columnCategories[section] || []).forEach(column => { if (column in newSelectedColumns) { if (newSelectedColumns[column] !== value) { columnsToAnimate[column] = value ? 'adding' : 'removing'; if (newSelectedColumns[column] && !value) { newGhostColumns[column] = { value: true, position: findColumnPosition(column) }; setLastRemovedColumn(column); } if (!newSelectedColumns[column] && value) { setLastAddedColumn(column); } } newSelectedColumns[column] = value; } });
    setSelectedColumns(newSelectedColumns); setGhostColumns(newGhostColumns); setColumnAnimations(prev => ({ ...prev, ...columnsToAnimate }));
    setTimeout(() => { const resetAnimations: Record<string, null> = {}; Object.keys(columnsToAnimate).forEach(column => { resetAnimations[column] = null; }); setColumnAnimations(prev => ({ ...prev, ...resetAnimations })); setGhostColumns({}); setLastAddedColumn(null); setLastRemovedColumn(null); }, 500);
  };

  const areSectionColumnsSelected = (section: string) => { if (!columnCategories || !columnCategories[section] || !Array.isArray(columnCategories[section])) return false; if (columnCategories[section].length === 0) return false; if (!selectedColumns) return false; return columnCategories[section].every(column => selectedColumns[column] === true); };
  const categorizedColumns = (() => { const categorized: Record<string, { key: string; label: string }[]> = {}; const labels = getColumnLabels(); if (!enableGrouping) { categorized.all = Object.keys(selectedColumns).map(column => ({ key: column, label: labels[column] || column })); return categorized; } Object.keys(columnCategories).forEach(category => { categorized[category] = []; }); if (!categorized.other) categorized.other = []; Object.entries(columnCategories).forEach(([category, columns]) => { if (Array.isArray(columns)) { columns.forEach(column => { const list = categorized[category] || (categorized[category] = []); const alreadyIncluded = list.some(item => item.key === column); const isInSelectedColumns = column in selectedColumns; let isComplexObject = false; if (data && data.length > 0 && !isInSelectedColumns) { const firstItem = data[0]!; if (firstItem && typeof firstItem === 'object') { isComplexObject = column in firstItem && firstItem[column] !== null && typeof firstItem[column] === 'object' && !Array.isArray(firstItem[column]); } } if (!alreadyIncluded && (isInSelectedColumns || isComplexObject)) { list.push({ key: column, label: labels[column] || column }); } }); } }); Object.keys(selectedColumns || {}).forEach(column => { let found = false; for (const category in categorized) { if ((categorized[category] || []).some(item => item.key === column)) { found = true; break; } } if (!found) { (categorized.other || (categorized.other = [])).push({ key: column, label: labels[column] || column }); } }); return categorized; })();
  const handleExport = () => { const exportData = data.map(item => { const row: Record<string, any> = {}; Object.keys(selectedColumns).forEach(column => { if (selectedColumns[column]) { const value = column.includes('.') ? getNestedValue(item, column) : item[column]; row[column] = formatData ? formatData(value, column) : value; } }); return row; }); if (onExport) { onExport({ data: exportData, format: exportFormat, selectedColumns: Object.keys(selectedColumns).filter(k => selectedColumns[k]) }); } onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 bg-primary text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{title} <span className="text-sm font-normal text-white/80 hidden sm:inline ml-2">(Dữ liệu xuất ra sẽ bao gồm {data.length} bản ghi)</span></h2>
                <motion.button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><X size={20} /></motion.button>
              </div>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-gray-50 p-5 rounded-xl border border-gray-200 relative overflow-hidden">
                  <h3 className="font-medium text-gray-900 mb-5 flex items-center"><div className="mr-2 p-2 bg-primary rounded-lg text-white"><FileText size={18} /></div><span className="font-semibold text-lg">Chọn cột dữ liệu</span><div className="bg-primary/10 text-primary ml-3 px-3 py-1 rounded-full text-sm font-medium">{Object.values(selectedColumns).filter(Boolean).length} cột</div></h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {Object.keys(categorizedColumns).map(section => (
                      <div key={section} className="border border-gray-200 rounded-xl overflow-hidden bg-white relative group">
                        <motion.div className={`flex items-center justify-between p-3.5 cursor-pointer border-b border-gray-100 transition-colors ${areSectionColumnsSelected(section) ? 'bg-primary/5' : 'bg-white'}`} onClick={() => toggleSection(section)} whileHover={{ backgroundColor: '#f3f4f6' }}>
                          <div className="flex items-center"><span className="font-medium text-gray-700 capitalize">{section}</span></div>
                          <div className="flex items-center space-x-3">
                            <div className={`relative w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer overflow-hidden ${areSectionColumnsSelected(section) ? 'bg-primary' : 'bg-white border border-gray-300'}`} onClick={(e) => { e.stopPropagation(); toggleSectionColumns(section, !areSectionColumnsSelected(section)); }}>{areSectionColumnsSelected(section) && (<Check size={12} className="text-white" />)}</div>
                            <motion.div animate={{ rotate: expandedSections[section] ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown size={16} className="text-gray-600" /></motion.div>
                          </div>
                        </motion.div>
                        <AnimatePresence>
                          {expandedSections[section] && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden bg-white">
                              <div>{(categorizedColumns[section] || []).map(({ key, label }) => (<motion.div key={key} className={`flex items-center px-4 py-3 border-b border-gray-50 last:border-b-0 transition-all duration-100 relative ${selectedColumns[key] ? 'bg-primary/5' : 'hover:bg-gray-50'}`} whileHover={{ x: 4 }}><div className={`relative w-5 h-5 rounded-md flex items-center justify-center mr-3 transition-all cursor-pointer overflow-hidden ${selectedColumns[key] ? 'bg-primary' : 'bg-white border border-gray-300'}`} onClick={() => toggleColumn(key)}>{selectedColumns[key] && (<Check size={12} className="text-white" />)}</div><div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleColumn(key)}><span className={`text-sm relative transition-colors duration-200 ${selectedColumns[key] ? 'text-primary font-medium' : 'text-gray-600'}`}>{label}</span></div></motion.div>))}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-medium text-gray-900 mb-5 flex items-center"><div className="mr-2 p-2 bg-primary rounded-lg text-white"><Eye size={18} /></div><span className="font-semibold text-lg">Xem trước dữ liệu</span></h3>
                  {Object.values(selectedColumns).some(Boolean) ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                      <div className="overflow-x-auto relative" ref={tableContainerRef}>
                        <motion.div className="min-w-full relative" ref={tableRef} layout="position" layoutRoot transition={{ type: "spring", stiffness: 200, damping: 30, duration: 0.4 }}>
                          <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                              <tr className="relative">
                                {Object.entries(ghostColumns).map(([column, ghost]) => (<motion.th key={`ghost-${column}`} className="absolute px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-100 pointer-events-none" style={{ left: ghost.position.left, width: ghost.position.width, zIndex: 5 }} initial={{ opacity: 0.9 }} animate={{ opacity: 0, y: -10, scale: 0.9 }} transition={{ duration: 0.4 }}>{getColumnLabels()[column] || column}</motion.th>))}
                                <AnimatePresence initial={false} mode="sync">{Object.keys(selectedColumns).map(column => selectedColumns[column] && (<motion.th key={column} data-column={column} className={`px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-r border-gray-100 last:border-r-0 relative ${column === lastAddedColumn ? 'text-primary' : 'text-gray-600'}`} initial={{ opacity: 0, width: 0, scale: 0.8 }} animate={{ opacity: 1, width: 'auto', scale: 1 }} exit={{ opacity: 0, width: 0, scale: 0.8 }} transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.4 }} layout="position"><span>{getColumnLabels()[column] || column}</span></motion.th>))}</AnimatePresence>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                              {previewData.map((row, index) => (<motion.tr key={index} className="hover:bg-gray-50 transition-colors duration-200 relative" layout="position">{Object.entries(ghostColumns).map(([column, ghost]) => (<motion.td key={`ghost-${column}-${index}`} className="absolute px-4 py-3.5 whitespace-nowrap text-sm text-gray-700/40 border-r border-gray-50 pointer-events-none" style={{ left: ghost.position.left, width: ghost.position.width, zIndex: 5 }}>{row[column]}</motion.td>))}<AnimatePresence initial={false} mode="sync">{Object.keys(selectedColumns).map(column => selectedColumns[column] && (<motion.td key={column} data-column={column} className={`px-4 py-3.5 whitespace-nowrap text-sm border-r border-gray-50 last:border-r-0 relative ${column === lastAddedColumn ? 'text-primary font-medium' : 'text-gray-700'}`} initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} layout="position">{row[column]}</motion.td>))}</AnimatePresence></motion.tr>))}
                            </tbody>
                          </table>
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-xl p-10 text-center bg-white"><p className="text-gray-900 font-medium text-lg mb-2">Vui lòng chọn ít nhất một cột dữ liệu</p></div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4 bg-gray-50">
              <motion.button onClick={onClose} className="px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 border border-gray-200">Hủy bỏ</motion.button>
              <motion.button onClick={handleExport} className={`px-6 py-3 rounded-xl flex items-center space-x-2 ${Object.values(selectedColumns).some(Boolean) ? 'bg-primary text-white hover:brightness-105' : 'bg-gray-200 text-gray-400'} shadow-md`} disabled={!Object.values(selectedColumns).some(Boolean)}><Download size={18} className="mr-2" /><span>Xuất dữ liệu</span></motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ExportDataModal;