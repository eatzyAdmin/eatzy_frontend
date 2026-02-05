'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewTableProps<T> {
  tableContainerRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLDivElement>;
  ghostColumns: Record<string, { value: boolean; position: { left: number; width: number } }>;
  columnLabels: Record<string, string>;
  activeColumnsList: { key: string; label: string; icon: React.ReactNode }[];
  lastAddedColumn: string | null;
  columnAnimations: Record<string, 'adding' | 'removing' | null>;
  previewData: T[];
  formatCell: (item: T, key: string) => React.ReactNode;
}

export function PreviewTable<T>({
  tableContainerRef,
  tableRef,
  ghostColumns,
  columnLabels,
  activeColumnsList,
  lastAddedColumn,
  columnAnimations,
  previewData,
  formatCell
}: PreviewTableProps<T>) {
  return (
    <div className="flex-1 border-4 border-gray-100 rounded-[32px] overflow-hidden relative bg-gray-50/20 shadow-inner">
      <div className="absolute inset-0 overflow-auto preview-scrollbar-custom" ref={tableContainerRef}>
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
  );
}
