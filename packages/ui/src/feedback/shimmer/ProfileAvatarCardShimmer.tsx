import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "../../icons";

const ProfileAvatarCardShimmer = () => {
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
    <div className="bg-white rounded-[32px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex items-center gap-5 relative overflow-hidden group w-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 rounded-full blur-2xl -mr-16 -mt-16" />

      <div className="relative shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#F7F7F7] shadow-xl relative z-10 p-0.5 bg-gray-50">
          <div className="w-full h-full rounded-full bg-gray-200 relative overflow-hidden">
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-lime-500 text-white rounded-xl border-4 border-white flex items-center justify-center shadow-lg z-20">
          <ShieldCheck size={12} strokeWidth={3} />
        </div>
      </div>

      <div className="text-left relative z-10 min-w-0 flex-1 space-y-2">
        {/* Name Shimmer */}
        <div className="h-5 w-3/4 bg-gray-100 rounded-lg relative overflow-hidden">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
        </div>

        {/* Email Shimmer */}
        <div className="h-4 w-1/2 bg-gray-50 rounded-lg relative overflow-hidden">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatarCardShimmer;
