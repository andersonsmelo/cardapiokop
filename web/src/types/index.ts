export interface Category {
    id: string;
    slug: string;
    name: string;
    order: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string | null;
    categoryId: string;
    featured: boolean;
    createdAt?: Date;
    categories?: { name: string } | null;
}
