"use client";
import Image from "next/image";
import { Button } from "@repo/ui";
import Link from "next/link";
import type { MenuItem } from "@/features/menu/mockMenu";
import { useCartStore } from "@repo/store";

export default function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd?: (id: string) => void }) {
  const { addItem, activeRestaurantId, items } = useCartStore();
  const inCartQty = items.find((i) => i.id === item.id)?.quantity ?? 0;

  const handleAdd = () => {
    addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.image, restaurantId: item.restaurantId ?? 'rest-1', quantity: 1 });
    onAdd?.(item.id);
  };
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border bg-white dark:bg-neutral-900">
      <div className="w-full sm:w-28 h-40 sm:h-20 relative rounded overflow-hidden">
        <img src={item.image ?? "https://images.unsplash.com/photo-1541542684-6a084f10f2b7?auto=format&fit=crop&w=600&q=80"} alt={item.name} className="w-full h-full object-cover rounded" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold">{item.name}</h3>
          <div className="text-sm font-semibold">{item.price.toLocaleString()} đ</div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        <div className="mt-3 flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={handleAdd}>
            Thêm vào giỏ
            {inCartQty > 0 && <span className="ml-2 text-xs opacity-80">({inCartQty})</span>}
          </Button>
          <Link href={`/menu/items/${item.id}`} className="text-sm text-gray-500">Chi tiết</Link>
        </div>
        <div className="mt-2 flex gap-2 flex-wrap">
          {item.tags?.map((t) => {
            const label = t === 'chay' ? 'Chay' : t === 'spicy' ? 'Cay' : t === 'low-sugar' ? 'Ít đường' : t === 'bestseller' ? 'Best seller' : t === 'new' ? 'Mới' : t === 'chef' ? "Gợi ý đầu bếp" : t;
            const colorClass = t === 'bestseller' ? 'bg-green-50 text-green-700 border border-green-100' : t === 'chef' ? 'bg-orange-50 text-orange-700 border border-orange-100' : t === 'chay' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-700 border border-gray-200';
            return (
              <span key={t} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>{label}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
