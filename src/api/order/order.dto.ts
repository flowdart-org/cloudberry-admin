export interface OrderResponseDto {
    id: string;
    orderNumber: string;
    customer: OrderResponseDtoCustomer;
    placedAt: string | null;
    updatedAt: string | null;
    deliveredAt: string | null;
    cancelledAt: string | null;
    subtotal: number;
    shippingCharge: number;
    discount: number;
    total: number;
    items: Array<OrderItemDto>;
    paymentMethod?: object | null;
    paymentStatus: string;
    orderStatus: string;
    isDeleted: boolean;
}


export interface OrderItemDto {
    productId: string;
    variantId: string;
    name: string;
    sku?: string;
    price: number;
    quantity: number;
    subtotal: number;
    metadata?: { [key: string]: any; } | null;
}

export interface OrderResponseDtoCustomer {
    id?: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
}