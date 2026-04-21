'use client';

import { useEffect, useState } from 'react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
    id: string;
    name: string;
    price: string;
    category_id: string;
    image_url: string;
    featured: boolean;
    categories: { name: string } | null;
}

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { signOut } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Erro ao buscar produtos');
            const data = await res.json();
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Erro ao excluir produto');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Erro ao excluir produto');
        }
    };

    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-background pb-10">
                <header className="sticky top-0 z-50 border-b border-border bg-surface/95 shadow-[0_8px_22px_rgba(68,36,22,0.08)] backdrop-blur">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                        <h1 className="font-heading text-xl text-brand-red">Kopenhagen Admin</h1>
                        <div className="flex items-center gap-4">
                            <span className="hidden text-sm text-muted sm:block">Logado</span>
                            <button
                                onClick={signOut}
                                className="text-sm text-muted transition-colors hover:text-brand-red"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-6 py-8">
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-heading text-2xl text-foreground">Produtos</h2>
                            <p className="text-sm text-muted">Gerencie o cardápio do restaurante</p>
                        </div>
                        <Link
                            href="/admin/products/new"
                            className="flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-brand-red-hover"
                        >
                            <span>+</span> Novo Produto
                        </Link>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-brand-red"></div>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_18px_44px_rgba(68,36,22,0.12)]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-muted">
                                    <thead className="bg-surface-muted font-heading uppercase tracking-wider text-brand-red">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Produto</th>
                                            <th className="px-6 py-4 font-medium">Categoria</th>
                                            <th className="px-6 py-4 font-medium">Preço</th>
                                            <th className="px-6 py-4 font-medium">Destaque</th>
                                            <th className="px-6 py-4 font-medium text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {products.map((product) => (
                                            <tr key={product.id} className="transition-colors hover:bg-surface-muted/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-gold-soft">
                                                            {product.image_url ? (
                                                                <Image
                                                                    src={product.image_url}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs">IMG</div>
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-foreground">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="rounded border border-border bg-surface-muted px-2 py-1 text-xs text-brand-red">
                                                        {product.categories?.name || 'Sem Categoria'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{product.price}</td>
                                                <td className="px-6 py-4">
                                                    {product.featured ? (
                                                        <span className="text-xs font-medium text-brand-red">★ Sim</span>
                                                    ) : (
                                                        <span className="text-xs text-muted/70">Não</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-3">
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="text-brand-red transition-colors hover:text-brand-red-hover"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-danger transition-colors hover:text-danger/80"
                                                    >
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {products.length === 0 && (
                                <div className="py-12 text-center text-muted">
                                    Nenhum produto encontrado.
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </ProtectedLayout>
    );
}
