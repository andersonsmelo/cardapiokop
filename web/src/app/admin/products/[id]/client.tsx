'use client';

import { useEffect, useState } from 'react';
import { ProductForm } from '@/components/ProductForm';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

export default function EditProductClient({ id }: { id: string }) {
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async (id: string) => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) {
                    router.push('/admin');
                    return;
                }
                const data = await res.json();
                setProduct({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    imageUrl: data.image_url,
                    categoryId: data.category_id,
                    featured: data.featured,
                });
            } catch (error) {
                console.error('Error:', error);
                router.push('/admin');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct(id);
    }, [id, router]);

    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-background pb-10">
                <header className="border-b border-border bg-surface">
                    <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
                        <h1 className="font-heading text-xl text-brand-red">Editar Produto</h1>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl px-6 py-8">
                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-brand-red"></div>
                        </div>
                    ) : (
                        <ProductForm initialData={product} isEdit />
                    )}
                </main>
            </div>
        </ProtectedLayout>
    );
}
