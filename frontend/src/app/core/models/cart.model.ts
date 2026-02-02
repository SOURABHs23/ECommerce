export interface Cart {
    id: number;
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
}

export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    subtotal: number;
    inStock: boolean;
}

export interface CartItemRequest {
    productId: number;
    quantity: number;
}
