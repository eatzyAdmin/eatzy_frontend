import type { OrderResponse } from '@repo/types';

/**
 * Maps flat mock orderCard data from messages to the full OrderResponse type 
 * required by the official CurrentOrderCard component.
 * Mirrored 100% from the customer app.
 */
export const mapToOrderResponse = (orderCard: any): OrderResponse => {
  return {
    id: parseInt(orderCard.orderId.replace(/\D/g, '')) || 0,
    orderStatus: orderCard.status,
    totalAmount: orderCard.total,
    createdAt: new Date().toISOString(),
    restaurant: {
      name: orderCard.restaurantName,
      imageUrl: orderCard.restaurantImage,
    } as any,
    orderItems: Array(orderCard.itemCount).fill({
      dish: { name: orderCard.dishNames?.split(',')[0] || "Item" },
      quantity: 1
    }) as any,
  } as OrderResponse;
};
