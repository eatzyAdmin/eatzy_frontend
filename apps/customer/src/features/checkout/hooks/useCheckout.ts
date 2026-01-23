"use client";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Voucher, PaymentMethod } from "@repo/types";
import { useRestaurantCart } from "@/features/cart/hooks/useCart";
import { useCartStore } from "@repo/store";
import { voucherApi, restaurantDetailApi } from "@repo/api";
import { useDeliveryLocationStore } from "@/store/deliveryLocationStore";

// Voucher types - using backend values: PERCENTAGE, FIXED, FREESHIP
type DiscountVoucher = Voucher & { discountType: 'PERCENTAGE' | 'FIXED' };
type ShippingVoucher = Voucher & { discountType: 'FREESHIP' };

export function useCheckout() {
  // Get restaurantId from cart store (set when navigating to checkout)
  const activeRestaurantId = useCartStore((s) => s.activeRestaurantId);
  const restaurantId = activeRestaurantId ? Number(activeRestaurantId) : null;

  // Get delivery location from global store
  const { selectedLocation, updateAddress } = useDeliveryLocationStore();

  // Get cart for this restaurant
  const { totalPrice: subtotalFromCart, cartItems } = useRestaurantCart(restaurantId);

  // Fetch restaurant info
  const { data: restaurant } = useQuery({
    queryKey: ['restaurant-detail', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      const res = await restaurantDetailApi.getById(restaurantId);
      if (res.statusCode === 200 && res.data) {
        return res.data;
      }
      return null;
    },
    enabled: !!restaurantId,
  });

  // Fetch vouchers for restaurant
  const { data: vouchersData, isLoading: isLoadingVouchers } = useQuery({
    queryKey: ['vouchers', 'restaurant', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const res = await voucherApi.getVouchersByRestaurantId(restaurantId);
      if (res.statusCode === 200 && res.data) {
        return res.data;
      }
      return [];
    },
    enabled: !!restaurantId,
    staleTime: 60 * 1000, // 1 minute
  });

  const allVouchers = vouchersData || [];
  const subtotal = subtotalFromCart;

  // Separate vouchers by type
  // Database uses: FREESHIP for free shipping, FIXED for fixed amount discount
  const { discountVouchers, shippingVouchers } = useMemo(() => {
    const discount: DiscountVoucher[] = [];
    const shipping: ShippingVoucher[] = [];

    allVouchers.forEach(v => {
      if (v.discountType === 'FREESHIP') {
        shipping.push(v as ShippingVoucher);
      } else {
        // FIXED or PERCENT
        discount.push(v as DiscountVoucher);
      }
    });

    return { discountVouchers: discount, shippingVouchers: shipping };
  }, [allVouchers]);

  // Sort vouchers: eligible first, then ineligible
  const sortVouchersByEligibility = (vouchers: Voucher[]): Voucher[] => {
    const now = new Date();
    return [...vouchers].sort((a, b) => {
      const aEligible = isVoucherEligible(a, subtotal, now);
      const bEligible = isVoucherEligible(b, subtotal, now);
      if (aEligible && !bEligible) return -1;
      if (!aEligible && bEligible) return 1;
      return 0;
    });
  };

  const sortedDiscountVouchers = useMemo(
    () => sortVouchersByEligibility(discountVouchers),
    [discountVouchers, subtotal]
  );

  const sortedShippingVouchers = useMemo(
    () => sortVouchersByEligibility(shippingVouchers),
    [shippingVouchers, subtotal]
  );

  // Selection states - can select 1 discount + 1 shipping
  const [selectedDiscountVoucherId, setSelectedDiscountVoucherId] = useState<number | null>(null);
  const [selectedShippingVoucherId, setSelectedShippingVoucherId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("EATZYPAY");

  // Address is synced with delivery location store
  const [address, setAddressLocal] = useState<string>(selectedLocation?.address || "");
  const [notes, setNotes] = useState<string>("");

  // Sync address with delivery location store
  useEffect(() => {
    if (selectedLocation?.address) {
      setAddressLocal(selectedLocation.address);
    }
  }, [selectedLocation?.address]);

  // When address changes locally, also update the store
  const setAddress = (newAddress: string) => {
    setAddressLocal(newAddress);
    updateAddress(newAddress);
  };

  const selectedDiscountVoucher = useMemo(
    () => discountVouchers.find(v => v.id === selectedDiscountVoucherId) || null,
    [discountVouchers, selectedDiscountVoucherId]
  );

  const selectedShippingVoucher = useMemo(
    () => shippingVouchers.find(v => v.id === selectedShippingVoucherId) || null,
    [shippingVouchers, selectedShippingVoucherId]
  );

  // Calculate fees
  const baseFee = 23000; // Base delivery fee

  // Shipping discount
  const shippingDiscount = useMemo(() => {
    if (!selectedShippingVoucher) return 0;
    if (!isVoucherEligible(selectedShippingVoucher, subtotal, new Date())) return 0;
    return baseFee; // FREE_SHIPPING = full fee waived
  }, [selectedShippingVoucher, subtotal, baseFee]);

  const fee = baseFee - shippingDiscount;

  // Discount calculation
  const discount = useMemo(() => {
    if (!selectedDiscountVoucher) return 0;
    if (!isVoucherEligible(selectedDiscountVoucher, subtotal, new Date())) return 0;

    let discountAmount = 0;
    if (selectedDiscountVoucher.discountType === "PERCENTAGE") {
      const val = Number(selectedDiscountVoucher.discountValue || 0);
      discountAmount = Math.floor((subtotal * val) / 100);
      // Apply max discount cap if exists
      if (selectedDiscountVoucher.maxDiscountAmount && discountAmount > selectedDiscountVoucher.maxDiscountAmount) {
        discountAmount = selectedDiscountVoucher.maxDiscountAmount;
      }
    } else {
      // FIXED
      discountAmount = Number(selectedDiscountVoucher.discountValue || 0);
    }
    return discountAmount;
  }, [selectedDiscountVoucher, subtotal]);

  const totalPayable = useMemo(
    () => Math.max(0, subtotal + fee - discount),
    [subtotal, fee, discount]
  );

  // Identify best vouchers
  const bestVoucherIds = useMemo(() => {
    const ids = {
      discount: null as number | null,
      shipping: null as number | null,
    };

    const now = new Date();

    // 1. Find best shipping voucher (Highest maxDiscountAmount)
    let maxShippingVal = -1;
    sortedShippingVouchers.forEach(v => {
      if (!isVoucherEligible(v, subtotal, now)) return;
      const val = v.maxDiscountAmount || 0;
      if (val > maxShippingVal) {
        maxShippingVal = val;
        ids.shipping = v.id;
      }
    });

    // 2. Find best discount voucher (Highest discountAmount)
    let maxDiscountVal = -1;
    sortedDiscountVouchers.forEach(v => {
      if (!isVoucherEligible(v, subtotal, now)) return;

      let amount = 0;
      if (v.discountType === "PERCENTAGE") {
        amount = Math.floor((subtotal * (v.discountValue || 0)) / 100);
        if (v.maxDiscountAmount && amount > v.maxDiscountAmount) {
          amount = v.maxDiscountAmount;
        }
      } else {
        amount = v.discountValue || 0;
      }

      if (amount > maxDiscountVal) {
        maxDiscountVal = amount;
        ids.discount = v.id;
      }
    });

    return ids;
  }, [sortedDiscountVouchers, sortedShippingVouchers, subtotal]);

  return {
    restaurant,
    restaurantId,
    // All vouchers for display
    discountVouchers: sortedDiscountVouchers,
    shippingVouchers: sortedShippingVouchers,
    allVouchers,
    isLoadingVouchers,
    // Selected vouchers
    selectedDiscountVoucherId,
    setSelectedDiscountVoucherId,
    selectedShippingVoucherId,
    setSelectedShippingVoucherId,
    selectedDiscountVoucher,
    selectedShippingVoucher,
    // Other form fields
    paymentMethod,
    setPaymentMethod,
    address,
    setAddress,
    notes,
    setNotes,
    // Pricing
    subtotal,
    baseFee,
    shippingDiscount,
    fee,
    discount,
    totalPayable,
    bestVoucherIds,
    // Cart data for order creation
    cartItems,
    // Delivery location for order creation
    selectedLocation,
    // Helper
    isVoucherEligible: (voucher: Voucher) => isVoucherEligible(voucher, subtotal, new Date()),
  };
}

// Helper function to check voucher eligibility
function isVoucherEligible(voucher: Voucher, orderTotal: number, now: Date): boolean {
  // Check date validity
  if (voucher.startDate && new Date(voucher.startDate) > now) return false;
  if (voucher.endDate && new Date(voucher.endDate) < now) return false;
  // Check minimum order value
  if (typeof voucher.minOrderValue === 'number' && orderTotal < voucher.minOrderValue) return false;
  return true;
}
