import { FileText, CreditCard, Clock, Banknote, CheckCircle2 } from "@repo/ui/icons";
import type { OrderResponse } from "@repo/types";

export function PaymentSummary({ order }: { order: OrderResponse }) {
  return (
    <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100/50 shrink-0">
      <div className="px-6 pt-6 ob-2 border-b border-gray-50 flex items-center gap-2.5 bg-gray-50/30">
        <FileText className="w-5 h-5 text-gray-400" />
        <h4 className="font-bold text-[#1A1A1A]">Thông tin thanh toán</h4>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <CreditCard className="w-4.5 h-4.5 text-gray-300" />
            <span className="text-gray-500 font-medium">Phương thức</span>
          </div>
          <span className="font-anton font-bold text-[#1A1A1A] uppercase tracking-wide bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{order.paymentMethod}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-4.5 h-4.5 text-gray-300" />
            <span className="text-gray-500 font-medium">Đặt lúc</span>
          </div>
          <span className="font-bold text-[#1A1A1A]">{order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN", { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : "--:--"}</span>
        </div>
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-gray-400">
            <Banknote className="w-4.5 h-4.5" />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Status</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.paymentStatus === 'PAID' ? 'bg-lime-50 text-lime-600 border border-lime-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
            <CheckCircle2 className="w-3 h-3" strokeWidth={3} />
            {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
          </div>
        </div>
      </div>
    </div>
  );
}
