import React from "react";
import { motion } from "framer-motion";
import { User, Phone, Calendar, Home, MapPin } from "../../icons";

const PersonalInfoShimmer = () => {
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

  const FieldShimmer = ({ label, icon: Icon, isFullWidth = false }: { label: string; icon: any; isFullWidth?: boolean }) => (
    <div className={`group relative ${isFullWidth ? 'md:col-span-2' : ''}`}>
      <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 px-1">{label}</span>
      <div className="flex items-center gap-4 py-5 px-6 rounded-[28px] bg-slate-50 border-2 border-transparent shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] transition-all overflow-hidden relative h-[68px]">
        <Icon size={20} className="text-gray-300 shrink-0" />
        <div className="h-5 w-3/4 bg-gray-200/50 rounded-lg relative overflow-hidden">
          <motion.div
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="hidden md:flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <User size={12} />
              Hồ sơ cá nhân
            </span>
          </div>
          <h2 className="text-4xl md:text-[56px] font-bold leading-none text-[#1A1A1A] uppercase font-anton">
            BIOGRAPHY
          </h2>
          <div className="h-5 w-64 bg-gray-100 rounded-lg relative overflow-hidden">
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </div>
        </div>

        {/* Action Button Shimmer */}
        <div className="w-full md:w-auto">
          <div className="h-14 w-full md:w-48 bg-gray-100 rounded-[24px] relative overflow-hidden border-2 border-slate-50">
            <motion.div
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        <FieldShimmer label="Họ và tên" icon={User} />
        <FieldShimmer label="Số điện thoại" icon={Phone} />
        <FieldShimmer label="Giới tính" icon={User} />
        <FieldShimmer label="Tuổi" icon={Calendar} />
        <FieldShimmer label="Quê quán" icon={Home} isFullWidth />

        <div className="group relative md:col-span-2">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 px-1">Địa chỉ liên hệ</span>
          <div className="flex items-start gap-4 p-6 rounded-[32px] bg-slate-50 border-2 border-transparent shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] transition-all overflow-hidden relative min-h-[120px]">
            <MapPin size={22} className="text-gray-300 mt-1 shrink-0" />
            <div className="space-y-3 w-full">
              <div className="h-4 w-3/4 bg-gray-200/50 rounded-lg relative overflow-hidden">
                <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </div>
              <div className="h-4 w-1/2 bg-gray-200/50 rounded-lg relative overflow-hidden">
                <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalInfoShimmer;
