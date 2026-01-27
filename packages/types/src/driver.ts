import { PaymentMethod } from './common';

export type DriverOrderPhase = 'PICKUP' | 'DELIVERY';

export type DriverEarningsSummary = {
  orderId: string;
  driverId?: string;
  orderSubtotal: number;
  deliveryFee: number;
  driverCommissionRate?: number;
  driverCommissionAmount?: number;
  driverNetEarning: number;
  restaurantNetEarning?: number;
  platformTotalEarning?: number;
};

export type DriverOrderOffer = {
  id: string;
  netEarning: number; // driver_net_earning
  orderValue: number; // total_amount
  paymentMethod: PaymentMethod;
  distanceKm: number;
  pickup: { name: string; address: string; lng: number; lat: number };
  dropoff: { name?: string; address: string; lng: number; lat: number };
  expireSeconds: number; // 30s countdown
};

export type DriverActiveOrder = {
  id: string;
  phase: DriverOrderPhase; // PICKUP or DELIVERY
  orderStatus?: string;
  pickup: { name: string; address: string; lng: number; lat: number };
  dropoff: { name?: string; address: string; lng: number; lat: number };
  driverLocation: { lng: number; lat: number };
  customer?: { id?: number; name?: string; phoneNumber?: string };
  earnings: DriverEarningsSummary;
  paymentMethod: PaymentMethod;
  distanceKm?: number;
};

export type DriverStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserDriver {
  id: number;
  name: string;
  email: string;
}

export interface DriverProfile {
  id: number;
  user: UserDriver;
  vehicleDetails?: string;
  status: DriverStatus;
  currentLatitude?: number;
  currentLongitude?: number;
  averageRating?: number;
  codLimit?: number;
  completedTrips?: number;

  // National ID
  national_id_front?: string;
  national_id_back?: string;
  national_id_number?: string;
  national_id_status?: VerificationStatus;
  national_id_rejection_reason?: string;

  // Profile Photo
  profile_photo?: string;
  profile_photo_status?: VerificationStatus;
  profile_photo_rejection_reason?: string;

  // Driver License
  driver_license_image?: string;
  driver_license_number?: string;
  driver_license_class?: string;
  driver_license_expiry?: string;
  driver_license_status?: VerificationStatus;
  driver_license_rejection_reason?: string;

  // Bank Info
  bank_name?: string;
  bank_branch?: string;
  bank_account_holder?: string;
  bank_account_number?: string;
  tax_code?: string;
  bank_account_image?: string;
  bank_account_status?: VerificationStatus;
  bank_account_rejection_reason?: string;

  // Vehicle Info
  vehicle_type?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_license_plate?: string;
  vehicle_year?: number;
  vehicle_registration_image?: string;
  vehicle_registration_status?: VerificationStatus;
  vehicle_registration_rejection_reason?: string;
  vehicle_insurance_image?: string;
  vehicle_insurance_expiry?: string;
  vehicle_insurance_status?: VerificationStatus;
  vehicle_insurance_rejection_reason?: string;
  vehicle_photo?: string;
  vehicle_photo_status?: VerificationStatus;
  vehicle_photo_rejection_reason?: string;

  // Criminal Record
  criminal_record_image?: string;
  criminal_record_number?: string;
  criminal_record_issue_date?: string;
  criminal_record_status?: VerificationStatus;
  criminal_record_rejection_reason?: string;
}

export interface CreateDriverProfileDto {
  userId: number;
  vehicleDetails?: string;
  codLimit?: number;
  // ... other fields for creation if needed
}

export interface UpdateDriverProfileDto extends Partial<DriverProfile> {
  id: number;
}
