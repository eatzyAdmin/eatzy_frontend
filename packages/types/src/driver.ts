import { PaymentMethod } from './common';

export type DriverOrderPhase = 'PICKUP' | 'DELIVERY';

export type DriverStatus = 'active' | 'disabled';

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
  earnings: DriverEarningsSummary;
  paymentMethod: PaymentMethod;
  distanceKm?: number;
};

// Driver type for Super Admin management
export type Driver = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  dateOfBirth: string;
  address: string;
  registrationDate: string;
  status: DriverStatus;
  vehicleType: string;
  licensePlate: string;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  profilePhoto?: string;
};
