"use client";
import { ImageWithFallback } from "@repo/ui";
import { formatVnd } from "@repo/lib";
import { useCartStore } from "@repo/store";

export default function OrderSummaryList() {
  const items = useCartStore((s) => s.items);
  return (
    <div className="p-4">
      <div className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Thông tin đơn hàng</div>
      {items.length === 0 ? (
        <div className="p-2 text-[#555]">Chưa có món nào</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {items.map((it) => (
            <li key={it.id} className="py-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full font-anton bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center font-bold text-2xl">{it.quantity}x</div>
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                  <ImageWithFallback src={it.imageUrl ?? ""} alt={it.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="text-[#1A1A1A] font-medium line-clamp-1">{it.name}</div>
                    <div className="text-[#1A1A1A] font-anton text-xl font-semibold">{formatVnd(it.price)}</div>
                  </div>
                  {Array.isArray(it.options?.groups) && it.options!.groups.length > 0 ? (
                    <div className="space-y-0.5">
                      {[...it.options!.groups]
                        .sort((a, b) => {
                          const ap = String(a.title || "").toLowerCase().startsWith("variant") ? 0 : 1;
                          const bp = String(b.title || "").toLowerCase().startsWith("variant") ? 0 : 1;
                          return ap - bp;
                        })
                        .map((g) => (
                          <div key={g.id} className="text-[#555] text-xs line-clamp-1">
                            {String(g.title || "").toLowerCase().startsWith("variant") ? "Phân loại" : g.title}: {g.options.map((o) => o.name).join(", ")}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <>
                      {it.options?.variant?.name && (
                        <div className="text-[#555] text-xs">Phân loại: {it.options.variant.name}</div>
                      )}
                      {it.options?.addons && it.options.addons.length > 0 && (
                        <div className="text-[#555] text-xs">Topping: {it.options.addons.map((a) => a.name).join(", ")}</div>
                      )}
                    </>
                  )}
                  <div className="mt-1 text-[#555] text-xs"></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
