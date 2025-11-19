import React from "react";
import { motion } from "framer-motion";

export type NavItemShimmerProps = { expanded?: boolean; index?: number };

const NavItemShimmer = ({ expanded = false, index = 0 }: NavItemShimmerProps) => {
  const shimmerVariants = { initial: { x: "-100%" }, animate: { x: "100%", transition: { repeat: Infinity, duration: 1.5, ease: "linear" } } };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.4, ease: "easeOut" } } };
  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="liquid-glass-nav-item flex items-center px-4 py-3 my-1 rounded-xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)", backdropFilter: "blur(10px)", boxShadow: "inset 0 0 20px 12px rgba(255, 255, 255, 0.5)" }}>
      <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ backdropFilter: "blur(5px)" }} />
      <div className={`relative ${expanded ? "" : "mx-auto"}`}>
        <div className="w-5 h-5 rounded-md relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)", backdropFilter: "blur(8px)" }}>
          <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
      {expanded && (
        <div className="ml-3 relative">
          <div className="h-3.5 rounded relative overflow-hidden" style={{ width: `${Math.random() * 40 + 60}px`, background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)", backdropFilter: "blur(8px)" }}>
            <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NavItemShimmer;