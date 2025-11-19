import React from "react";
import { motion } from "framer-motion";

export type ProfileShimmerProps = { expanded?: boolean };

const ProfileShimmer = ({ expanded = false }: ProfileShimmerProps) => {
  const shimmerVariants = { initial: { x: "-100%" }, animate: { x: "100%", transition: { repeat: Infinity, duration: 1.5, ease: "linear" } } };
  const profileVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
  return (
    <motion.div variants={profileVariants} initial="hidden" animate="visible" className="profile-section relative flex items-center p-6 border-b border-white/30 cursor-pointer group transition-all duration-300 liquid-glass-nav-item shadow-[inset_0_0_12px_8px_rgba(255,255,255,0.1)]" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)", backdropFilter: "blur(10px)" }} layoutId="profile-section">
      {expanded ? (
        <>
          <motion.div className="relative h-12 w-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_12px_8px_rgba(255,255,255,0.3)] overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)", backdropFilter: "blur(15px)", border: "1px solid rgba(255, 255, 255, 0.2)" }} layoutId="profile-avatar">
            <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="w-5 h-5 rounded-md relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)" }}>
              <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </div>
          </motion.div>
          <div className="relative ml-4">
            <motion.div layoutId="profile-name" className="mb-1 relative overflow-hidden rounded" style={{ width: "120px", height: "14px", background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)", backdropFilter: "blur(8px)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </motion.div>
            <motion.div layoutId="profile-email" className="relative overflow-hidden rounded" style={{ width: "100px", height: "12px", background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)", backdropFilter: "blur(8px)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
            </motion.div>
          </div>
        </>
      ) : (
        <motion.div className="relative h-12 w-12 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_12px_8px_rgba(255,255,255,0.3)]" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)", backdropFilter: "blur(15px)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
          <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="w-5 h-5 rounded-md relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)" }}>
            <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfileShimmer;