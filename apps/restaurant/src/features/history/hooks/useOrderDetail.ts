"use client";
import { useState } from "react";
import { orderApi } from "@repo/api";
import { OrderResponse, OrderHistoryItem } from "@repo/types";

/**
 * Helper to map API order to UI order
 */
export function mapOrderResponseToOrderHistoryItem(res: OrderResponse): OrderHistoryItem {
    return {
        id: `ORD-${res.id}`,
        createdAt: res.createdAt,
        customerName: res.customer.name,
        // Optional avatar if available in API, otherwise undefined/empty
        customerAvatar: undefined,
        customerPhone: res.customer.phoneNumber,
        totalAmount: res.totalAmount,
        paymentMethod: res.paymentMethod as any,
        status: res.orderStatus as any,
        itemsCount: res.orderItems.length,
        items: res.orderItems.map(item => ({
            name: item.dish.name,
            quantity: item.quantity,
            price: item.priceAtPurchase
        })),
        deliveryFee: res.deliveryFee,
        discount: res.discountAmount || 0,
        voucherCode: undefined, // Add if API provides
        platformFee: res.restaurantCommissionAmount || 0,
        netIncome: res.restaurantNetEarning || 0,
        restaurantName: res.restaurant.name,
        driverName: res.driver?.name,
        driver: res.driver ? {
            name: res.driver.name,
            phone: res.driver.phoneNumber || '',
            vehicleType: res.driver.vehicleType || 'Motorbike',
            licensePlate: res.driver.vehicleLicensePlate || '',
            rating: parseFloat(res.driver.averageRating || '0'),
            totalTrips: parseInt(res.driver.completedTrips || '0'),
            avatar: ''
        } : undefined,
        reviewRating: 0, // Rating not in OrderResponse, defaulting to 0
        pickupAddress: res.restaurant.address,
        deliveryAddress: res.deliveryAddress
    };
}

export function useOrderDetail() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getOrderDetail = async (orderId: number | string): Promise<OrderHistoryItem | null> => {
        // Handle if orderId comes as string "ORD-123"
        let parsedId = orderId;
        if (typeof orderId === 'string' && orderId.startsWith('ORD-')) {
            parsedId = parseInt(orderId.replace('ORD-', ''), 10);
        } else if (typeof orderId === 'string') {
            parsedId = parseInt(orderId, 10);
        }

        if (isNaN(parsedId as number)) return null;

        setIsLoading(true);
        setError(null);
        try {
            const response = await orderApi.getOrderById(parsedId as number);
            if (response.statusCode === 200 && response.data) {
                return mapOrderResponseToOrderHistoryItem(response.data);
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
