export const mockStore = {
  id: 'r1',
  name: 'Burger Prince',
  description: 'Nhà hàng burger ngon nhất thành phố với công thức sốt bí truyền. Cam kết nguyên liệu tươi sạch mỗi ngày. Không gian thoáng đãng, phục vụ chuyên nghiệp.',
  address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  coords: { lat: 10.776, lng: 106.700 }, // Walking street
  slug: 'burger-prince-hcm',
  commissionRate: 12.5,
  phone: '0909 123 456',
  email: 'contact@burgerprince.com',
  rating: 4.8,
  reviewCount: 1205,
  status: 'OPEN' as const,
  imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop', // Restaurant vibe
  categories: [
    { id: 'c1', name: 'Burger' },
    { id: 'c2', name: 'Fast Food' },
    { id: 'c3', name: 'American' }
  ],
  openingHours: [
    { day: 'Thứ 2', isOpen: true, shifts: [{ open: '08:00', close: '22:00' }] },
    { day: 'Thứ 3', isOpen: true, shifts: [{ open: '08:00', close: '14:00' }, { open: '16:00', close: '22:00' }] },
    { day: 'Thứ 4', isOpen: true, shifts: [{ open: '08:00', close: '22:00' }] },
    { day: 'Thứ 5', isOpen: true, shifts: [{ open: '08:00', close: '22:00' }] },
    { day: 'Thứ 6', isOpen: true, shifts: [{ open: '08:00', close: '23:00' }] },
    { day: 'Thứ 7', isOpen: true, shifts: [{ open: '09:00', close: '23:00' }] },
    { day: 'Chủ Nhật', isOpen: false, shifts: [] },
  ],
  images: [
    'https://images.unsplash.com/photo-1550547660-d9450f859349',
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    'https://images.unsplash.com/photo-1513639776629-7b611594e29b',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
  ]
};
