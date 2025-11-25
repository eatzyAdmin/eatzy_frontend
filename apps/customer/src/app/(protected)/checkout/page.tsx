"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLoading, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { useCheckout } from "@/features/checkout/hooks/useCheckout";
import AddressForm from "@/features/checkout/components/AddressForm";
import NotesInput from "@/features/checkout/components/NotesInput";
import PaymentMethodSelector from "@/features/checkout/components/PaymentMethodSelector";
import PromoVoucherCard from "@/features/checkout/components/PromoVoucherCard";
const CheckoutSummary = dynamic(() => import("@/features/checkout/components/CheckoutSummary"), { ssr: false });
const RightSidebar = dynamic(() => import("@/features/checkout/components/RightSidebar"), { ssr: false });
const OrderSummaryList = dynamic(() => import("@/features/checkout/components/OrderSummaryList"), { ssr: false });

export default function CheckoutPage() {
  const { hide } = useLoading();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);
  useEffect(() => { setMounted(true); }, []);

  const {
    restaurant,
    vouchers,
    selectedVoucherId,
    setSelectedVoucherId,
    paymentMethod,
    setPaymentMethod,
    address,
    setAddress,
    notes,
    setNotes,
    subtotal,
    fee,
    discount,
    totalPayable,
  } = useCheckout();

  const leftColumnRef = useRef<HTMLDivElement | null>(null);
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
        const visible = entries.filter(e => e.isIntersecting).sort((a,b) => (a.boundingClientRect.top - b.boundingClientRect.top));
        if (visible[0]) setActiveSection(visible[0].target.getAttribute("data-id"));
      },
      { root: leftCol, rootMargin: "-120px 0px -60% 0px", threshold: 0.2 }
    );
    ["address","notes","summary","method","promo","payment"].forEach(id => {
      const node = sectionRefs.current[id];
      if (node) obs.observe(node);
    });
    return () => obs.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const node = sectionRefs.current[id];
    const leftCol = leftColumnRef.current;
    if (!node || !leftCol) return;
    const containerRect = leftCol.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const offsetTop = nodeRect.top - containerRect.top + leftCol.scrollTop - 140;
    leftCol.scrollTo({ top: offsetTop, behavior: "smooth" });
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7]">
      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1400px] mx-auto pr-16 px-8 pt-12 h-full">
          <div className="grid grid-cols-[65%_35%] gap-8 h-full">
            <div ref={leftColumnRef} className="relative overflow-y-auto no-scrollbar pr-2 space-y-6 mb-6">
              <div className="sticky top-0 z-40 bg-[#F7F7F7] pt-2">
                <div ref={navContainerRef} className="relative bg-[#F7F7F7] border-b-2 border-gray-300">
                  <HoverHighlightOverlay rect={navRect} style={navStyle} />
                  <div className="overflow-x-auto no-scrollbar">
                    <div className="inline-flex items-center gap-8 px-6 py-4 min-w-full justify-start relative z-10">
                      {tabs.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => scrollToSection(t.id)}
                          className={`text-[22px] font-bold uppercase tracking-wide transition-all relative pb-1 whitespace-nowrap ${
                            activeSection === t.id ? "text-[#1A1A1A]" : "text-gray-400"
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
              <div className="rounded-[28px] mx-2 border-2 border-gray-300">
                <section className="p-4 border-b-2 border-gray-300" ref={(el) => { sectionRefs.current["address"] = el; }} data-id="address">
                  <AddressForm value={address} onChange={setAddress} />
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
                <div className="grid grid-cols-10 p-4 gap-4 items-stretch">
                  <section className="col-span-6 h-full" ref={(el) => { sectionRefs.current["promo"] = el; }} data-id="promo">
                    <div className="p-4">
                      <div className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Ưu đãi</div>
                      <div className="space-y-3">
                        {mounted && vouchers.map((v) => (
                          <PromoVoucherCard
                            key={v.id}
                            voucher={v}
                            selected={selectedVoucherId === v.id}
                            onSelect={() => setSelectedVoucherId(selectedVoucherId === v.id ? null : v.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                  <section ref={(el) => { sectionRefs.current["payment"] = el; }} data-id="payment" className="p-4 col-span-4 h-full">
                    <div className="h-full">
                      <CheckoutSummary subtotal={subtotal} fee={fee} discount={discount} />
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <RightSidebar restaurantName={restaurant?.name} totalPayable={totalPayable} />
          </div>
        </div>
      </div>
    </div>
  );
}
