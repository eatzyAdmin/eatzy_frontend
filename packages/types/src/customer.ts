// Customer type definitions for Eatzy Super Admin matching Backend ResCustomerProfileDTO
export interface ResCustomerProfileDTO {
  id: number;
  user: UserCustomer;
  date_of_birth: string | null;
  hometown: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserCustomer {
  id: number;
  name: string;
  phoneNumber: string;
  email?: string;
  isActive: boolean;
  avatar?: string;
}

export type CustomerStatus = 'active' | 'disabled';

// For historical compatibility if needed, but we should use ResCustomerProfileDTO
export interface Customer extends ResCustomerProfileDTO {
  fullName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
}
