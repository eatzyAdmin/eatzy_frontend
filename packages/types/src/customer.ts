// Customer type definitions for Eatzy Super Admin
export type CustomerStatus = 'active' | 'disabled';

export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  dateOfBirth: string;
  address: string;
  registrationDate: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
}
