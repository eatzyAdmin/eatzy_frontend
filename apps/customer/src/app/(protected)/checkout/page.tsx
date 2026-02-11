"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useLoading, useHoverHighlight, HoverHighlightOverlay, CheckoutShimmer, useNotification } from "@repo/ui";
import { useCheckout } from "@/features/checkout/hooks/useCheckout";
import { useCreateOrder } from "@/features/checkout/hooks/useCreateOrder";
import { useRestaurantCart } from "@/features/cart/hooks/useCart";
import { useAuth } from "@/features/auth/hooks/useAuth";
import AddressForm from "@/features/checkout/components/AddressForm";
import NotesInput from "@/features/checkout/components/NotesInput";
import PaymentMethodSelector from "@/features/checkout/components/PaymentMethodSelector";
import PromoVoucherCard from "@/features/checkout/components/PromoVoucherCard";
import { Truck, Tag, ShoppingBag } from "@repo/ui/icons";
import type { CreateOrderRequest } from "@repo/types";
const CheckoutSummary = dynamic(() => import("@/features/checkout/components/CheckoutSummary"), { ssr: false });
const RightSidebar = dynamic(() => import("@/features/checkout/components/RightSidebar"), { ssr: false });
const OrderSummaryList = dynamic(() => import("@/features/checkout/components/OrderSummaryList"), { ssr: false });
import CheckoutMapSection from "@/features/checkout/components/CheckoutMapSection";
import LocationPickerModal from "@/features/location/components/LocationPickerModal";
import PromoSelectionModal from "@/features/checkout/components/PromoSelectionModal";
import PromoSummary from "@/features/checkout/components/PromoSummary";
import { useDeliveryLocationStore } from "@/store/deliveryLocationStore";

