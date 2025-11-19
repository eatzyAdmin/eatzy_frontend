import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const LiquidGlassMobileNavigationShimmer = () => {
  const shimmerVariants = { initial: { x: "-100%" }, animate: { x: "100%", transition: { repeat: Infinity, duration: 1.5, ease: "linear" } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" } }) };
  const ShimmerMenuItem = ({ index }: { index: number }) => (
    <motion.div custom={index} variants={itemVariants} initial="hidden" animate="visible" className="bg-white/50 backdrop-blur-sm border border-white/40 shadow-[0_0_20px_rgba(0,0,0,0.1)] w-24 h-24 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="w-8 h-8 rounded-full bg-gray-200/60 mb-2 relative overflow-hidden">
        <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="w-16 h-2.5 bg-gray-200/60 rounded relative overflow-hidden">
        <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
    </motion.div>
  );
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="relative overflow-hidden rounded-3xl p-6" style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(4px)", border: "1px solid rgba(255, 255, 255, 0.3)", boxShadow: "0 25px 80px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 0 18px 12px rgba(255, 255, 255, 0.7)", width: "270px", minHeight: "270px" }}>
          <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="grid grid-cols-2 gap-6 relative z-10">
            {Array.from({ length: 4 }, (_, index) => (
              <ShimmerMenuItem key={index} index={index} />
            ))}
          </div>
        </div>
      </div>
      <div className="fixed w-15 h-15 rounded-full z-50 flex items-center justify-center overflow-hidden" style={{ left: "20px", top: "100px", width: "60px", height: "60px", background: "rgba(211, 159, 101, 0.45)", backdropFilter: "blur(15px)", border: "1px solid rgba(255, 255, 255, 0.8)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)" }}>
        <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center relative overflow-hidden">
          <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="w-3 h-3 rounded-full bg-white/60 relative overflow-hidden">
            <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes buttonAppear { 0% { opacity: 0; transform: scale(0.3);} 60% { transform: scale(1.1);} 100% { opacity: 1; transform: scale(1);} }
        @keyframes menuAppear { 0% { opacity: 0; transform: scale(0.1);} 60% { transform: scale(1.08);} 100% { opacity: 1; transform: scale(1);} }
      `}</style>
    </AnimatePresence>
  );
};

export default LiquidGlassMobileNavigationShimmer;