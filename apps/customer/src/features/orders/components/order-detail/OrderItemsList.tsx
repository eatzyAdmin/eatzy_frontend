import { Package, Ticket, CheckCircle2 } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import type { OrderResponse, OrderItemResponse } from "@repo/types";

export function OrderItemsList({ order }: { order: OrderResponse }) {
  return (
    <div className="bg-white rounded-[28px] md:rounded-[40px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100/50 shrink-0">
      <div className="px-6 md:px-8 py-4 md:py-6 md:pb-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
          <h4 className="text-lg md:text-lg text-[#1A1A1A] font-bold">Item Details</h4>
        </div>
        <span className="text-xs font-bold bg-[#1A1A1A] text-white px-3 py-1 rounded-lg">
          {order.orderItems.length} items
        </span>
      </div>

      <div className="p-1 md:p-3 pt-0 md:pt-3">
        <div className="grid grid-cols-1 md:gap-1">
          {order.orderItems.map((item: OrderItemResponse, idx: number) => (
            <div key={idx} className="group flex items-center justify-between p-3.5 md:p-4 rounded-[20px] transition-colors duration-200 hover:bg-gray-50/50">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-[14px] bg-gray-100 text-[#1A1A1A] font-anton font-bold text-lg flex items-center justify-center shadow-sm flex-shrink-0 transition-transform group-hover:scale-105">
                  {item.quantity}x
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[#1A1A1A] text-sm transition-colors line-clamp-1 leading-tight">{item.dish?.name}</div>
                  {item.orderItemOptions && item.orderItemOptions.length > 0 && (
                    <div className="mt-0.5 text-[10px] md:text-[11px] text-gray-400 font-medium line-clamp-2 leading-relaxed italic">
                      {Array.from(new Map(item.orderItemOptions.map(opt => [opt.menuOption?.id || opt.id, opt])).values())
                        .map((opt: any) => opt.menuOption?.name)
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>
              <span className="font-bold text-[#1A1A1A] text-sm tabular-nums ml-2 whitespace-nowrap">{formatVnd(item.priceAtPurchase)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-3.5 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Subtotal</span>
          <span className="font-bold text-gray-900">{formatVnd(order.subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Delivery Fee</span>
          <span className="font-bold text-gray-900">{formatVnd(order.deliveryFee)}</span>
        </div>

        {(order.discountAmount ?? 0) > 0 && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm font-bold text-red-500">
              <div className="flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" />
                <span>Promotion</span>
              </div>
              <span>-{formatVnd(order.discountAmount)}</span>
            </div>
            {order.vouchers && order.vouchers.length > 0 && (
              <div className="flex items-center gap-2 mt-0.5">
                {order.vouchers.map(v => (
                  <span key={v.id} className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-red-50 text-red-500 border border-red-100 rounded-md">{v.code}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="h-px bg-gray-200/50 my-2" />

        <div className="flex justify-between items-center pt-2">
          <span className="font-bold text-[#1A1A1A] text-base">Total Payable</span>
          <div className="flex flex-col items-end">
            <span className="font-anton text-[26px] md:text-3xl text-[var(--primary)] leading-none whitespace-nowrap">
              {formatVnd(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
