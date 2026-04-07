"use client";

import { motion } from "@repo/ui/motion";
import {
  CreditCard, Building2, Landmark,
  CheckCircle2, AlertCircle, FileText,
  ShieldCheck
} from "@repo/ui/icons";
import { DriverProfile } from "@repo/types";
import { EmptyState } from "@/components/ui/EmptyState";

export default function BankInfoSection({ profile }: { profile: DriverProfile }) {
  // Empty State Handle
  if (!profile?.bank_name && !profile?.bank_account_number) {
    return (
      <EmptyState
        icon={CreditCard}
        title="Chưa liên kết ngân hàng"
        description="Vui lòng cập nhật đầy đủ thông tin tài khoản ngân hàng để Eatzy có thể thực hiện thanh toán thu nhập cho bạn."
        buttonText="Thêm tài khoản ngay"
        onButtonClick={() => { }}
        className="py-12"
      />
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'APPROVED': return 'text-lime-500 bg-lime-50 border-lime-100';
      case 'REJECTED': return 'text-red-500 bg-red-50 border-red-100';
      case 'PENDING': return 'text-orange-500 bg-orange-50 border-orange-100';
      default: return 'text-gray-400 bg-gray-50 border-gray-100';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 size={14} />;
      case 'REJECTED': return <AlertCircle size={14} />;
      case 'PENDING': return <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><AlertCircle size={14} /></motion.div>;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 md:space-y-10 pb-20"
    >
      {/* Premium Bank Card */}
      <div className="relative group">
        <div className="relative overflow-hidden rounded-[32px] md:rounded-[36px] bg-[#1A1A1A] text-white p-6 md:p-10 border border-white/5">
          {/* Card Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>

          <div className="flex flex-col h-full justify-between gap-6 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110">
                  <Landmark size={24} className="text-lime-400 md:w-7 md:h-7" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-lime-300/60 mb-1">Tên ngân hàng</p>
                  <h3 className="text-lg md:text-2xl font-bold uppercase leading-tight">{profile.bank_name || "CHƯA CẬP NHẬT"}</h3>
                  <p className="text-[10px] md:text-xs text-white/40 font-medium truncate max-w-[150px] md:max-w-none">{profile.bank_branch || "Chi nhánh chưa xác định"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Số tài khoản</p>
              <p className="text-xl md:text-3xl font-anton tracking-[0.1em] text-white/90">
                {profile.bank_account_number ?
                  profile.bank_account_number.replace(/\d(?=\d{4})/g, "•") :
                  "•••• •••• •••• ••••"
                }
              </p>
            </div>
          </div>

          {/* Verification Status Badge - Absolute Positioned - Style Preserved */}
          <div className={`absolute right-5 bottom-5 md:right-6 md:bottom-6 px-3 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tight z-20 ${getStatusColor(profile.bank_account_status)}`}>
            {getStatusIcon(profile.bank_account_status)}
            <span className="hidden xs:inline">{profile.bank_account_status || 'CHƯA XÁC THỰC'}</span>
            <span className="xs:hidden">XÁC THỰC</span>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-lime-500 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
        </div>
      </div>

      {/* Additional Bank Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <DetailItem
          icon={<Building2 size={18} />}
          label="Chi nhánh"
          value={profile.bank_branch}
        />
        <DetailItem
          icon={<FileText size={18} />}
          label="Mã số thuế"
          value={profile.tax_code}
        />
      </div>

      {/* Security Tip */}
      <div className="bg-lime-50/50 rounded-[32px] p-5 border border-lime-100/50 flex gap-4 items-start transition-all">
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-lime-600 shadow-[0_4px_12px_rgba(0,0,0,0.03)] shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-lime-900 font-anton uppercase tracking-tight">Bảo mật thông tin</p>
          <p className="text-[11px] text-lime-700/70 leading-relaxed font-medium">Thông tin ngân hàng của bạn được mã hóa và bảo mật tuyệt đối. Chúng tôi chỉ sử dụng thông tin này để chuyển tiền thu nhập định kỳ cho bạn.</p>
        </div>
      </div>
    </motion.div>
  );
}

function DetailItem({ icon, label, value }: { icon: any, label: string, value?: string }) {
  return (
    <div className="bg-white rounded-[28px] p-5 border border-gray-100 flex items-center gap-4 transition-all hover:bg-slate-50 group">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-gray-400 group-hover:bg-lime-50 group-hover:text-lime-600 transition-all">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-widest">{label}</p>
        <p className="text-base font-bold text-[#1A1A1A] truncate max-w-[180px]">{value || "Chưa cập nhật"}</p>
      </div>
    </div>
  );
}
