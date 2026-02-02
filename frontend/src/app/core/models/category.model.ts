export interface Category {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    parentCategoryId: number | null;
    parentCategoryName: string | null;
    subCategories: Category[];
    productCount: number;
}

export interface CategoryRequest {
    name: string;
    description?: string;
    imageUrl?: string;
    parentCategoryId?: number;
}
