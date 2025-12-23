import { LngLat } from './common';

export type OrderStatus = 'PLACED' | 'PREPARED' | 'PICKED' | 'DELIVERED' | 'CANCELLED';

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  restaurantId: string;
  options?: {
    variant?: { id: string; name: string; price: number };
    addons?: { id: string; name: string; price: number }[];
    groups?: { id: string; title: string; options: { id: string; name: string; price: number }[] }[];
  };
};

export type Order = {
  id: string;
  code?: string;
  restaurantId: string;
  status: OrderStatus;
  deliveryLocation: LngLat & { address?: string };
  restaurantLocation: LngLat & { name?: string };
  driverLocation: LngLat & { name?: string };
  items: OrderItem[];
  subtotal: number;
  fee: number;
  discount: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
};
