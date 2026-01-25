import { Restaurant } from "./restaurant";

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  FREESHIP = 'FREESHIP',
}

export interface Voucher {
  id: number;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number;
  usageLimitPerUser: number;
  startDate: string;
  endDate: string;
  totalQuantity: number;
  remainingQuantity: number;
  active: boolean;
  restaurants?: Restaurant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVoucherDto extends Partial<Voucher> {
  restaurantIds?: number[];
}
