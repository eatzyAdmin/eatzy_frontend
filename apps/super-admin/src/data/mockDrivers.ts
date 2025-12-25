import type { Driver } from '@repo/types';

/**
 * Mock driver data for Eatzy Super Admin
 * Each driver is manually defined with realistic data
 */
export const mockDrivers: Driver[] = [
  {
    id: 1,
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@driver.eatzy.com',
    phone: '0901234567',
    idNumber: '079201234567',
    dateOfBirth: '15/03/1990',
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    registrationDate: '01/01/2023',
    status: 'active',
    vehicleType: 'Honda Wave Alpha',
    licensePlate: '59A-12345',
    rating: 4.8,
    totalTrips: 1234,
    totalEarnings: 45600000,
    profilePhoto: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 2,
    fullName: 'Trần Văn Bình',
    email: 'tranvanbinh@driver.eatzy.com',
    phone: '0912345678',
    idNumber: '079201234568',
    dateOfBirth: '22/07/1985',
    address: '456 Lê Lợi, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '15/01/2023',
    status: 'active',
    vehicleType: 'Yamaha Sirius',
    licensePlate: '59B-67890',
    rating: 4.9,
    totalTrips: 2156,
    totalEarnings: 72400000,
    profilePhoto: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 3,
    fullName: 'Lê Thị Cẩm',
    email: 'lethicam@driver.eatzy.com',
    phone: '0923456789',
    idNumber: '079201234569',
    dateOfBirth: '10/12/1992',
    address: '789 Võ Văn Kiệt, Quận 5, TP. Hồ Chí Minh',
    registrationDate: '01/02/2023',
    status: 'disabled',
    vehicleType: 'Honda SH Mode',
    licensePlate: '51C-11111',
    rating: 4.3,
    totalTrips: 456,
    totalEarnings: 12300000,
    profilePhoto: 'https://i.pravatar.cc/150?img=23'
  },
  {
    id: 4,
    fullName: 'Phạm Văn Dũng',
    email: 'phamvandung@driver.eatzy.com',
    phone: '0934567890',
    idNumber: '079201234570',
    dateOfBirth: '05/05/1988',
    address: '321 Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh',
    registrationDate: '10/02/2023',
    status: 'active',
    vehicleType: 'Honda Air Blade',
    licensePlate: '59D-22222',
    rating: 4.7,
    totalTrips: 1789,
    totalEarnings: 58900000,
    profilePhoto: 'https://i.pravatar.cc/150?img=14'
  },
  {
    id: 5,
    fullName: 'Hoàng Thị Em',
    email: 'hoangthiem@driver.eatzy.com',
    phone: '0945678901',
    idNumber: '079201234571',
    dateOfBirth: '18/09/1995',
    address: '654 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh',
    registrationDate: '01/03/2023',
    status: 'active',
    vehicleType: 'Yamaha Exciter',
    licensePlate: '59E-33333',
    rating: 4.6,
    totalTrips: 987,
    totalEarnings: 32100000,
    profilePhoto: 'https://i.pravatar.cc/150?img=24'
  },
  {
    id: 6,
    fullName: 'Ngô Văn Phước',
    email: 'ngovanphuoc@driver.eatzy.com',
    phone: '0956789012',
    idNumber: '079201234572',
    dateOfBirth: '28/11/1991',
    address: '987 Hùng Vương, Quận 5, TP. Hồ Chí Minh',
    registrationDate: '15/03/2023',
    status: 'active',
    vehicleType: 'Honda Vision',
    licensePlate: '51F-44444',
    rating: 4.5,
    totalTrips: 1345,
    totalEarnings: 43200000,
    profilePhoto: 'https://i.pravatar.cc/150?img=13'
  },
  {
    id: 7,
    fullName: 'Đặng Thị Giang',
    email: 'dangthigiang@driver.eatzy.com',
    phone: '0967890123',
    idNumber: '079201234573',
    dateOfBirth: '14/02/1987',
    address: '147 Phan Xích Long, Quận Phú Nhuận, TP. Hồ Chí Minh',
    registrationDate: '01/04/2023',
    status: 'disabled',
    vehicleType: 'Yamaha Janus',
    licensePlate: '59G-55555',
    rating: 4.1,
    totalTrips: 234,
    totalEarnings: 7800000,
    profilePhoto: 'https://i.pravatar.cc/150?img=25'
  },
  {
    id: 8,
    fullName: 'Bùi Văn Hải',
    email: 'buivanhai@driver.eatzy.com',
    phone: '0978901234',
    idNumber: '079201234574',
    dateOfBirth: '07/06/1993',
    address: '258 Cách Mạng Tháng Tám, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '20/04/2023',
    status: 'active',
    vehicleType: 'Honda Lead',
    licensePlate: '59H-66666',
    rating: 4.8,
    totalTrips: 1567,
    totalEarnings: 51200000,
    profilePhoto: 'https://i.pravatar.cc/150?img=15'
  },
  {
    id: 9,
    fullName: 'Võ Thị Ích',
    email: 'vothiich@driver.eatzy.com',
    phone: '0989012345',
    idNumber: '079201234575',
    dateOfBirth: '30/08/1989',
    address: '369 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
    registrationDate: '01/05/2023',
    status: 'active',
    vehicleType: 'Honda PCX',
    licensePlate: '51I-77777',
    rating: 4.9,
    totalTrips: 2234,
    totalEarnings: 78900000,
    profilePhoto: 'https://i.pravatar.cc/150?img=26'
  },
  {
    id: 10,
    fullName: 'Trịnh Văn Khoa',
    email: 'trinhvankhoa@driver.eatzy.com',
    phone: '0990123456',
    idNumber: '079201234576',
    dateOfBirth: '12/04/1994',
    address: '741 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh',
    registrationDate: '15/05/2023',
    status: 'active',
    vehicleType: 'Yamaha Grande',
    licensePlate: '59K-88888',
    rating: 4.7,
    totalTrips: 1432,
    totalEarnings: 46800000,
    profilePhoto: 'https://i.pravatar.cc/150?img=16'
  },
  {
    id: 11,
    fullName: 'Mai Thị Linh',
    email: 'maithilinh@driver.eatzy.com',
    phone: '0901234568',
    idNumber: '079201234577',
    dateOfBirth: '25/01/1986',
    address: '852 Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP. Hồ Chí Minh',
    registrationDate: '01/06/2023',
    status: 'disabled',
    vehicleType: 'Honda SH 125',
    licensePlate: '51L-99999',
    rating: 4.0,
    totalTrips: 178,
    totalEarnings: 5600000,
    profilePhoto: 'https://i.pravatar.cc/150?img=27'
  },
  {
    id: 12,
    fullName: 'Phan Văn Minh',
    email: 'phanvanminh@driver.eatzy.com',
    phone: '0912345679',
    idNumber: '079201234578',
    dateOfBirth: '03/10/1992',
    address: '963 Hoàng Văn Thụ, Quận Tân Bình, TP. Hồ Chí Minh',
    registrationDate: '20/06/2023',
    status: 'active',
    vehicleType: 'Yamaha NVX',
    licensePlate: '59M-10101',
    rating: 4.8,
    totalTrips: 1890,
    totalEarnings: 62400000,
    profilePhoto: 'https://i.pravatar.cc/150?img=17'
  },
  {
    id: 13,
    fullName: 'Lý Thị Nga',
    email: 'lythinga@driver.eatzy.com',
    phone: '0923456780',
    idNumber: '079201234579',
    dateOfBirth: '16/07/1990',
    address: '159 Nam Kỳ Khởi Nghĩa, Quận 1, TP. Hồ Chí Minh',
    registrationDate: '01/07/2023',
    status: 'active',
    vehicleType: 'Honda Click',
    licensePlate: '59N-12121',
    rating: 4.6,
    totalTrips: 1123,
    totalEarnings: 36900000,
    profilePhoto: 'https://i.pravatar.cc/150?img=28'
  },
  {
    id: 14,
    fullName: 'Dương Văn Oai',
    email: 'duongvanoai@driver.eatzy.com',
    phone: '0934567891',
    idNumber: '079201234580',
    dateOfBirth: '21/03/1988',
    address: '357 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '15/07/2023',
    status: 'active',
    vehicleType: 'Honda Winner X',
    licensePlate: '51O-13131',
    rating: 4.9,
    totalTrips: 2456,
    totalEarnings: 85600000,
    profilePhoto: 'https://i.pravatar.cc/150?img=18'
  },
  {
    id: 15,
    fullName: 'Hồ Thị Phương',
    email: 'hothiphuong@driver.eatzy.com',
    phone: '0945678902',
    idNumber: '079201234581',
    dateOfBirth: '09/12/1991',
    address: '246 Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '01/08/2023',
    status: 'active',
    vehicleType: 'Yamaha FreeGo',
    licensePlate: '59P-14141',
    rating: 4.7,
    totalTrips: 1678,
    totalEarnings: 55400000,
    profilePhoto: 'https://i.pravatar.cc/150?img=29'
  },
  {
    id: 16,
    fullName: 'Tô Văn Quang',
    email: 'tovanquang@driver.eatzy.com',
    phone: '0956789013',
    idNumber: '079201234582',
    dateOfBirth: '02/05/1993',
    address: '135 Pasteur, Quận 1, TP. Hồ Chí Minh',
    registrationDate: '20/08/2023',
    status: 'active',
    vehicleType: 'Honda SH 150',
    licensePlate: '51Q-15151',
    rating: 4.8,
    totalTrips: 1945,
    totalEarnings: 67800000,
    profilePhoto: 'https://i.pravatar.cc/150?img=19'
  },
  {
    id: 17,
    fullName: 'Đỗ Thị Rạng',
    email: 'dothirang@driver.eatzy.com',
    phone: '0967890124',
    idNumber: '079201234583',
    dateOfBirth: '19/08/1989',
    address: '468 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '01/09/2023',
    status: 'disabled',
    vehicleType: 'Yamaha Latte',
    licensePlate: '59R-16161',
    rating: 4.2,
    totalTrips: 312,
    totalEarnings: 9800000,
    profilePhoto: 'https://i.pravatar.cc/150?img=30'
  },
  {
    id: 18,
    fullName: 'Lưu Văn Sơn',
    email: 'luuvanson@driver.eatzy.com',
    phone: '0978901235',
    idNumber: '079201234584',
    dateOfBirth: '11/11/1994',
    address: '579 Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '15/09/2023',
    status: 'active',
    vehicleType: 'Honda Vario',
    licensePlate: '59S-17171',
    rating: 4.6,
    totalTrips: 1234,
    totalEarnings: 40700000,
    profilePhoto: 'https://i.pravatar.cc/150?img=20'
  },
  {
    id: 19,
    fullName: 'Cao Thị Tâm',
    email: 'caothitam@driver.eatzy.com',
    phone: '0989012346',
    idNumber: '079201234585',
    dateOfBirth: '26/06/1987',
    address: '680 Trường Chinh, Quận Tân Bình, TP. Hồ Chí Minh',
    registrationDate: '01/10/2023',
    status: 'active',
    vehicleType: 'Yamaha Jupiter',
    licensePlate: '51T-18181',
    rating: 4.7,
    totalTrips: 1567,
    totalEarnings: 52300000,
    profilePhoto: 'https://i.pravatar.cc/150?img=31'
  },
  {
    id: 20,
    fullName: 'Vũ Văn Uy',
    email: 'vuvanuy@driver.eatzy.com',
    phone: '0990123457',
    idNumber: '079201234586',
    dateOfBirth: '08/09/1992',
    address: '791 Lạc Long Quân, Quận 11, TP. Hồ Chí Minh',
    registrationDate: '20/10/2023',
    status: 'active',
    vehicleType: 'Honda CBR150',
    licensePlate: '59U-19191',
    rating: 4.9,
    totalTrips: 2134,
    totalEarnings: 74500000,
    profilePhoto: 'https://i.pravatar.cc/150?img=21'
  }
];

/**
 * Get driver by ID
 */
export function getDriverById(id: number): Driver | undefined {
  return mockDrivers.find((driver) => driver.id === id);
}

/**
 * Get drivers by status
 */
export function getDriversByStatus(status: Driver['status']): Driver[] {
  return mockDrivers.filter((driver) => driver.status === status);
}

/**
 * Get active drivers
 */
export function getActiveDrivers(): Driver[] {
  return getDriversByStatus('active');
}

/**
 * Get disabled drivers
 */
export function getDisabledDrivers(): Driver[] {
  return getDriversByStatus('disabled');
}
