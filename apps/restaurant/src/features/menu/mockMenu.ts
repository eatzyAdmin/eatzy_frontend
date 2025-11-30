export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  tags?: string[];
  restaurantId?: string;
};

export const menuData: MenuItem[] = [
  { id: 'm1', name: 'Gỏi cuốn tôm', description: 'Tươi ngon, sốt đặc biệt', price: 60000, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80', category: 'Khai vị', tags: ['bestseller', 'nhẹ'], restaurantId: 'rest-1' },
  { id: 'm2', name: 'Phở bò tái', description: 'Phở truyền thống, nước dùng thanh', price: 85000, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80', category: 'Món chính', tags: ['popular', 'bestseller'], restaurantId: 'rest-1' },
  { id: 'm3', name: 'Bánh flan', description: 'Món tráng miệng mềm mịn', price: 35000, image: 'https://images.unsplash.com/photo-1599785209799-7b3f6f067f41?auto=format&fit=crop&w=600&q=80', category: 'Tráng miệng', tags: ['new'], restaurantId: 'rest-1' },
  { id: 'm4', name: 'Trà đào', description: 'Tươi mát, không đường', price: 30000, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6d7d?auto=format&fit=crop&w=600&q=80', category: 'Đồ uống', tags: [], restaurantId: 'rest-1' },
  { id: 'm5', name: 'Mì xào bò', description: 'Mì giòn, bò mềm', price: 90000, image: 'https://images.unsplash.com/photo-1604908177522-0dc2f5b4b0a7?auto=format&fit=crop&w=600&q=80', category: 'Món chính', tags: ['chef'], restaurantId: 'rest-1' },
  { id: 'm6', name: 'Bún chay xào', description: 'Món chay thanh đạm', price: 70000, image: 'https://images.unsplash.com/photo-1606312612987-9bbc3b5555e8?auto=format&fit=crop&w=600&q=80', category: 'Món chính', tags: ['chay', 'popular'], restaurantId: 'rest-1' },
  { id: 'm7', name: 'Gỏi xoài cay', description: 'Gỏi tôm mix với xoài chua cay', price: 65000, image: 'https://images.unsplash.com/photo-1528723375684-2f48a2f4f27d?auto=format&fit=crop&w=600&q=80', category: 'Khai vị', tags: ['spicy'], restaurantId: 'rest-1' },
  { id: 'm8', name: 'Súp nấm', description: 'Súp nhẹ, ít đường', price: 40000, image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=600&q=80', category: 'Khai vị', tags: ['low-sugar', 'chay'], restaurantId: 'rest-1' },
  { id: 'm9', name: 'Chè sầu riêng', description: 'Ngon đậm đà, phù hợp tráng miệng', price: 45000, image: 'https://images.unsplash.com/photo-1609991775271-5b25c0aee5cb?auto=format&fit=crop&w=600&q=80', category: 'Tráng miệng', tags: ['new', 'bestseller'], restaurantId: 'rest-1' },
  { id: 'm10', name: 'Cà phê sữa đá', description: 'Đậm vị, đá mát lạnh', price: 25000, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80', category: 'Đồ uống', tags: [], restaurantId: 'rest-1' },
];
