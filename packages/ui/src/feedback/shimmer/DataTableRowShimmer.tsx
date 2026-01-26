'use client';

import React from "react";
import { motion } from "framer-motion";

export type DataTableRowShimmerProps = { columnCount?: number; index?: number };

const DataTableRowShimmer = ({ columnCount = 6, index = 0 }: DataTableRowShimmerProps) => {
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: (index || 0) * 0.05, duration: 0.3, ease: "easeOut" }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-anim {
          animation: shimmer-slide 1.5s infinite linear;
        }
      `}} />
      <motion.tr variants={rowVariants} initial="hidden" animate="visible" exit="exit" className="hover:bg-gray-50 transition-colors">
        {Array.from({ length: columnCount }, (_, colIndex) => (
          <td key={colIndex} className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap">
            <div className="relative overflow-hidden">
              <div className={`h-4 bg-gray-200 rounded relative overflow-hidden ${colIndex === columnCount - 1 ? 'w-16' : colIndex === 0 ? 'w-32' : colIndex === 1 ? 'w-24' : colIndex === 2 ? 'w-40' : colIndex === 3 ? 'w-28' : colIndex === 4 ? 'w-32' : 'w-20'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent shimmer-anim" />
              </div>
            </div>
          </td>
        ))}
        <td className="px-3 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent shimmer-anim" />
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent shimmer-anim" />
            </div>
          </div>
        </td>
      </motion.tr>
    </>
  );
};

export default DataTableRowShimmer;