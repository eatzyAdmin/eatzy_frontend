"use client";
import { formatVnd } from "@repo/lib";
import { motion } from "@repo/ui/motion";
import { Banknote, Loader2 } from "@repo/ui/icons";

export default function CheckoutSummary({
  subtotal,
  baseFee,
  discount,
  shippingDiscount = 0,
  isLoadingFee = false
}: {
  subtotal: number;
  baseFee: number;
  discount: number;
  shippingDiscount?: number;
  isLoadingFee?: boolean;
}) {
  return (
    <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 h-full flex flex-col">
      <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
        <Banknote className="w-5 h-5 text-gray-400" />
        <h4 className="font-bold text-[#1A1A1A]">Payment Details</h4>
      </div>

      <div className="p-6 space-y-4 flex-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Subtotal</span>
          <span className="font-bold text-gray-900">{formatVnd(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Delivery Fee</span>
          <div className="text-right">
            {isLoadingFee ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : (
              <span className="font-bold text-gray-900">{formatVnd(baseFee)}</span>
            )}
          </div>
        </div>

        {shippingDiscount > 0 && (
          <div className="flex justify-between items-center text-sm animate-in fade-in slide-in-from-right-2">
            <span className="text-gray-500 font-medium">Shipping Discount</span>
            <span className="font-bold text-[var(--danger)]">-{formatVnd(shippingDiscount)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between items-center text-sm animate-in fade-in slide-in-from-right-2">
            <span className="text-gray-500 font-medium">Order Discount</span>
            <span className="font-bold text-[var(--danger)]">-{formatVnd(discount)}</span>
          </div>
        )}

        <div className="h-px bg-gray-100 my-2" />

        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="font-bold text-[#1A1A1A] text-base">Total Amount</span>
          <div className="flex flex-col items-end">
            <span className="font-anton text-3xl text-[var(--primary)]">
              {isLoadingFee ? (
                <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-lg" />
              ) : (
                formatVnd(Math.max(0, subtotal + (baseFee - shippingDiscount) - discount))
              )}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">VAT Included</span>
          </div>
        </div>
      </div>
    </div>
  );
}
