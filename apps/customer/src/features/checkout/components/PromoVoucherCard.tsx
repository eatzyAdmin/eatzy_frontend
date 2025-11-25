"use client";
import type { Voucher } from "@repo/types";
import { Tag, Percent } from "@repo/ui/icons";

export default function PromoVoucherCard({ voucher, selected, onSelect }: { voucher: Voucher; selected: boolean; onSelect: () => void }) {
  const expiryText = voucher.endDate ? new Date(voucher.endDate).toLocaleDateString('vi-VN') : undefined;
  const minText = typeof voucher.minOrderValue === 'number' ? `Đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(voucher.minOrderValue)}đ` : undefined;
  const title = voucher.title ?? (voucher.discountType === 'PERCENT' && typeof voucher.discountValue === 'number'
    ? `Giảm ${voucher.discountValue}%, thêm nhiều ưu đãi`
    : voucher.discountType === 'AMOUNT' && typeof voucher.discountValue === 'number'
      ? `Giảm ${new Intl.NumberFormat('vi-VN').format(voucher.discountValue)}K, thêm nhiều ưu đãi`.replace('000K','K')
      : voucher.description ?? 'Ưu đãi');

  return (
    <div className={`relative bg-white rounded-[18px] p-5 border-2 border-dashed ${selected ? 'border-[var(--primary)]' : 'border-[var(--primary)]/40'} shadow-sm flex items-center gap-3 cursor-pointer transition-all hover:shadow-md`} onClick={onSelect} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}>
      <div className={`w-10 h-10 rounded-xl ${voucher.discountType === 'PERCENT' ? 'bg-[var(--secondary)]' : 'bg-[var(--primary)]'} text-white flex items-center justify-center flex-shrink-0`}>
        {voucher.discountType === 'PERCENT' ? <Percent className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[#1A1A1A] text-[13px] line-clamp-1">{title}</div>
        <div className="text-[12px] text-[#555] mt-0.5 line-clamp-2">
          {minText && <span>{minText}</span>}
          {expiryText && <span className="ml-3">HSD: {expiryText}</span>}
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onSelect(); }} className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 ${selected ? 'border-[var(--primary)] bg-white' : 'border-gray-300 bg-white'}`}>
        <div className={`w-3 h-3 rounded-full transition-all duration-200 ${selected ? 'bg-[var(--primary)]' : 'bg-transparent'}`} />
      </button>
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F7F7F7] rounded-full border border-[var(--primary)]/40" />
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F7F7F7] rounded-full border border-[var(--primary)]/40" />
    </div>
  );
}