export default function CheckoutPage() {
  const { hide } = useLoading();
  const [mounted, setMounted] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  useEffect(() => {
    hide();
    setMounted(true);
  }, [hide]);

  const {
    restaurant,
    restaurantId,
    discountVouchers,
    shippingVouchers,
    isLoadingVouchers,
    selectedDiscountVoucherId,
    setSelectedDiscountVoucherId,
    selectedShippingVoucherId,
    setSelectedShippingVoucherId,
    selectedDiscountVoucher,
    selectedShippingVoucher,
    isVoucherEligible,
    paymentMethod,
    setPaymentMethod,
    address,
    setAddress,
    notes,
    setNotes,
    subtotal,
    baseFee,
    fee,
    shippingDiscount,
    discount,
    totalPayable,
    bestVoucherIds,
    cartItems,
    selectedLocation,
    isLoadingFee,
  } = useCheckout();

  const { user } = useAuth();
  const { createOrder, isCreating } = useCreateOrder();
  const { showNotification } = useNotification();
  const { clearCart } = useRestaurantCart(restaurantId);
  const setSelectedLocation = useDeliveryLocationStore(s => s.setSelectedLocation);

  const leftColumnRef = useRef<HTMLDivElement | null>(null);
  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>("address");
  const tabs = [
    { id: "address", name: "Address" },
    { id: "notes", name: "Notes" },
    { id: "summary", name: "Summary" },
    { id: "method", name: "Method" },
    { id: "promo", name: "Promo" },
    { id: "payment", name: "Checkout" },
  ];

  const { containerRef: navContainerRef, rect: navRect, style: navStyle, moveHighlight: navMove, clearHover: navClear } = useHoverHighlight<HTMLDivElement>();

  useEffect(() => {
    const leftCol = leftColumnRef.current;
    if (!leftCol) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top));
        if (visible[0]) setActiveSection(visible[0].target.getAttribute("data-id"));
      },
      { root: leftCol, rootMargin: "-120px 0px -60% 0px", threshold: 0.2 }
    );
    ["address", "notes", "summary", "method", "promo", "payment"].forEach(id => {
      const nodeList = document.querySelectorAll(`[data-id="${id}"]`);
      nodeList.forEach(node => obs.observe(node));
    });
    return () => obs.disconnect();
  }, [mounted]);

  const scrollToSection = (id: string) => {
    // Find correctly rendered section based on data-id
    const nodes = document.querySelectorAll(`[data-id="${id}"]`);
    let node: HTMLElement | null = null;

    // Pick the one that is currently visible (to handle dual mobile/desktop layouts)
    nodes.forEach(n => {
      if ((n as HTMLElement).offsetParent !== null) {
        node = n as HTMLElement;
      }
    });

    const leftCol = leftColumnRef.current;
    if (!node || !leftCol) return;

    if (window.innerWidth < 768 && mainScrollRef.current) {
      const container = mainScrollRef.current;
      const nodeRect = (node as HTMLElement).getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offset = 80;
      container.scrollTo({
        top: container.scrollTop + (nodeRect.top - containerRect.top) - offset,
        behavior: "smooth"
      });
    } else {
      const containerRect = leftCol.getBoundingClientRect();
      const nodeRect = (node as HTMLElement).getBoundingClientRect();
      const offsetTop = nodeRect.top - containerRect.top + leftCol.scrollTop - 140;
      leftCol.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  // Build and submit order
  const handlePlaceOrder = useCallback(async () => {
    // Validation
    if (!user?.id) {
      showNotification({ message: "Vui lòng đăng nhập để đặt hàng", type: "error" });
      return;
    }
    if (!restaurantId) {
      showNotification({ message: "Không tìm thấy thông tin nhà hàng", type: "error" });
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      showNotification({ message: "Giỏ hàng trống", type: "error" });
      return;
    }
    if (!address || !selectedLocation?.latitude || !selectedLocation?.longitude) {
      showNotification({ message: "Vui lòng nhập địa chỉ giao hàng", type: "error" });
      return;
    }

    // Build order request
    const orderRequest: CreateOrderRequest = {
      customer: { id: Number(user.id) },
      restaurant: { id: restaurantId },
      deliveryAddress: address,
      deliveryLatitude: selectedLocation.latitude,
      deliveryLongitude: selectedLocation.longitude,
      specialInstructions: notes || undefined,
      deliveryFee: baseFee,
      paymentMethod: paymentMethod === "EATZYPAY" ? "WALLET" : (paymentMethod === "CASH" ? "COD" : "VNPAY"),
      orderItems: cartItems.map(item => ({
        dish: { id: item.dish.id },
        quantity: item.quantity,
        orderItemOptions: item.cartItemOptions?.map(opt => ({
          menuOption: { id: opt.menuOption.id }
        })),
      })),
      vouchers: [
        ...(selectedDiscountVoucherId ? [{ id: selectedDiscountVoucherId }] : []),
        ...(selectedShippingVoucherId ? [{ id: selectedShippingVoucherId }] : []),
      ],
    };

    const result = await createOrder(orderRequest);
    // Clear cart for this restaurant after successful order
    if (result) {
      await clearCart();
    }
  }, [
    user, restaurantId, cartItems, address, selectedLocation, notes, baseFee, fee, paymentMethod,
    selectedDiscountVoucherId, selectedShippingVoucherId, createOrder, showNotification, clearCart
  ]);

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7]">
      <div ref={mainScrollRef} className="flex-1 overflow-y-auto md:overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-3 md:px-4 pt-4 md:pr-16 md:px-8 md:pt-4 h-full">
          <div className="md:hidden mb-6">
            <div className="flex flex-col gap-1">
              <span className="px-3 py-1 rounded-full bg-lime-50/50 border border-lime-100 text-lime-600 text-[9px] font-black uppercase tracking-[0.15em] w-fit mb-2 shadow-sm shadow-lime-500/5">
                Checkout Process
              </span>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-anton text-[#1A1A1A] uppercase leading-none">Final Step</h1>
                <div className="w-[1px] h-6 bg-gray-200 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-500 truncate">{restaurant?.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-[65%_35%] gap-4 md:gap-8 md:h-full mt-4 md:mt-0">
            <div ref={leftColumnRef} className="relative h-auto md:h-full md:overflow-y-auto no-scrollbar md:pr-2 space-y-4 md:space-y-6 mb-6">
              <div className="sticky top-0 z-40 bg-[#F7F7F7] md:pt-2">
                <div ref={navContainerRef} className="relative bg-[#F7F7F7] border-b-2 border-gray-300">
                  <HoverHighlightOverlay rect={navRect} style={navStyle} />
                  <div className="overflow-x-auto no-scrollbar">
                    <div className="inline-flex items-center gap-4 md:gap-8 px-4 py-3 md:px-6 md:py-4 min-w-full justify-start relative z-10">
                      {tabs.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => scrollToSection(t.id)}
                          className={`text-lg md:text-[22px] font-bold uppercase tracking-wide transition-all relative pb-1 whitespace-nowrap ${activeSection === t.id ? "text-[#1A1A1A]" : "text-gray-400"
                            }`}
                          style={{
                            fontStretch: "condensed",
                            letterSpacing: "-0.01em",
                            fontFamily: "var(--font-anton), var(--font-sans)",
                          }}
                          onMouseEnter={(e) =>
                            navMove(e, {
                              borderRadius: 12,
                              backgroundColor: "rgba(0,0,0,0.06)",
                              opacity: 1,
                              scaleEnabled: true,
                              scale: 1.2,
                            })
                          }
                          onMouseMove={(e) =>
                            navMove(e, {
                              borderRadius: 12,
                              backgroundColor: "rgba(0,0,0,0.06)",
                              opacity: 1,
                              scaleEnabled: true,
                              scale: 1.2,
                            })
                          }
                          onMouseLeave={navClear}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 md:space-y-6 md:pb-6">
                {/* 1. Address Section */}
                <section data-id="address">
                  <AddressForm
                    value={address}
                    onChange={setAddress}
                    onClick={() => {
                      if (window.innerWidth < 768) setIsLocationModalOpen(true);
                    }}
                  />
                </section>

                {/* 2. Notes Section */}
                <section data-id="notes">
                  <NotesInput value={notes} onChange={setNotes} />
                </section>

                {/* 3. Order Summary Section */}
                <section data-id="summary">
                  {mounted && <OrderSummaryList />}
                </section>

                {/* 4. Voucher & Payment Section - DUAL LAYOUT */}

                {/* MOBILE LAYOUT */}
                <div className="md:hidden space-y-4">
                  <section data-id="promo">
                    <PromoSummary
                      selectedDiscountValue={discount}
                      selectedShippingValue={shippingDiscount}
                      hasVoucher={!!(selectedDiscountVoucherId || selectedShippingVoucherId)}
                      onClick={() => setIsPromoModalOpen(true)}
                    />
                  </section>

                  <section data-id="method">
                    <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                  </section>

                  <section data-id="payment">
                    <CheckoutSummary subtotal={subtotal} baseFee={baseFee} discount={discount} shippingDiscount={shippingDiscount} isLoadingFee={isLoadingFee} />
                  </section>
                </div>

                {/* DESKTOP LAYOUT (Original Restore) */}
                <div className="hidden md:block space-y-6">
                  <section data-id="method">
                    <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-stretch">
                    <section className="col-span-1 md:col-span-6" data-id="promo">
                      <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 h-full flex flex-col">
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                          <Tag className="w-5 h-5 text-gray-400" />
                          <h4 className="font-bold text-[#1A1A1A]">Promo & Vouchers</h4>
                        </div>

                        <div className="p-4 md:p-6 flex-1">
                          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-10 custom-scrollbar">
                            {/* Shipping Vouchers */}
                            {shippingVouchers.length > 0 && (
                              <div className="space-y-5">
                                <div className="flex items-center gap-3 px-1 sticky top-0 bg-white z-10 backdrop-blur-sm">
                                  <div className="w-10 h-10 rounded-[18px] bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm flex-shrink-0">
                                    <Truck size={20} strokeWidth={2.5} />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-[15px] font-bold text-[#1A1A1A] leading-none">
                                      Shipping Vouchers
                                    </h4>
                                  </div>
                                </div>
                                <div className="space-y-3 px-1">
                                  {mounted && [...shippingVouchers]
                                    .sort((a, b) => a.id === bestVoucherIds.shipping ? -1 : b.id === bestVoucherIds.shipping ? 1 : 0)
                                    .map((v) => {
                                      const eligible = isVoucherEligible(v);
                                      return (
                                        <PromoVoucherCard
                                          key={v.id}
                                          voucher={v}
                                          selected={selectedShippingVoucherId === v.id}
                                          onSelect={() => setSelectedShippingVoucherId(selectedShippingVoucherId === v.id ? null : v.id)}
                                          disabled={!eligible}
                                          reason={!eligible ? 'Đơn hàng chưa đủ điều kiện' : undefined}
                                          isBest={bestVoucherIds.shipping === v.id}
                                        />
                                      );
                                    })}
                                </div>
                              </div>
                            )}

                            {/* Discount Vouchers */}
                            <div className="space-y-5">
                              <div className="flex items-center gap-3 px-1 sticky top-0 bg-white z-10 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-[18px] bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm flex-shrink-0">
                                  <Tag size={20} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-[15px] font-bold text-[#1A1A1A] leading-none">
                                    Discount Vouchers
                                  </h4>
                                </div>
                              </div>
                              <div className="space-y-3 px-1">
                                {isLoadingVouchers ? (
                                  <div className="text-center py-12 text-gray-400">
                                    <div className="w-10 h-10 border-3 border-gray-100 border-t-lime-500 rounded-full animate-spin mx-auto mb-3" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Checking offers...</p>
                                  </div>
                                ) : discountVouchers.length === 0 ? (
                                  <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">No vouchers available</p>
                                  </div>
                                ) : (
                                  mounted && [...discountVouchers]
                                    .sort((a, b) => a.id === bestVoucherIds.discount ? -1 : b.id === bestVoucherIds.discount ? 1 : 0)
                                    .map((v) => {
                                      const eligible = isVoucherEligible(v);
                                      return (
                                        <PromoVoucherCard
                                          key={v.id}
                                          voucher={v}
                                          selected={selectedDiscountVoucherId === v.id}
                                          onSelect={() => setSelectedDiscountVoucherId(selectedDiscountVoucherId === v.id ? null : v.id)}
                                          disabled={!eligible}
                                          reason={!eligible ? 'Đơn hàng chưa đủ điều kiện' : undefined}
                                          isBest={bestVoucherIds.discount === v.id}
                                        />
                                      );
                                    })
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="col-span-1 md:col-span-4 h-full" data-id="payment">
                      <CheckoutSummary subtotal={subtotal} baseFee={baseFee} discount={discount} shippingDiscount={shippingDiscount} isLoadingFee={isLoadingFee} />
                    </section>
                  </div>
                </div>
              </div>
            </div>

            <RightSidebar
              restaurantName={restaurant?.name}
              totalPayable={totalPayable}
              onAddressChange={(addr) => setAddress(addr)}
              onPlaceOrder={handlePlaceOrder}
              isCreating={isCreating || isLoadingFee}
            />
          </div>
        </div>
      </div>

      {/* Modals for Mobile Experience */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc);
          setAddress(loc.address);
        }}
        initialLocation={selectedLocation ? {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude
        } : undefined}
        initialAddress={address}
      />

      <PromoSelectionModal
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        shippingVouchers={shippingVouchers}
        discountVouchers={discountVouchers}
        isVoucherEligible={isVoucherEligible}
        selectedShippingVoucherId={selectedShippingVoucherId}
        setSelectedShippingVoucherId={setSelectedShippingVoucherId}
        selectedDiscountVoucherId={selectedDiscountVoucherId}
        setSelectedDiscountVoucherId={setSelectedDiscountVoucherId}
        bestVoucherIds={bestVoucherIds}
        isLoadingVouchers={isLoadingVouchers}
      />
    </div>
  );
}
