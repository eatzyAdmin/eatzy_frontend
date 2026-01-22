"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLoading, useHoverHighlight, HoverHighlightOverlay, CheckoutShimmer } from "@repo/ui";
import { useCheckout } from "@/features/checkout/hooks/useCheckout";
import AddressForm from "@/features/checkout/components/AddressForm";
import NotesInput from "@/features/checkout/components/NotesInput";
import PaymentMethodSelector from "@/features/checkout/components/PaymentMethodSelector";
import PromoVoucherCard from "@/features/checkout/components/PromoVoucherCard";
import { Truck, Tag } from "@repo/ui/icons";
const CheckoutSummary = dynamic(() => import("@/features/checkout/components/CheckoutSummary"), { ssr: false });
const RightSidebar = dynamic(() => import("@/features/checkout/components/RightSidebar"), { ssr: false });
const OrderSummaryList = dynamic(() => import("@/features/checkout/components/OrderSummaryList"), { ssr: false });
import CheckoutMapSection from "@/features/checkout/components/CheckoutMapSection";
export default function CheckoutPage() {
  const { hide } = useLoading();
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Keep global loading active until local loading finishes
    const t = setTimeout(() => {
      setIsLoading(false);
      hide();
    }, 1500);
    return () => clearTimeout(t);
  }, [hide]);
  useEffect(() => { setMounted(true); }, []);

  const {
    restaurant,
    discountVouchers,
    shippingVouchers,
    isLoadingVouchers,
    selectedDiscountVoucherId,
    setSelectedDiscountVoucherId,
    selectedShippingVoucherId,
    setSelectedShippingVoucherId,
    isVoucherEligible,
    paymentMethod,
    setPaymentMethod,
    address,
    setAddress,
    notes,
    setNotes,
    subtotal,
    fee,
    shippingDiscount,
    discount,
    totalPayable,
    bestVoucherIds,
  } = useCheckout();

  const leftColumnRef = useRef<HTMLDivElement | null>(null);
  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
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
      const node = sectionRefs.current[id];
      if (node) obs.observe(node);
    });
    return () => obs.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const node = sectionRefs.current[id];
    const leftCol = leftColumnRef.current;
    if (!node || !leftCol) return;

    if (window.innerWidth < 768 && mainScrollRef.current) {
      const container = mainScrollRef.current;
      const nodeRect = node.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offset = 80;
      container.scrollTo({
        top: container.scrollTop + (nodeRect.top - containerRect.top) - offset,
        behavior: "smooth"
      });
    } else {
      const containerRect = leftCol.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const offsetTop = nodeRect.top - containerRect.top + leftCol.scrollTop - 140;
      leftCol.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };



  if (isLoading) {
    return <CheckoutShimmer />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7]">
      <div ref={mainScrollRef} className="flex-1 overflow-y-auto md:overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 pt-4 md:pr-16 md:px-8 md:pt-12 h-full">
          {/* Mobile Header: Last Step + Restaurant Name */}
          <div className="md:hidden">
            <div className="text-[28px] font-bold uppercase tracking-wide text-[#1A1A1A]" style={{
              fontStretch: "condensed",
              letterSpacing: "-0.01em",
              fontFamily: "var(--font-anton), var(--font-sans)",
            }}>Last Step - Checkout</div>
            {restaurant && (
              <div className="text-[14px] text-[#555] mt-0.5 font-medium">{restaurant.name}</div>
            )}
          </div>

          <div className="flex flex-col md:grid md:grid-cols-[65%_35%] gap-4 md:gap-8 md:h-full">
            <div ref={leftColumnRef} className="relative h-auto md:h-full md:overflow-y-auto no-scrollbar md:pr-2 space-y-4 md:space-y-6 mb-6">
              <div className="sticky top-0 z-40 bg-[#F7F7F7] pt-2 md:pt-2">
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
              <div className="rounded-[28px] md:mx-2 border-2 border-gray-300">
                <section className="p-4 border-b-2 border-gray-300" ref={(el) => { sectionRefs.current["address"] = el; }} data-id="address">
                  <AddressForm value={address} onChange={setAddress} />
                  <div className="md:hidden mt-5">
                    <CheckoutMapSection onAddressChange={setAddress} />
                  </div>
                </section>
                <section className="p-4 border-b-2 border-gray-300" ref={(el) => { sectionRefs.current["notes"] = el; }} data-id="notes">
                  <NotesInput value={notes} onChange={setNotes} />
                </section>
                <section className="p-4 border-b-2 border-gray-300" ref={(el) => { sectionRefs.current["summary"] = el; }} data-id="summary">
                  {mounted && <OrderSummaryList />}
                </section>
                <section className="p-4 border-b-2 border-gray-300" ref={(el) => { sectionRefs.current["method"] = el; }} data-id="method">
                  <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                </section>
                <div className="grid grid-cols-1 md:grid-cols-10 p-4 gap-4 items-stretch">
                  <section className="col-span-1 md:col-span-6 h-full" ref={(el) => { sectionRefs.current["promo"] = el; }} data-id="promo">
                    <div className="md:p-4">
                      {/* Scrollable voucher container - shows ~3.5 cards */}
                      <div className="max-h-[420px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                        {/* Shipping Vouchers */}
                        {shippingVouchers.length > 0 && (
                          <div>
                            <div className="text-[14px] font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2 sticky top-0 bg-[#F7F7F7] py-2 z-10">
                              <Truck className="w-4 h-4 text-blue-500" /> Miễn phí vận chuyển
                              <span className="text-xs text-gray-400 font-normal">({shippingVouchers.length})</span>
                            </div>
                            <div className="space-y-3">
                              {mounted && shippingVouchers.map((v) => {
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
                        <div>
                          <div className="text-[14px] font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2 sticky top-0 bg-[#F7F7F7] py-2 z-10">
                            <Tag className="w-4 h-4 text-[var(--primary)]" /> Ưu đãi giảm giá
                            <span className="text-xs text-gray-400 font-normal">({discountVouchers.length})</span>
                          </div>
                          <div className="space-y-3">
                            {isLoadingVouchers ? (
                              <div className="text-center py-8 text-gray-400">
                                <div className="w-8 h-8 border-2 border-gray-300 border-t-[var(--primary)] rounded-full animate-spin mx-auto mb-2"></div>
                                Đang tải ưu đãi...
                              </div>
                            ) : discountVouchers.length === 0 ? (
                              <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                Không có ưu đãi nào
                              </div>
                            ) : (
                              mounted && discountVouchers.map((v) => {
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
                  </section>
                  <section ref={(el) => { sectionRefs.current["payment"] = el; }} data-id="payment" className="md:p-4 col-span-1 md:col-span-4 h-full">
                    <div className="h-full">
                      <CheckoutSummary subtotal={subtotal} fee={fee} discount={discount} shippingDiscount={shippingDiscount} />
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <RightSidebar restaurantName={restaurant?.name} totalPayable={totalPayable} onAddressChange={(addr) => setAddress(addr)} />
          </div>
        </div>
      </div>
    </div>
  );
}
