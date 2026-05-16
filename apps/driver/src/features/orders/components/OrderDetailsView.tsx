"use client";

import { motion } from "@repo/ui/motion";
import { ArrowLeft, User, List, Receipt, DollarSign } from "@repo/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@repo/api";
import type { DriverEarningsSummary } from "@repo/types";

interface OrderDetailsViewProps {
  orderId: string;
  customer?: {
    name?: string;
    phoneNumber?: string;
  };
  earnings: DriverEarningsSummary;
  paymentMethodLabel: string;
  onBack: () => void;
}

export default function OrderDetailsView({
  orderId,
  customer,
  earnings,
  paymentMethodLabel,
  onBack,
}: OrderDetailsViewProps) {
  const { data: fullOrderData, isLoading } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: async () => {
      const res = await orderApi.getOrderById(parseInt(orderId));
      return res.data;
    },
  });

  const fullOrder = fullOrderData;

  const formatVnd = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "Chưa có dữ liệu";
    return Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  return (
    <div className="flex flex-col">
      {/* Content */}
      <div className="px-6 py-5 space-y-5 overflow-y-auto no-scrollbar max-h-[75.4vh]">
        {/* Customer Card */}
        <div className="bg-gray-200/60 rounded-[32px] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#1A1A1A] shadow-sm">
              <User size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[16px] font-bold text-gray-500 tracking-tight">Customer Info</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">{customer?.name || "Khách hàng Eatzy"}</span>
            <span className="text-sm font-medium text-gray-400 tracking-tight">{customer?.phoneNumber || "Đang cập nhật số điện thoại"}</span>
          </div>
        </div>

        {/* Items Card */}
        <div className="bg-gray-200/60 rounded-[32px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#1A1A1A] shadow-sm">
                <List size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[16px] font-bold text-gray-500 tracking-tight">Danh sách món</span>
            </div>
            <span className="text-xs font-bold bg-[#1A1A1A] text-white px-3 py-1 rounded-lg">
              {fullOrder?.orderItems?.length || 0} items
            </span>
          </div>
          <div className="space-y-3">
            {isLoading ? <div className="py-2 text-center text-gray-400 text-xs font-bold italic">Đang tải...</div> :
              fullOrder?.orderItems?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[14px] bg-white/60 text-[#1A1A1A] font-anton font-bold text-lg flex items-center justify-center shadow-sm flex-shrink-0">
                      {item.quantity}x
                    </div>
                    <span className="font-bold text-[#1A1A1A] text-[14px] tracking-tight line-clamp-1">{item.dish?.name}</span>
                  </div>
                  <span className="font-bold text-[#1A1A1A] text-[14px]">{formatVnd(item.priceAtPurchase)}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Customer Payment Summary */}
        <div className="bg-gray-200/60 rounded-[32px] p-5 space-y-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#1A1A1A] shadow-sm">
              <Receipt size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[16px] font-bold text-gray-500 tracking-tight">Khách trả</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[14px]">
              <span className="text-gray-400 font-medium tracking-tight">Tạm tính:</span>
              <span className="text-[#1A1A1A] font-bold tracking-tight">{formatVnd(fullOrder?.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-gray-400 font-medium tracking-tight">Phí giao hàng:</span>
              <span className="text-[#1A1A1A] font-bold tracking-tight">{formatVnd(fullOrder?.deliveryFee || 0)}</span>
            </div>
            {(fullOrder?.discountAmount || 0) > 0 && (
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-400 font-medium tracking-tight">Khuyến mãi:</span>
                <span className="text-red-500 font-bold tracking-tight">-{formatVnd(fullOrder?.discountAmount || 0)}</span>
              </div>
            )}
          </div>
          <div className="h-px bg-gray-300/30 my-1" />
          <div className="flex justify-between items-end pt-1">
            <div className="flex flex-col">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter mb-1">Tổng thanh toán</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#1A1A1A] tracking-tighter">{formatVnd(fullOrder?.totalAmount || 0).replace("đ", "")}</span>
                <span className="text-sm font-bold text-[#1A1A1A]">đ</span>
              </div>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-wider">{paymentMethodLabel}</div>
          </div>
        </div>

        {/* Driver Earnings Card */}
        <div className="bg-lime-500/10 rounded-[32px] p-5 border border-lime-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-lime-500 flex items-center justify-center text-white shadow-sm">
              <DollarSign size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold text-lime-700 uppercase tracking-widest">Thu nhập tài xế</span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-[14px]">
              <span className="text-lime-700/60 font-medium">Hoa hồng chuyến xe:</span>
              <span className="text-lime-700 font-bold">{formatVnd(earnings.driverCommissionAmount)}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-lime-700/60 font-medium">Phí giao hàng:</span>
              <span className="text-lime-700 font-bold">{formatVnd(earnings.deliveryFee)}</span>
            </div>
          </div>
          <div className="h-px bg-lime-500/20 mb-3" />
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-lime-700 text-[10px] font-bold uppercase tracking-tighter mb-1">Thực nhận</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-lime-600 tracking-tighter">
                  {earnings.driverNetEarning !== null ? Intl.NumberFormat('vi-VN').format(earnings.driverNetEarning) : "---"}
                </span>
                <span className="text-sm font-bold text-lime-600">đ</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-2" />
      </div>
    </div>
  );
}
