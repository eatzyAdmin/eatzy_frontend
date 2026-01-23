"use client";
import { useState } from "react";
import { orderApi } from "@repo/api";
import { OrderResponse } from "@repo/types";
import { DriverHistoryOrder } from "../data/mockDriverHistory";

/**
 * Helper to map API order to UI order
 */
export function mapOrderResponseToDriverHistoryOrder(res: OrderResponse): DriverHistoryOrder {
    return {
        id: res.id.toString(),
        code: `#${res.id}`, // Or use a separate code if available
        status: res.orderStatus as any,
        restaurantId: res.restaurant.id.toString(),
        deliveryLocation: {
            lat: res.deliveryLatitude,
            lng: res.deliveryLongitude,
            address: res.deliveryAddress
        },
        restaurantLocation: {
            name: res.restaurant.name,
            lat: 0,
            lng: 0
        },
        driverLocation: { lat: 0, lng: 0 },
        items: res.orderItems.map(item => ({
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
        platformFee: (res.driverCommissionAmount || 0),
        distance: res.distance || 0,
        duration: res.totalTripDuration || 0,
        customerName: res.customer.name,
    };
}

export function useOrderDetail() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getOrderDetail = async (orderId: number): Promise<DriverHistoryOrder | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await orderApi.getOrderById(orderId);
            if (response.statusCode === 200 && response.data) {
                return mapOrderResponseToDriverHistoryOrder(response.data);
            }
            setError("Failed to fetch order details");
            return null;
        } catch (err) {
            setError("An error occurred while fetching order details");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { getOrderDetail, isLoading, error };
}
