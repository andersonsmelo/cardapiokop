'use client';

import { useState, useEffect, useRef } from 'react';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import type { Category, Product } from '@/lib/data';

interface MenuContainerProps {
    categories: Category[];
    products: Product[];
}

export function MenuContainer({ categories, products }: MenuContainerProps) {
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '-120px 0px -70% 0px', // Adjusted offset for spy
            threshold: 0
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveCategory(entry.target.id);
                }
            });
        }, options);

        categories.forEach((cat) => {
            const element = document.getElementById(cat.id);
            if (element && observerRef.current) {
                observerRef.current.observe(element);
            }
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [categories]);

    const handleCategorySelect = (id: string) => {
        // setActiveCategory(id); // Let the observer update it to avoid conflict
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 130;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            <CategoryNav
                categories={categories}
                activeId={activeCategory}
                onSelect={handleCategorySelect}
            />

            <main className="max-w-xl mx-auto px-4 py-8 min-h-screen">
                {categories.map((cat) => {
                    const catProducts = products.filter(p => p.categoryId === cat.id);
                    if (catProducts.length === 0) return null;

                    return (
                        <section
                            key={cat.id}
                            id={cat.id}
                            className="scroll-mt-[140px] mb-12"
                        >
                            <div className="flex flex-col items-center mb-6">
                                <h2 className="text-2xl text-foreground relative pb-2">
                                    {cat.name}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-red rounded-full"></span>
                                </h2>
                            </div>

                            <div className="grid gap-6 md:grid-cols-1">
                                {catProducts.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </main>
        </>
    );
}
