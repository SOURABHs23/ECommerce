export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    sku: string;
    brand: string;
    categoryId: number;
    categoryName: string;
    images: string[];
    featured: boolean;
    inStock: boolean;
}

export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    stock: number;
    sku?: string;
    brand?: string;
    categoryId?: number;
    images?: string[]; // Updated to match backend/component usage
    imageUrls?: string[]; // Keeping for backward compatibility if needed
    featured?: boolean;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}
