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
  address?: string | null;
  gender?: string | null;
  age?: number | null;
}

export interface ICustomerProfileDisplay {
  name: string;
  email: string;
  phone: string;
  profilePhoto: string;
  membershipTier: string;
  dateOfBirth?: string | null;
  hometown?: string | null;
  address?: string | null;
  gender?: string | null;
  age?: number | null;
}

export type CustomerStatus = 'active' | 'disabled';

export interface Customer extends ResCustomerProfileDTO {
  fullName: string;
  email: string;
  phone: string;
  idNumber?: string;
  dateOfBirth?: string | null;
  address?: string | null;
  registrationDate?: string;
  status: CustomerStatus;
  totalOrders?: number;
  totalSpent?: number;
}



