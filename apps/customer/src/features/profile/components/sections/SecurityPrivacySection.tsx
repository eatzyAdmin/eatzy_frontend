"use client";

import { motion } from "@repo/ui/motion";
import { ShieldCheck, History, Download, Trash2, ArrowRight, Smartphone, Monitor } from "@repo/ui/icons";

export default function SecurityPrivacySection() {
  const loginHistory = [
    { device: "IPHONE 15 PRO", location: "Hồ Chí Minh, VN", date: "AUG 24, 21:40", active: true, icon: Smartphone },
    { device: "MACBOOK PRO M3", location: "Hồ Chí Minh, VN", date: "AUG 23, 10:15", active: false, icon: Monitor }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <ShieldCheck size={12} />
            Bảo mật
          </span>
        </div>
        <h2 className="text-[56px] font-bold leading-none text-[#1A1A1A] uppercase" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
          SECURITY
        </h2>
        <p className="text-gray-500 font-medium">Bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-lime-50 text-lime-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-[#1A1A1A]" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>Xác thực 2 lớp</h3>
            </div>
            <div className="flex justify-between items-center bg-[#1A1A1A] text-white p-6 rounded-[24px] relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-lime-500/20 transition-all" />
              <div className="relative z-10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Trạng thái</span>
                <span className="text-xl font-anton text-lime-400 tracking-wide uppercase">Đang kích hoạt</span>
              </div>
              <button className="relative z-10 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-lime-400" />
              </button>
            </div>
          </div>

          <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold uppercase tracking-tight text-[#1A1A1A]" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
                Hoạt động đăng nhập
              </h3>
              <History className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-5">
              {loginHistory.map((login, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-gray-200 transition-all">
                  <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-gray-400">
                    <login.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#1A1A1A] text-sm uppercase truncate">{login.device}</h4>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{login.location}</p>
                  </div>
                  <div className="text-right">
                    {login.active ? (
                      <span className="px-2 py-0.5 bg-lime-500 text-white text-[9px] font-bold rounded-full uppercase tracking-tighter shadow-lg shadow-lime-500/20">Kết nối</span>
                    ) : (
                      <span className="text-[10px] font-anton text-gray-300 uppercase italic tracking-tighter">{login.date}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1A1A1A] p-10 rounded-[40px] text-white relative overflow-hidden flex flex-col justify-between h-[300px] shadow-2xl group cursor-pointer hover:scale-[1.02] transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-lime-500/20 transition-all" />

            <div className="flex justify-between items-start relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Download className="w-7 h-7 text-lime-400" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Data Protocol</span>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-anton uppercase leading-none tracking-tight mb-3">Tải xuống dữ liệu</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">Yêu cầu bản sao dữ liệu cá nhân của bạn được lưu trữ trên hệ thống của Eatzy.</p>
            </div>

            <button className="relative z-10 w-full py-4 bg-white text-black font-anton text-sm uppercase tracking-widest rounded-2xl hover:bg-lime-500 transition-colors flex items-center justify-center gap-3 active:scale-95">
              Yêu cầu dữ liệu
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <button className="w-full p-8 border-2 border-dashed border-red-500/20 rounded-[32px] flex items-center justify-between group hover:bg-red-50 hover:border-red-500/40 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/10 group-hover:bg-red-500 group-hover:text-white transition-all">
                <Trash2 className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold uppercase tracking-tight text-red-600" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>Xóa tài khoản</h3>
                <p className="text-xs text-red-400 font-medium">Lưu ý: Hành động này không thể hoàn tác.</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-red-100 flex items-center justify-center group-hover:bg-red-500 transition-all">
              <ArrowRight className="w-4 h-4 text-red-300 group-hover:text-white translate-x-0 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
