'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { Product } from '@/types';

interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    initialData?: Product;
    isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form State
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState(initialData?.price || '');
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
    const [featured, setFeatured] = useState(initialData?.featured || false);

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (!res.ok) return;
            const data = await res.json();
            setCategories(data || []);
            if (!categoryId && data && data.length > 0 && !isEdit) {
                setCategoryId(data[0].id);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                name,
                description,
                price,
                image_url: imageUrl,
                category_id: categoryId,
                featured
            };

            let res;

            if (isEdit && initialData?.id) {
                res = await fetch(`/api/products/${initialData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
            } else {
                res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
            }

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao salvar produto');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/admin');
                router.refresh();
            }, 1500);
        } catch (error: unknown) {
            console.error('Error saving product:', error);
            if (error instanceof Error) {
                alert('Erro ao salvar produto: ' + error.message);
            } else {
                alert('Erro desconhecido ao salvar produto');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao fazer upload');
            }

            const { url } = await res.json();
            setImageUrl(url);
        } catch (error: unknown) {
            console.error('Error uploading image:', error);
            if (error instanceof Error) {
                alert('Erro ao fazer upload: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative max-w-2xl space-y-6 rounded-xl border border-border bg-surface p-8 shadow-[0_18px_44px_rgba(68,36,22,0.12)]">
            
            {success && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-success/25 bg-success-soft px-6 py-2 text-sm font-medium text-success animate-fade-up">
                    Produto salvo com sucesso!
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-muted">Nome do Produto</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-border bg-white/55 px-4 py-3 text-foreground transition-all placeholder:text-muted/55 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                        placeholder="Ex: Café Expresso"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-muted">Descrição</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-border bg-white/55 px-4 py-3 text-foreground transition-all placeholder:text-muted/55 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                        placeholder="Ex: Delicioso café..."
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-muted">Preço</label>
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-lg border border-border bg-white/55 px-4 py-3 text-foreground transition-all placeholder:text-muted/55 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                        placeholder="Ex: R$ 15,00"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-muted">Categoria</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-border bg-white/55 px-4 py-3 text-foreground transition-all focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-surface text-foreground">
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-muted">Imagem do Produto</label>

                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full rounded-lg border border-border bg-white/55 px-4 py-3 text-foreground transition-all placeholder:text-muted/55 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                            placeholder="URL da imagem (https://...)"
                        />

                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file);
                                }}
                                className="block w-full cursor-pointer text-sm text-muted
                                file:mr-4 file:rounded-full file:border-0
                                file:bg-brand-red file:px-4 file:py-2
                                file:text-sm file:font-semibold file:text-surface
                                hover:file:bg-brand-red-hover"
                            />
                            {loading && <p className="mt-1 text-xs text-brand-red">Fazendo upload...</p>}
                        </div>

                        {imageUrl && (
                            <div className="relative h-40 w-full overflow-hidden rounded-lg border border-border bg-white/55">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imageUrl} alt="Preview" className="h-full w-full object-contain" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="group flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={featured}
                            onChange={(e) => setFeatured(e.target.checked)}
                            className="h-5 w-5 rounded border-border bg-white/55 text-brand-red focus:ring-brand-red"
                        />
                        <span className="text-foreground transition-colors group-hover:text-brand-red">Destacar este produto</span>
                    </label>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Link
                    href="/admin"
                    className="flex-1 rounded-lg border border-border py-3 text-center text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-brand-red py-3 font-medium text-surface transition-colors hover:bg-brand-red-hover disabled:opacity-50"
                >
                    {loading ? 'Salvando...' : 'Salvar Produto'}
                </button>
            </div>
        </form>
    );
}
