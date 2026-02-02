import { Address } from './address.model';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    items: OrderItem[];
    shippingAddress: Address;
    subtotal: number;
    shippingCost: number;
    tax: number;
    totalAmount: number;
    paymentMethod: string;
    notes: string;
    createdAt: string;
}

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    priceAtPurchase: number;
    subtotal: number;
}

export interface OrderRequest {
    shippingAddressId: number;
    paymentMethod?: string;
    notes?: string;
}
