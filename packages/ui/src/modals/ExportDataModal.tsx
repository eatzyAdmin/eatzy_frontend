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
  const [ghostColumns, setGhostColumns] = useState<Record<string, { value: boolean; position: { left: number; width: number } }>>({});
  const [lastAddedColumn, setLastAddedColumn] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);

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

  const findColumnPosition = (column: string) => { if (!tableRef.current) return { left: 0, width: 0 }; const columnElement = (tableRef.current as any).querySelector(`[data-column="${column}"]`); if (!columnElement) return { left: 0, width: 0 }; const rect = columnElement.getBoundingClientRect(); const tableRect = (tableRef.current as any).getBoundingClientRect(); return { left: rect.left - tableRect.left + (tableRef.current as any).scrollLeft, width: rect.width }; };
  const toggleColumn = (column: string) => { if (selectedColumns[column]) { const position = findColumnPosition(column); setTimeout(() => { setGhostColumns(prev => ({ ...prev, [column]: { value: true, position } })); }, 10); setTimeout(() => { setGhostColumns(prev => { const newGhosts = { ...prev }; delete newGhosts[column]; return newGhosts; }); }, 500); } else { setLastAddedColumn(column); } setSelectedColumns(prev => ({ ...prev, [column]: !prev[column] })); setTimeout(() => { setLastAddedColumn(null); }, 500); };
  const toggleSectionColumns = (section: string, value: boolean) => { const newSelectedColumns = { ...selectedColumns }; const newGhostColumns = { ...ghostColumns }; (columnCategories[section] || []).forEach(column => { if (column in newSelectedColumns) { if (newSelectedColumns[column] && !value) { newGhostColumns[column] = { value: true, position: findColumnPosition(column) }; } if (!newSelectedColumns[column] && value) { setLastAddedColumn(column); } newSelectedColumns[column] = value; } }); setSelectedColumns(newSelectedColumns); setGhostColumns(newGhostColumns); setTimeout(() => { setGhostColumns({}); setLastAddedColumn(null); }, 500); };
  const areSectionColumnsSelected = (section: string) => { if (!columnCategories || !columnCategories[section] || !Array.isArray(columnCategories[section])) return false; if (columnCategories[section].length === 0) return false; if (!selectedColumns) return false; return columnCategories[section].every(column => selectedColumns[column] === true); };

  const categorizedColumns = (() => { const categorized: Record<string, { key: string; label: string }[]> = {}; const labels = getColumnLabels(); if (!enableGrouping) { categorized.all = Object.keys(selectedColumns).map(column => ({ key: column, label: labels[column] || column })); return categorized; } Object.keys(columnCategories).forEach(category => { categorized[category] = []; }); if (!categorized.other) categorized.other = []; Object.entries(columnCategories).forEach(([category, columns]) => { if (Array.isArray(columns)) { columns.forEach(column => { const list = categorized[category] || (categorized[category] = []); const alreadyIncluded = list.some(item => item.key === column); const isInSelectedColumns = column in selectedColumns; let isComplexObject = false; if (data && data.length > 0 && !isInSelectedColumns) { const firstItem = data[0]!; if (firstItem && typeof firstItem === 'object') { isComplexObject = column in firstItem && firstItem[column] !== null && typeof firstItem[column] === 'object' && !Array.isArray(firstItem[column]); } } if (!alreadyIncluded && (isInSelectedColumns || isComplexObject)) { list.push({ key: column, label: labels[column] || column }); } }); } }); Object.keys(selectedColumns || {}).forEach(column => { let found = false; for (const category in categorized) { if ((categorized[category] || []).some(item => item.key === column)) { found = true; break; } } if (!found) { (categorized.other || (categorized.other = [])).push({ key: column, label: labels[column] || column }); } }); return categorized; })();

  const handleExport = () => {
    const exportData = data.map(item => { const row: Record<string, any> = {}; Object.keys(selectedColumns).forEach(column => { if (selectedColumns[column]) { const value = column.includes('.') ? getNestedValue(item, column) : item[column]; row[column] = formatData ? formatData(value, column) : value; } }); return row; });
    if (onExport) { onExport({ data: exportData, format: exportFormat, selectedColumns: Object.keys(selectedColumns).filter(k => selectedColumns[k]) }); }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-white rounded-2xl w-full max-w-5xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-[0_4px_20px_rgba(66,99,235,0.25)]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{title} <span className="text-sm hidden sm:block">(Dữ liệu xuất ra sẽ bao gồm {data.length} bản ghi)</span></h2>
                <motion.button onClick={onClose} className="p-2 rounded-full hover:bg-white/30 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><X size={20} /></motion.button>
              </div>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-gray-50 p-5 rounded-xl shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-indigo-100/50 hover:shadow-[0_8px_30px_rgba(79,70,229,0.1)] transition-all duration-500 relative overflow-hidden">
                  <div className="relative">
                    <h3 className="font-medium text-gray-800 mb-5 flex items-center"><div className="mr-2 p-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg text-white shadow-md"><FileText size={18} /></div><span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent font-semibold text-lg">Chọn cột dữ liệu</span><div className="bg-indigo-100 text-indigo-700 ml-3 px-3 py-1 rounded-full text-sm font-medium shadow-sm">{Object.values(selectedColumns).filter(Boolean).length} cột</div></h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {Object.keys(categorizedColumns).map(section => (
                        <div key={section} className="border border-indigo-200/50 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 relative group">
                          <motion.div className="flex items-center justify-between p-3.5 cursor-pointer bg-gradient-to-r from-white to-indigo-50/30 transition-colors border-b border-indigo-100/30" onClick={() => toggleSection(section)} whileHover={{ backgroundColor: 'rgba(238, 242, 255, 0.6)' }}>
                            <div className="flex items-center"><span className="font-medium text-gray-700">{section}</span><span className="ml-2 text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full shadow-sm">{(categorizedColumns[section] || []).filter(({key}) => selectedColumns[key]).length}/{(categorizedColumns[section] || []).length}</span></div>
                            <div className="flex items-center space-x-3">
                              <div className={`relative w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer overflow-hidden ${areSectionColumnsSelected(section) ? 'bg-gradient-to-r from-indigo-500 to-blue-500 shadow-[0_0_0_1px_rgba(79,70,229,0.2)]' : 'bg-white border border-gray-300'}`} onClick={(e) => { e.stopPropagation(); toggleSectionColumns(section, !areSectionColumnsSelected(section)); }}>
                                {areSectionColumnsSelected(section) && (<Check size={12} className="text-white" />)}
                              </div>
                              <motion.div animate={{ rotate: expandedSections[section] ? 180 : 0 }} transition={{ duration: 0.3 }} className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full p-1.5 hover:shadow-md transition-all"><ChevronDown size={16} className="text-indigo-600" /></motion.div>
                            </div>
                          </motion.div>
                          <AnimatePresence>
                            {expandedSections[section] && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden bg-gradient-to-b from-white to-indigo-50/30">
                                <div className="border-t border-indigo-50">
                                  {(categorizedColumns[section] || []).map(({ key, label }) => (
                                    <motion.div key={key} className={`flex items-center px-4 py-3 border-b border-indigo-50 last:border-b-0 transition-all duration-100 relative ${selectedColumns[key] ? 'bg-gradient-to-r from-indigo-50/80 to-blue-50/80' : 'hover:bg-indigo-50/30'}`} whileHover={{ x: 8 }}>
                                      <div className={`relative w-5 h-5 rounded-md flex items-center justify-center mr-3 transition-all cursor-pointer overflow-hidden ${selectedColumns[key] ? 'bg-gradient-to-r from-indigo-500 to-blue-500 shadow-[0_0_0_1px_rgba(79,70,229,0.2)]' : 'bg-white border border-gray-300'}`} onClick={() => toggleColumn(key)}>
                                        {selectedColumns[key] && (<Check size={12} className="text-white" />)}
                                      </div>
                                      <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleColumn(key)}><span className={`text-sm relative transition-colors duration-200 ${selectedColumns[key] ? 'text-indigo-700 font-medium' : 'text-gray-700'}`}>{label}</span></div>
                                      {selectedColumns[key] && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-r-full" />)}
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                    <div className="pt-8 relative">
                      <h3 className="font-medium text-gray-800 mb-4 flex items-center"><div className="mr-2 p-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg text-white shadow-md"><FileText size={18} /></div><span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent font-semibold text-lg">Định dạng xuất</span></h3>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }} className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center relative overflow-hidden ${exportFormat === 'pdf' ? 'border-red-300 shadow-[0_5px_20px_rgba(239,68,68,0.15)] bg-gradient-to-br from-red-50 to-red-100/50' : 'border-gray-200 hover:border-red-200 hover:shadow-[0_5px_15px_rgba(0,0,0,0.05)]'}`} onClick={() => setExportFormat('pdf')}>
                          <div className={`p-3 rounded-full mb-2 ${exportFormat === 'pdf' ? 'bg-red-100' : 'bg-gray-100'}`}><span className={`${exportFormat === 'pdf' ? 'text-red-500' : 'text-gray-400'}`}>PDF</span></div>
                          <span className={`text-sm ${exportFormat === 'pdf' ? 'text-red-600 font-medium' : 'text-gray-600'}`}>PDF</span>
                          {exportFormat === 'pdf' && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md"><Check size={12} className="text-white" /></motion.div>)}
                        </motion.div>
                        <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }} className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center relative overflow-hidden ${exportFormat === 'excel' ? 'border-green-300 shadow-[0_5px_20px_rgba(34,197,94,0.15)] bg-gradient-to-br from-green-50 to-green-100/50' : 'border-gray-200 hover:border-green-200 hover:shadow-[0_5px_15px_rgba(0,0,0,0.05)]'}`} onClick={() => setExportFormat('excel')}>
                          <div className={`p-3 rounded-full mb-2 ${exportFormat === 'excel' ? 'bg-green-100' : 'bg-gray-100'}`}><span className={`${exportFormat === 'excel' ? 'text-green-600' : 'text-gray-400'}`}>Excel</span></div>
                          <span className={`text-sm ${exportFormat === 'excel' ? 'text-green-600 font-medium' : 'text-gray-600'}`}>Excel</span>
                          {exportFormat === 'excel' && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md"><Check size={12} className="text-white" /></motion.div>)}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-medium text-gray-800 mb-5 flex items-center"><div className="mr-2 p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg text-white shadow-md"><Eye size={18} /></div><span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent font-semibold text-lg">Xem trước dữ liệu</span></h3>
                  {Object.values(selectedColumns).some(Boolean) ? (
                    <div className="border border-blue-200/50 rounded-xl overflow-hidden shadow-[0_5px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(66,153,225,0.1)] transition-all duration-500 relative bg-white/80 backdrop-blur-sm">
                      <div className="overflow-x-auto relative" ref={tableRef as any}>
                        <motion.div className="min-w-full relative">
                          <table className="min-w-full divide-y divide-blue-100">
                            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                              <tr className="relative">
                                {Object.keys(selectedColumns).map(column => selectedColumns[column] && (
                                  <th key={column} data-column={column} className={`px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider border-r border-blue-100/30 last:border-r-0 relative ${column === lastAddedColumn ? 'text-blue-700' : 'text-gray-600'}`}>
                                    <div className="flex items-center space-x-1.5"><span>{getColumnLabels()[column] || column}</span></div>
                                    {column === lastAddedColumn && (<motion.div className="absolute inset-0 bg-blue-200/30 z-0" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.5 }} />)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-blue-50">
                              {previewData.map((row, index) => (
                                <tr key={index} className="hover:bg-blue-50/50 transition-colors duration-200 relative">
                                  {Object.keys(selectedColumns).map(column => selectedColumns[column] && (
                                    <td key={column} data-column={column} className={`px-4 py-3.5 whitespace-nowrap text-sm border-r border-blue-50 last:border-r-0 relative ${column === lastAddedColumn ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>{row[column]}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </motion.div>
                      </div>
                      {data.length > 3 && (<div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 text-xs text-gray-600 flex items-center justify-center border-t border-blue-100/50"><Info size={14} className="mr-1.5 text-blue-500" /><span>Hiển thị <span className="font-medium text-blue-700">3</span>/<span className="font-medium text-indigo-700">{data.length}</span> bản ghi</span></div>)}
                    </div>
                  ) : (
                    <div className="border border-blue-200/50 rounded-xl p-10 text-center shadow-[0_5px_30px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-sm">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-5 shadow-inner"><Calendar size={40} className="text-blue-300" /></div>
                        <p className="text-gray-600 font-medium text-lg mb-2">Vui lòng chọn ít nhất một cột dữ liệu</p>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">Các cột được chọn từ danh sách bên trái sẽ hiển thị ở đây để bạn có thể xem trước dữ liệu trước khi xuất</p>
                      </div>
                    </div>
                  )}
                  <motion.div className="mt-6 bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-5 border border-blue-200/50 shadow-[0_5px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(66,153,225,0.08)] transition-all duration-500 relative overflow-hidden" initial={false} animate={{ height: Object.values(selectedColumns).some(Boolean) ? 'auto' : 0, opacity: Object.values(selectedColumns).some(Boolean) ? 1 : 0 }} transition={{ duration: 0.3 }}>
                    {Object.values(selectedColumns).some(Boolean) && (
                      <>
                        <h4 className="font-medium text-gray-700 mb-4 flex items-center"><div className="mr-2 p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg text-white shadow-md"><File size={16} /></div><span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent font-medium">Thông tin file xuất</span></h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <motion.div className="p-3.5 bg-white rounded-lg border border-blue-100/50"><div className="flex items-center"><div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-blue-500 mr-3 shadow-sm">{exportFormat === 'pdf' ? 'PDF' : 'Excel'}</div><div><div className="text-gray-500 text-xs">Định dạng</div><div className="font-medium text-gray-800">{exportFormat === 'pdf' ? 'PDF Document' : 'Excel Document'}</div></div></div></motion.div>
                            <motion.div className="p-3.5 bg-white rounded-lg border border-blue-100/50"><div className="flex items-center"><div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-green-500 mr-3 shadow-sm"><Hash size={16} /></div><div><div className="text-gray-500 text-xs">Số bản ghi</div><div className="font-medium text-gray-800">{data.length}</div></div></div></motion.div>
                            <motion.div className="p-3.5 bg-white rounded-lg border border-blue-100/50"><div className="flex items-center"><div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-amber-500 mr-3 shadow-sm"><Info size={16} /></div><div><div className="text-gray-500 text-xs">Số cột</div><div className="font-medium text-gray-800">{Object.values(selectedColumns).filter(Boolean).length}</div></div></div></motion.div>
                          </div>
                          <motion.div className="p-3.5 bg-white rounded-lg border border-blue-100/50"><div className="flex items-center"><div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-blue-500 mr-3 shadow-sm"><Calendar size={16} /></div><div><div className="text-gray-500 text-xs">Tên file</div><div className="font-medium text-gray-800 truncate max-w-full">data-export-{new Date().toISOString().split('T')[0]}.{exportFormat === 'pdf' ? 'pdf' : 'xlsx'}</div></div></div></motion.div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4 bg-gradient-to-r from-gray-50 to-gray-100">
              <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} onClick={onClose} className="px-4 md:px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]"><span className="flex items-center font-semibold"><X size={18} className="mr-2" />Hủy bỏ</span></motion.button>
              <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} onClick={handleExport} className={`px-6 py-3 rounded-xl flex items-center space-x-2 ${Object.values(selectedColumns).some(Boolean) ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:shadow-[0_4px_20px_rgba(66,99,235,0.3)]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 relative overflow-hidden`} disabled={!Object.values(selectedColumns).some(Boolean)}>
                <div className="flex items-center relative z-10"><Download size={18} className="mr-2" /><span>Xuất dữ liệu</span></div>
                {Object.values(selectedColumns).some(Boolean) && (<div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-30 blur-xl rounded-xl" />)}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExportDataModal;