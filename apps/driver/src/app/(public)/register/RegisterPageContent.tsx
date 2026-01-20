"use client";
import { motion } from "@repo/ui/motion";
import { useEffect } from "react";
import { useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { Bike, ShieldCheck, Clock, CheckCircle } from "@repo/ui/icons";

export default function RegisterPageContent({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  const { show, hide } = useLoading();

  const handleBack = () => { router.back(); };
  const handleSuccess = () => { document.cookie = "driver_auth=1; path=/"; router.push("/onboarding"); };
  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="w-full max-w-md bg-[#F8F9FA] rounded-[40px] overflow-hidden shadow-2xl border border-white/20"
      >
        {/* Header - Matching OrderDetailsModal */}
        <div className="bg-white px-8 py-6 border-b border-gray-100 flex flex-col items-center shadow-sm/50">
          <div className="w-20 h-20 rounded-[24px] bg-lime-100 flex items-center justify-center mb-4 shadow-sm border border-lime-200">
            <Bike className="w-10 h-10 text-[var(--primary)]" />
          </div>
          <h1 className="text-2xl font-anton font-bold text-[#1A1A1A]">ĐĂNG KÝ TÀI XẾ</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded text-mono">Eatzy Driver</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium text-gray-500">Partner App</span>
          </div>
        </div>

        {/* Content - Matching OrderDetailsModal style */}
        <div className="p-6 space-y-5">

          {/* Benefits Cards Grid - Matching OrderDetailsModal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col">
              <div className="w-10 h-10 rounded-2xl bg-lime-100 flex items-center justify-center mb-3 border border-lime-200">
                <Clock className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thời gian</h4>
              <div className="font-bold text-[#1A1A1A] mt-0.5">Linh hoạt</div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col">
              <div className="w-10 h-10 rounded-2xl bg-lime-100 flex items-center justify-center mb-3 border border-lime-200">
                <CheckCircle className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thu nhập</h4>
              <div className="font-bold text-[#1A1A1A] mt-0.5">Hấp dẫn</div>
            </div>
          </div>

          {/* Info Card - Matching OrderCard */}
          <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
              <Bike className="w-5 h-5 text-gray-400" />
              <h4 className="font-bold text-[#1A1A1A]">Quy trình đăng ký</h4>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gray-100 text-[#1A1A1A] font-anton text-sm flex items-center justify-center shadow-sm">1</div>
                <span className="font-bold text-gray-600 text-sm">Đăng ký thông tin cá nhân</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gray-100 text-[#1A1A1A] font-anton text-sm flex items-center justify-center shadow-sm">2</div>
                <span className="font-bold text-gray-600 text-sm">Xác minh giấy tờ xe</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gray-100 text-[#1A1A1A] font-anton text-sm flex items-center justify-center shadow-sm">3</div>
                <span className="font-bold text-gray-600 text-sm">Bắt đầu nhận đơn!</span>
              </div>
            </div>
          </div>

          {/* Safety Banner - Matching OrderDetailsModal */}
          <div className="bg-gradient-to-r from-lime-50 to-white border border-lime-100/50 p-4 rounded-[24px] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <p className="text-xs text-[var(--primary)] leading-relaxed font-medium">
              Thông tin của bạn được bảo mật tuyệt đối.
            </p>
          </div>

          {/* Action Buttons */}
          {isOpen && (
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full rounded-2xl h-14 font-bold text-[#1A1A1A] bg-lime-500 hover:bg-lime-400 shadow-lg shadow-lime-500/20 transition-all duration-300"
                onClick={() => { show("Đang bắt đầu đăng ký..."); handleSuccess(); }}
              >
                <span className="font-anton text-base uppercase tracking-wider">BẮT ĐẦU NGAY</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-2xl h-12 font-bold border-4 border-gray-100 hover:border-gray-200 hover:bg-gray-50/30 text-gray-500 transition-all duration-300"
                onClick={handleBack}
              >
                <span className="text-sm">Quay lại đăng nhập</span>
              </Button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
