import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Home, MapPin } from "../../icons";

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
    <div className={`group relative ${isFullWidth ? '' : 'flex-1'}`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">{label}</span>
      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-transparent shadow-[inset_0_0_15px_rgba(0,0,0,0.02)] transition-all overflow-hidden relative">
        <Icon size={16} className="text-gray-300 shrink-0" />
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
      {/* Header & Avatar Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <User size={12} />
              Hồ sơ cá nhân
            </span>
          </div>
          <h2 className="text-[56px] font-bold leading-none text-[#1A1A1A] uppercase" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
            BIOGRAPHY
          </h2>
          <p className="text-gray-500 font-medium">Cập nhật và quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group/avatar">
            <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-xl relative z-10 transition-transform bg-gray-100 p-0.5">
              <div className="w-full h-full rounded-[28px] bg-gray-200 relative overflow-hidden">
                <motion.div
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-100 text-gray-300 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg z-20">
              <div className="w-4 h-4 rounded bg-gray-200/50" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-14 w-40 bg-gray-100 rounded-[24px] relative overflow-hidden border-2 border-slate-50">
              <motion.div
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>
            <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full w-24 h-5 relative overflow-hidden self-start">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Info Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldShimmer label="Họ và tên" icon={User} />
            <FieldShimmer label="Email" icon={Mail} />
            <FieldShimmer label="Số điện thoại" icon={Phone} />
            <FieldShimmer label="Giới tính" icon={User} />
            <FieldShimmer label="Tuổi" icon={Calendar} />
            <FieldShimmer label="Quê quán" icon={Home} />
          </div>

          <div className="group relative">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">Địa chỉ liên hệ</span>
            <div className="flex items-start gap-3 p-5 rounded-2xl bg-slate-50 border-2 border-transparent transition-all overflow-hidden relative min-h-[80px]">
              <MapPin size={18} className="text-gray-300 mt-1 shrink-0" />
              <div className="h-5 w-full bg-gray-200/50 rounded-lg relative overflow-hidden mt-0.5">
                <motion.div
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1A1A1A] rounded-[32px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <h3 className="text-xs font-anton uppercase tracking-widest text-lime-500 mb-6">Trạng thái tài khoản</h3>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hạng thành viên</span>
                <div className="h-4 w-16 bg-white/10 rounded-lg relative overflow-hidden">
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tích lũy chi tiêu</span>
                  <div className="h-3 w-8 bg-white/10 rounded-lg relative overflow-hidden">
                    <motion.div
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </div>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden" />
              </div>

              <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                {[1, 2].map(i => (
                  <div key={i}>
                    <div className="h-2 w-10 bg-white/5 rounded-full mb-1 relative overflow-hidden">
                      <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                    <div className="h-3 w-14 bg-white/10 rounded-full relative overflow-hidden">
                      <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200/50" />
              <div className="h-3 w-24 bg-gray-200/50 rounded-full" />
            </div>
            <div className="h-2 w-full bg-gray-200/30 rounded-full" />
            <div className="h-2 w-2/3 bg-gray-200/30 rounded-full" />
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-1 flex-1 bg-gray-200 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalInfoShimmer;
