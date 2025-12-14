import { OrderStatus } from "@/types/order";
import { OrderItemResponseDto } from "../client";

export interface OrderResponseDto {
    id: string;
    orderNumber: string;
    customer: OrderResponseDtoCustomer;
    placedAt: string | null;
    updatedAt: string | null;
    deliveredAt: string | null;
    cancelledAt: string | null;
    subtotal: number;
    shippingAddress: {
            city: string,
            state: string,
            street: string,
            country: string,
            houseNo: string,
            pincode: number
        },
    shippingCharge: number;
    discount: number;
    total: number;
    items: Array<OrderItemResponseDto>;
    paymentMethod?: object | null;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    isDeleted: boolean;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// export interface OrderItemDto {
//     productId: string;
//     variantId: string;
//     name: string;
//     sku?: string;
//     price: number;
//     quantity: number;
//     subtotal: number;
//     metadata?: { [key: string]: any; } | null;
// }

export interface OrderResponseDtoCustomer {
    id?: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
}

