"use client";

import { ChevronLeft, X, MapPin, Package } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import { DriverHistoryOrder } from "@repo/types";
import { DriverOrderDetailDrawerShimmer } from "@repo/ui";

interface LinkedOrderViewProps {
  order: DriverHistoryOrder | null;
  isLoading: boolean;
  onBack: () => void;
  onClose: () => void;
}

export default function LinkedOrderView({
  order,
  isLoading,
  onBack,
  onClose,
}: LinkedOrderViewProps) {
  if (isLoading || !order) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 italic">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-anton uppercase text-sm">
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        <div className="p-6 px-4">
          <DriverOrderDetailDrawerShimmer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 p-2 pr-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-all group overflow-hidden"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-bold font-anton text-gray-700 uppercase leading-none">Back</span>
        </button>

        <div className="text-center flex-1 pr-12">
          <h2 className="text-xl font-bold font-anton text-[#1A1A1A] uppercase leading-none">ORDER CONTENT</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1.5">{order.code}</p>
        </div>

        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors absolute right-6">
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto p-6 px-4 space-y-6">
        {/* Stats Row */}
        <div className="flex items-center justify-between bg-gray-900 p-5 rounded-[28px] shadow-xl shadow-black/5">
          <div className="text-center flex-1 border-r border-white/10 px-2">
            <div className="text-[9px] text-white/40 font-semibold uppercase tracking-[0.2em] mb-1">Thu nhập</div>
            <div className="text-lg font-bold text-[var(--primary)] font-anton leading-none">
              {formatVnd(order.earnings)}
            </div>
          </div>
          <div className="text-center flex-1 border-r border-white/10 px-2">
            <div className="text-[9px] text-white/40 font-semibold uppercase tracking-[0.2em] mb-1">Khoảng cách</div>
            <div className="text-lg font-bold text-white font-anton leading-none">
              {order.distance}km
            </div>
          </div>
          <div className="text-center flex-1 px-2">
            <div className="text-[9px] text-white/40 font-semibold uppercase tracking-[0.2em] mb-1">Loại đơn</div>
            <div className="text-sm font-bold text-white font-anton leading-none uppercase">
              Food
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-anton text-[#1A1A1A]">DELIVERY ROUTE</h3>
          </div>

          <div className="relative pl-3 space-y-6">
            <div className="absolute left-[17px] top-4 bottom-16 w-0.5 bg-gray-100 border-l-[2px] border-dashed border-gray-300" />

            {/* Pickup */}
            <div className="relative flex gap-5">
              <div className="relative z-10 w-3 h-3 rounded-full bg-white border-[3px] border-[var(--primary)] mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">Lấy tại</div>
                <div className="font-bold text-[#1A1A1A] text-sm truncate tracking-tight">{order.restaurantLocation?.name || "Restaurant"}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{order.restaurantLocation?.address || "Address not available"}</div>
              </div>
            </div>

            {/* Dropoff */}
            <div className="relative flex gap-5">
              <div className="relative z-10 w-3 h-3 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-sm ring-4 ring-red-50" />
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">Giao đến</div>
                <div className="font-bold text-[#1A1A1A] text-sm truncate tracking-tight">{order.customerName}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{order.deliveryLocation?.address}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-[32px] p-5 shadow-sm border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-anton text-[#1A1A1A]">ORDER INVENTORY</h3>
          </div>

          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between group">
              <div className="flex gap-4 items-center">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-anton font-bold text-[var(--primary)] text-md">
                  {item.quantity}x
                </div>
                <span className="text-sm font-bold text-[#1A1A1A] tracking-tight">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-400 font-anton">{formatVnd(item.price)}</span>
            </div>
          ))}

          <div className="h-px bg-gray-200/50 my-2" />

          <div className="space-y-2.5 pt-1">
            <div className="flex justify-between items-center text-xs font-bold tracking-wider text-gray-500">
              <span>ORDER SUBTOTAL</span>
              <span className="text-gray-600 text-sm font-bold">{formatVnd(order.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold tracking-wider text-gray-500">
              <span>SHIPPING FEE</span>
              <span className="text-gray-600 text-sm font-bold">{formatVnd(order.fee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between items-center text-xs font-bold tracking-wider text-[var(--primary)]">
                <span>DISCOUNT {order.voucherCode ? `(${order.voucherCode})` : ''}</span>
                <span className="text-sm font-bold">-{formatVnd(order.discount)}</span>
              </div>
            )}
          </div>

          <div className="h-px bg-gray-200/50 my-2" />

          <div className="flex justify-between items-center pt-1">
            <span className="text-sm font-black text-[#1A1A1A] uppercase">Total Amount</span>
            <span className="text-2xl font-bold font-anton text-[var(--primary)] drop-shadow-sm">{formatVnd(order.total)}</span>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-[#1A1A1A] rounded-[32px] p-5 shadow-2xl shadow-black/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] font-anton opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />

          <h3 className="text-xs font-black font-anton text-white/30 mb-6 uppercase tracking-[0.3em]">PAYMENT AUDIT</h3>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Gross Earnings</span>
              <span className="text-sm font-bold text-white/80">{formatVnd(order.earnings + (order.platformFee || 0))}</span>
            </div>
            <div className="flex justify-between items-center text-red-400">
              <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                System Commission
                <span className="bg-red-400/20 px-1.5 py-0.5 rounded text-[8px] border border-red-400/20">
                  {Math.round(((order.platformFee || 0) / (order.earnings + (order.platformFee || 0) || 1)) * 100)}%
                </span>
              </span>
              <span className="text-sm font-bold">-{formatVnd(order.platformFee || 0)}</span>
            </div>

            <div className="h-px bg-white/5 my-4" />

            <div className="flex justify-between items-end">
              <div>
                <span className="block text-[9px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-1">Your Net Income</span>
                <span className="text-3xl font-bold font-anton text-white leading-none">
                  {formatVnd(order.earnings)}
                </span>
              </div>

              <div className="bg-[var(--primary)] text-black px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20">
                Success
              </div>
            </div>
          </div>
        </div>

        {/* Action Info */}
        <div className="text-center pt-2 opacity-30">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">End of report</p>
        </div>
      </div>
    </div>
  );
}
