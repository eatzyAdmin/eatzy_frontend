import { ShieldCheck } from "@repo/ui/icons";

export function SafetyDisclaimer() {
  return (
    <div className="bg-gradient-to-r from-lime-50 to-white border border-lime-100/50 p-4 rounded-[24px] flex items-center gap-3 shadow-[0_4px_15px_rgba(0,0,0,0.02)] shrink-0">
      <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
        <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
      </div>
      <p className="text-xs text-[var(--primary)] leading-relaxed font-medium">
        Đơn hàng được bảo vệ bởi <span className="font-bold">Eatzy Guarantee</span>.{" "}
        <span className="font-bold cursor-pointer hover:underline">Tìm hiểu thêm</span>
      </p>
    </div>
  );
}
