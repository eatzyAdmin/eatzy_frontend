/**
 * Order Mappers - Transform API responses to typed frontend models
 */
import type {
  OrderResponse,
  OrderItemResponse,
  DriverHistoryOrder
} from "@repo/types";

/**
 * Map OrderResponse from backend to DriverHistoryOrder for driver app UI
 * @param res - The order response from backend API
 * @returns Mapped DriverHistoryOrder for driver app consumption
 */
export function mapOrderResponseToDriverHistoryOrder(res: OrderResponse): DriverHistoryOrder {
  return {
    id: res.id.toString(),
    code: `#${res.id}`,
    status: res.orderStatus as string,
    restaurantId: res.restaurant.id.toString(),
    deliveryLocation: {
      lat: res.deliveryLatitude,
      lng: res.deliveryLongitude,
      address: res.deliveryAddress
    },
    restaurantLocation: {
      name: res.restaurant.name,
      address: res.restaurant.address,
      lat: res.restaurant.latitude || 0,
      lng: res.restaurant.longitude || 0
    },
    driverLocation: { lat: 0, lng: 0 },
    items: res.orderItems.map((item: OrderItemResponse) => ({
      id: item.id.toString(),
      name: item.dish.name,
      price: item.priceAtPurchase,
      quantity: item.quantity,
      restaurantId: res.restaurant.id.toString()
    })),
    subtotal: res.subtotal,
    fee: res.deliveryFee,
    discount: res.discountAmount || 0,
    total: res.totalAmount,
    createdAt: res.createdAt,
    earnings: res.driverNetEarning || 0,
    platformFee: res.driverCommissionAmount || 0,
    distance: res.distance || 0,
    duration: res.totalTripDuration || 0,
    customerName: res.customer.name,
  };
}
