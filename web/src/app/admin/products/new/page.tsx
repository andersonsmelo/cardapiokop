'use client';

import { ProductForm } from '@/components/ProductForm';
import { ProtectedLayout } from '@/components/ProtectedLayout';

export default function NewProductPage() {
    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-background pb-10">
                <header className="border-b border-border bg-surface">
                    <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
                        <h1 className="font-heading text-xl text-brand-red">Novo Produto</h1>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl px-6 py-8">
                    <ProductForm />
                </main>
            </div>
        </ProtectedLayout>
    );
}
