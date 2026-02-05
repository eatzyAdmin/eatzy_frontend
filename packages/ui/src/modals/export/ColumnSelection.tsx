'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { ColumnGroup } from './types';

interface ColumnSelectionProps {
  columnGroups: Record<string, ColumnGroup>;
  selectedColumns: Record<string, boolean>;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (key: string) => void;
  toggleColumn: (key: string) => void;
  setSelectedColumns: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const ColumnSelection: React.FC<ColumnSelectionProps> = ({
  columnGroups,
  selectedColumns,
  expandedGroups,
  toggleGroup,
  toggleColumn,
  setSelectedColumns
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Columns</label>
        </div>
        <span className="text-[11px] font-bold text-lime-700 bg-lime-100/80 px-3 py-1 rounded-full border border-lime-200/50 backdrop-blur-sm">
          {Object.values(selectedColumns).filter(Boolean).length} FIELDS
        </span>
      </div>

      <div className="space-y-3 pb-2">
        {Object.entries(columnGroups).map(([key, group]) => {
          const groupCols = group.columns;
          const selectedCount = groupCols.filter(c => selectedColumns[c.key]).length;
          const isAllSelected = selectedCount === groupCols.length;
          const isExpanded = !!expandedGroups[key];

          return (
            <div key={key} className="space-y-2">
              <div
                className={`
                  w-full px-4 py-2.5 rounded-[22px] border-2 transition-all duration-300 flex items-center justify-between cursor-pointer
                  ${isExpanded
                    ? 'bg-white border-lime-100 shadow-sm'
                    : 'bg-white border-gray-50 hover:border-lime-100/60 hover:bg-lime-50/40'
                  }
                `}
                onClick={() => toggleGroup(key)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-[14px] flex items-center justify-center transition-all ${isExpanded ? 'bg-lime-500 text-white shadow-lime-100' : 'bg-gray-50 text-gray-400'}`}>
                    {group.icon}
                  </div>
                  <div className="text-left">
                    <span className={`text-[13px] font-bold transition-colors ${isExpanded ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>{group.label}</span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{selectedCount}/{groupCols.length} ACTIVE</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newState = { ...selectedColumns };
                      groupCols.forEach(col => {
                        newState[col.key] = !isAllSelected;
                      });
                      setSelectedColumns(newState);
                    }}
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                      ${isAllSelected
                        ? 'bg-lime-500 text-white'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }
                    `}
                    title={isAllSelected ? "Unselect All" : "Select All"}
                  >
                    <Check size={12} strokeWidth={4} />
                  </button>

                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-lime-50 text-lime-600' : 'text-gray-400'}`}>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}
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
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 pr-2 space-y-2 py-1">
                      {groupCols.map(col => {
                        const isSelected = selectedColumns[col.key];
                        return (
                          <div
                            key={col.key}
                            onClick={() => toggleColumn(col.key)}
                            className={`
                              group flex items-center justify-between p-2 rounded-[24px] cursor-pointer transition-all duration-300 border-2
                              ${isSelected
                                ? 'bg-lime-50 border-lime-100 shadow-sm'
                                : 'bg-white border-gray-50 hover:border-lime-100/60 hover:bg-lime-50/40'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-9 h-9 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-all duration-300
                                ${isSelected
                                  ? 'bg-lime-100 text-lime-600'
                                  : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                }
                              `}>
                                {col.icon}
                              </div>
                              <span className={`text-[13px] font-bold tracking-tight transition-all ${isSelected ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                {col.label}
                              </span>
                            </div>

                            <div className={`
                              w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                              ${isSelected
                                ? "bg-lime-500 text-white scale-100"
                                : "bg-gray-100 text-transparent scale-90"
                              }
                            `}>
                              <Check size={12} strokeWidth={4} className={isSelected ? "opacity-100" : "opacity-0"} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
