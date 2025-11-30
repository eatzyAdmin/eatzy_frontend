import React from 'react';
import Image from 'next/image';
import { menuData } from '@/features/menu/mockMenu';
import { Button } from '@repo/ui';
import { useCartStore } from '@repo/store';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export default function MenuItemDetail({ params }: Props) {
  const item = menuData.find((m) => m.id === params.id);
  if (!item) return <div className="p-6">Món không tồn tại</div>;
  const { addItem } = useCartStore();

  const handleAdd = () => {
    addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.image, restaurantId: item.restaurantId ?? 'rest-1', quantity: 1 });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="w-full h-80 relative rounded overflow-hidden">
          <img src={item.image ?? ''} alt={item.name} className="w-full h-full object-cover rounded" />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
          <div className="text-lg font-semibold mb-4">{item.price.toLocaleString()} đ</div>
          <p className="mb-4 text-gray-600">{item.description}</p>
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={handleAdd}>Thêm vào giỏ</Button>
            <Button variant="ghost">Chia sẻ</Button>
            <Link href="/menu" className="text-sm text-gray-500">Quay lại</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
