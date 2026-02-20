import { AlertTriangle } from "@repo/ui/icons";

export function CancellationAlert({ reason }: { reason?: string }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-[40px] p-6 flex items-start gap-5 shadow-[0_4px_25px_rgba(239,68,68,0.06)] shrink-0">
      <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <div>
        <h4 className="font-anton text-lg text-red-700 uppercase tracking-tight">ĐƠN HÀNG ĐÃ HỦY</h4>
        <p className="text-sm text-red-600/80 font-medium mt-1 leading-relaxed">
          Lý do: <span className="font-bold">{reason || "Không có lý do cụ thể"}</span>
        </p>
      </div>
    </div>
  );
}
