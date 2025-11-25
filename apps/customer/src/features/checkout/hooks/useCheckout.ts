"use client";
import { useMemo, useState } from "react";
import { useCartStore } from "@repo/store";
import type { Voucher, PaymentMethod } from "@repo/types";
import { getRestaurantById, getVouchersForRestaurant } from "@/features/search/data/mockSearchData";

export function useCheckout() {
  const items = useCartStore((s) => s.items);
  const totalFromStore = useCartStore((s) => s.total());
  const activeRestaurantId = useCartStore((s) => s.activeRestaurantId);
  const restaurant = useMemo(() => activeRestaurantId ? getRestaurantById(activeRestaurantId) : undefined, [activeRestaurantId]);
  const vouchers: Voucher[] = useMemo(() => activeRestaurantId ? getVouchersForRestaurant(activeRestaurantId) : [], [activeRestaurantId]);

  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("EATZYPAY");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const selectedVoucher = useMemo(() => vouchers.find(v => v.id === selectedVoucherId) || null, [vouchers, selectedVoucherId]);

  const fee = 23000;
  const discount = useMemo(() => {
    if (!selectedVoucher) return 0;
    const now = new Date();
    if (selectedVoucher.startDate && new Date(selectedVoucher.startDate) > now) return 0;
    if (selectedVoucher.endDate && new Date(selectedVoucher.endDate) < now) return 0;
    if (typeof selectedVoucher.minOrderValue === "number" && totalFromStore < selectedVoucher.minOrderValue) return 0;
    if (selectedVoucher.discountType === "PERCENT") {
      const val = Number(selectedVoucher.discountValue || selectedVoucher.discountPercent || 0);
      return Math.floor((totalFromStore * val) / 100);
    }
    const val = Number(selectedVoucher.discountValue || selectedVoucher.discountAmount || 0);
    return val;
  }, [selectedVoucher, totalFromStore]);

  const totalPayable = useMemo(() => Math.max(0, totalFromStore + fee - discount), [totalFromStore, fee, discount]);

  return {
    items,
    restaurant,
    vouchers,
    selectedVoucherId,
    setSelectedVoucherId,
    selectedVoucher,
    paymentMethod,
    setPaymentMethod,
    address,
    setAddress,
    notes,
    setNotes,
    subtotal: totalFromStore,
    fee,
    discount,
    totalPayable,
  };
}

