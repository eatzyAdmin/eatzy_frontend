export const mockStore = {
  id: 'r1',
  name: 'Burger Prince',
  description: 'Cơm trưa sinh viên, cơm tấm sườn bì chả.',
  address: 'Canteen B4, KTX Khu B ĐHQG, Đông Hòa, Dĩ An',
  coords: { lat: 10.88371200, lng: 106.78065400 }, // Walking street
  slug: 'com-tam-b4',
  commissionRate: 10.00,
  phone: '0901234567',
  email: 'restaurant@gmail.com',
  rating: 4.50,
  reviewCount: 187,
  status: 'OPEN' as const,
  imageUrl: 'https://res.cloudinary.com/durzk8qz6/image/upload/v1769155806/restaurant/C%C6%A1m%20T%E1%BA%A5m%20B4/8b8ac8a0-f359-4713-8a0e-2a87fe7334c7.webp', // Restaurant vibe
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
    'https://res.cloudinary.com/durzk8qz6/image/upload/v1769158186/restaurant/C%C6%A1m%20T%E1%BA%A5m%20B4/b3c46c7f-81cd-49c3-aaae-8306d1e95925.jpg',
    'https://res.cloudinary.com/durzk8qz6/image/upload/v1769158257/restaurant/C%C6%A1m%20T%E1%BA%A5m%20B4/55849d72-4122-4c60-a0d0-05517661af1c.webp',
    'https://res.cloudinary.com/durzk8qz6/image/upload/v1769158286/restaurant/C%C6%A1m%20T%E1%BA%A5m%20B4/83b72d92-09b9-4093-869a-07f150a71236.jpg',
    'https://res.cloudinary.com/durzk8qz6/image/upload/v1769158303/restaurant/C%C6%A1m%20T%E1%BA%A5m%20B4/aa0f6969-a3ff-4133-8fae-74c69d48766f.jpg',
    'https://res.cloudinary.com/durzk8qz6/image/upload/v1769158335/restaurant/C%C6%A1m%20T%E1%BA%A5m%20B4/cfe5789e-93d4-4fd4-b65a-21656153150c.jpg',
    'https://res.cloudinary.com/durzk8qz6/image/upload/v1769158351/restaurant/C%C6%A1m%20T%E1%BA%A5m%20B4/3672d26e-ca95-4db5-a23a-949c98336967.jpg',
    'https://res.cloudinary.com/durzk8qz6/image/upload/v1769158368/restaurant/C%C6%A1m%20T%E1%BA%A5m%20B4/030c1e5b-db40-401b-bc71-6a8cc389c168.jpg',
    'https://res.cloudinary.com/durzk8qz6/image/upload/v1769158458/restaurant/C%C6%A1m%20T%E1%BA%A5m%20B4/41c45682-aa6e-468e-9a87-912fbaa75c00.jpg'
  ]
};
