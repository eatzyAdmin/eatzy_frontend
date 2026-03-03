import React from "react";
import { motion } from "framer-motion";
import { Wallet, Receipt } from "../../icons";

const WalletTransactionsShimmer = () => {
  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: {
      x: "100%",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  return (
    <div className="space-y-12">
      {/* Header & Balance Shimmer */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gray-100">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                <Wallet size={12} />
                Quản lý tài chính
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-x-6 gap-y-2">
              <div className="flex items-baseline gap-4 h-16 w-64 bg-gray-100 rounded-2xl relative overflow-hidden">
                <motion.div
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-24 h-12 bg-gray-100 rounded-2xl relative overflow-hidden">
              <motion.div
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-2xl relative overflow-hidden">
              <motion.div
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section Shimmer */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-200">
            <Receipt size={20} />
          </div>
          <div className="h-6 w-40 bg-gray-100 rounded-lg relative overflow-hidden">
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col -mx-4">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="px-2">
              <div className="flex items-center gap-4 py-6 px-4">
                {/* Icon Shimmer */}
                <div className="w-14 h-14 rounded-2xl bg-gray-100 relative overflow-hidden">
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                </div>

                {/* Content Shimmer */}
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 bg-gray-100 rounded-lg relative overflow-hidden">
                    <motion.div
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </div>
                  <div className="h-3 w-32 bg-gray-50 rounded-lg relative overflow-hidden">
                    <motion.div
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </div>
                  <div className="h-3 w-24 bg-gray-50/50 rounded-lg relative overflow-hidden">
                    <motion.div
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </div>
                </div>

                {/* Value Shimmer */}
                <div className="flex flex-col items-end gap-2">
                  <div className="h-6 w-24 bg-gray-100 rounded-lg relative overflow-hidden">
                    <motion.div
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </div>
                  <div className="h-3 w-16 bg-gray-50 rounded-lg relative overflow-hidden">
                    <motion.div
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </div>
                </div>
              </div>
              {idx < 4 && <div className="h-px bg-slate-50 mx-8" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletTransactionsShimmer;
