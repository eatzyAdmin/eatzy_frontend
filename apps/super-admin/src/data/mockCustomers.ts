import type { Customer } from '@repo/types';

/**
 * Mock customer data for Eatzy Super Admin
 * Each customer is manually defined with realistic data
 */
export const mockCustomers: Customer[] = [
  {
    id: 1,
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '0901234567',
    idNumber: '079201234567',
    dateOfBirth: '15/03/1990',
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    registrationDate: '01/01/2024',
    status: 'active',
    totalOrders: 25,
    totalSpent: 3500000
  },
  {
    id: 2,
    fullName: 'Trần Thị Bình',
    email: 'tranthibinh@email.com',
    phone: '0912345678',
    idNumber: '079201234568',
    dateOfBirth: '22/07/1985',
    address: '456 Lê Lợi, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '05/01/2024',
    status: 'active',
    totalOrders: 18,
    totalSpent: 2800000
  },
  {
    id: 3,
    fullName: 'Lê Văn Cường',
    email: 'levancuong@email.com',
    phone: '0923456789',
    idNumber: '079201234569',
    dateOfBirth: '10/12/1992',
    address: '789 Võ Văn Kiệt, Quận 5, TP. Hồ Chí Minh',
    registrationDate: '10/01/2024',
    status: 'disabled',
    totalOrders: 5,
    totalSpent: 450000
  },
  {
    id: 4,
    fullName: 'Phạm Thị Dung',
    email: 'phamthidung@email.com',
    phone: '0934567890',
    idNumber: '079201234570',
    dateOfBirth: '05/05/1988',
    address: '321 Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh',
    registrationDate: '12/01/2024',
    status: 'active',
    totalOrders: 32,
    totalSpent: 4200000
  },
  {
    id: 5,
    fullName: 'Hoàng Văn Em',
    email: 'hoangvanem@email.com',
    phone: '0945678901',
    idNumber: '079201234571',
    dateOfBirth: '18/09/1995',
    address: '654 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh',
    registrationDate: '15/01/2024',
    status: 'active',
    totalOrders: 12,
    totalSpent: 1800000
  },
  {
    id: 6,
    fullName: 'Ngô Thị Gấm',
    email: 'ngothigam@email.com',
    phone: '0956789012',
    idNumber: '079201234572',
    dateOfBirth: '28/11/1991',
    address: '987 Hùng Vương, Quận 5, TP. Hồ Chí Minh',
    registrationDate: '18/01/2024',
    status: 'disabled',
    totalOrders: 3,
    totalSpent: 250000
  },
  {
    id: 7,
    fullName: 'Đặng Văn Hùng',
    email: 'dangvanhung@email.com',
    phone: '0967890123',
    idNumber: '079201234573',
    dateOfBirth: '14/02/1987',
    address: '147 Phan Xích Long, Quận Phú Nhuận, TP. Hồ Chí Minh',
    registrationDate: '20/01/2024',
    status: 'active',
    totalOrders: 28,
    totalSpent: 3900000
  },
  {
    id: 8,
    fullName: 'Bùi Thị Lan',
    email: 'buithilan@email.com',
    phone: '0978901234',
    idNumber: '079201234574',
    dateOfBirth: '07/06/1993',
    address: '258 Cách Mạng Tháng Tám, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '22/01/2024',
    status: 'active',
    totalOrders: 15,
    totalSpent: 2100000
  },
  {
    id: 9,
    fullName: 'Võ Văn Ích',
    email: 'vovanich@email.com',
    phone: '0989012345',
    idNumber: '079201234575',
    dateOfBirth: '30/08/1989',
    address: '369 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh',
    registrationDate: '25/01/2024',
    status: 'active',
    totalOrders: 21,
    totalSpent: 2950000
  },
  {
    id: 10,
    fullName: 'Trịnh Thị Kim',
    email: 'trinhthikim@email.com',
    phone: '0990123456',
    idNumber: '079201234576',
    dateOfBirth: '12/04/1994',
    address: '741 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh',
    registrationDate: '28/01/2024',
    status: 'disabled',
    totalOrders: 2,
    totalSpent: 180000
  },
  {
    id: 11,
    fullName: 'Mai Văn Long',
    email: 'maivanlong@email.com',
    phone: '0901234568',
    idNumber: '079201234577',
    dateOfBirth: '25/01/1986',
    address: '852 Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP. Hồ Chí Minh',
    registrationDate: '01/02/2024',
    status: 'active',
    totalOrders: 36,
    totalSpent: 4800000
  },
  {
    id: 12,
    fullName: 'Phan Thị Mai',
    email: 'phanthimai@email.com',
    phone: '0912345679',
    idNumber: '079201234578',
    dateOfBirth: '03/10/1992',
    address: '963 Hoàng Văn Thụ, Quận Tân Bình, TP. Hồ Chí Minh',
    registrationDate: '03/02/2024',
    status: 'active',
    totalOrders: 19,
    totalSpent: 2650000
  },
  {
    id: 13,
    fullName: 'Lý Văn Nam',
    email: 'lyvannam@email.com',
    phone: '0923456780',
    idNumber: '079201234579',
    dateOfBirth: '16/07/1990',
    address: '159 Nam Kỳ Khởi Nghĩa, Quận 1, TP. Hồ Chí Minh',
    registrationDate: '05/02/2024',
    status: 'active',
    totalOrders: 24,
    totalSpent: 3300000
  },
  {
    id: 14,
    fullName: 'Dương Thị Oanh',
    email: 'duongthioanh@email.com',
    phone: '0934567891',
    idNumber: '079201234580',
    dateOfBirth: '21/03/1988',
    address: '357 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '08/02/2024',
    status: 'active',
    totalOrders: 30,
    totalSpent: 4100000
  },
  {
    id: 15,
    fullName: 'Hồ Văn Phúc',
    email: 'hovanphuc@email.com',
    phone: '0945678902',
    idNumber: '079201234581',
    dateOfBirth: '09/12/1991',
    address: '246 Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '10/02/2024',
    status: 'disabled',
    totalOrders: 4,
    totalSpent: 320000
  },
  {
    id: 16,
    fullName: 'Tô Thị Quỳnh',
    email: 'tothiquynh@email.com',
    phone: '0956789013',
    idNumber: '079201234582',
    dateOfBirth: '02/05/1993',
    address: '135 Pasteur, Quận 1, TP. Hồ Chí Minh',
    registrationDate: '12/02/2024',
    status: 'active',
    totalOrders: 16,
    totalSpent: 2200000
  },
  {
    id: 17,
    fullName: 'Đỗ Văn Rừng',
    email: 'dovanrung@email.com',
    phone: '0967890124',
    idNumber: '079201234583',
    dateOfBirth: '19/08/1989',
    address: '468 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '15/02/2024',
    status: 'active',
    totalOrders: 27,
    totalSpent: 3700000
  },
  {
    id: 18,
    fullName: 'Lưu Thị Sen',
    email: 'luuthisen@email.com',
    phone: '0978901235',
    idNumber: '079201234584',
    dateOfBirth: '11/11/1994',
    address: '579 Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh',
    registrationDate: '18/02/2024',
    status: 'active',
    totalOrders: 13,
    totalSpent: 1950000
  },
  {
    id: 19,
    fullName: 'Cao Văn Tâm',
    email: 'caovantam@email.com',
    phone: '0989012346',
    idNumber: '079201234585',
    dateOfBirth: '26/06/1987',
    address: '680 Trường Chinh, Quận Tân Bình, TP. Hồ Chí Minh',
    registrationDate: '20/02/2024',
    status: 'active',
    totalOrders: 22,
    totalSpent: 3050000
  },
  {
    id: 20,
    fullName: 'Vũ Thị Uyên',
    email: 'vuthiuyen@email.com',
    phone: '0990123457',
    idNumber: '079201234586',
    dateOfBirth: '08/09/1992',
    address: '791 Lạc Long Quân, Quận 11, TP. Hồ Chí Minh',
    registrationDate: '22/02/2024',
    status: 'disabled',
    totalOrders: 1,
    totalSpent: 95000
  },
  {
    id: 21,
    fullName: 'Đinh Văn Vinh',
    email: 'dinhvanvinh@email.com',
    phone: '0901234569',
    idNumber: '079201234587',
    dateOfBirth: '15/02/1990',
    address: '802 Âu Cơ, Quận Tân Phú, TP. Hồ Chí Minh',
    registrationDate: '25/02/2024',
    status: 'active',
    totalOrders: 20,
    totalSpent: 2750000
  },
  {
    id: 22,
    fullName: 'Quách Thị Xuân',
    email: 'quachthixuan@email.com',
    phone: '0912345680',
    idNumber: '079201234588',
    dateOfBirth: '04/04/1988',
    address: '913 Cộng Hòa, Quận Tân Bình, TP. Hồ Chí Minh',
    registrationDate: '28/02/2024',
    status: 'active',
    totalOrders: 17,
    totalSpent: 2350000
  },
  {
    id: 23,
    fullName: 'Tạ Văn Yên',
    email: 'tavanyen@email.com',
    phone: '0923456781',
    idNumber: '079201234589',
    dateOfBirth: '23/07/1991',
    address: '124 Hoàng Hoa Thám, Quận Tân Bình, TP. Hồ Chí Minh',
    registrationDate: '01/03/2024',
    status: 'active',
    totalOrders: 29,
    totalSpent: 4000000
  }
];

/**
 * Get customer by ID
 */
export function getCustomerById(id: number): Customer | undefined {
  return mockCustomers.find((customer) => customer.id === id);
}

/**
 * Get customers by status
 */
export function getCustomersByStatus(status: Customer['status']): Customer[] {
  return mockCustomers.filter((customer) => customer.status === status);
}

/**
 * Get active customers
 */
export function getActiveCustomers(): Customer[] {
  return getCustomersByStatus('active');
}

/**
 * Get disabled customers
 */
export function getDisabledCustomers(): Customer[] {
  return getCustomersByStatus('disabled');
}
