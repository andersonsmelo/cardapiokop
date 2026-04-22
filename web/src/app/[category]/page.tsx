import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { DataAccessError, getCategories, getCategory, getProducts } from '@/lib/data';

export const revalidate = 60;

export async function generateStaticParams() {
    const categories = await getCategories();
    return categories.map((cat) => ({
        category: cat.slug,
    }));
}

async function loadCategoryData(categorySlug: string) {
    try {
        const category = await getCategory(categorySlug);

        if (!category) {
            return { category: null, categoryProducts: [], unavailable: false as const };
        }

        const categoryProducts = await getProducts(category.id);
        return { category, categoryProducts, unavailable: false as const };
    } catch (error) {
        if (!(error instanceof DataAccessError)) {
            throw error;
        }

        return { category: null, categoryProducts: [], unavailable: true as const };
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: categorySlug } = await params;
    const { category, categoryProducts, unavailable } = await loadCategoryData(categorySlug);

    if (!unavailable && !category) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pb-10">
            <Header />

            {unavailable ? (
                <main className="mx-auto max-w-md px-6 py-10">
                    <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-[0_18px_44px_rgba(68,36,22,0.12)]">
                        <h1 className="font-heading text-2xl text-brand-red">Categoria indisponível</h1>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                            Não foi possível carregar os itens desta categoria agora. Tente novamente em instantes.
                        </p>
                    </div>
                </main>
            ) : (
                <main className="mx-auto max-w-md px-6 py-8">
                    <div className="mb-8 flex flex-col items-center animate-fade-up">
                        <h1 className="font-heading relative pb-3 text-3xl text-brand-red">
                            {category.name}
                            <span className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-gold"></span>
                        </h1>
                    </div>

                    <div className="flex flex-col gap-4">
                        {categoryProducts.length > 0 ? (
                            categoryProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))
                        ) : (
                            <p className="text-center text-muted">Nenhum produto encontrado nesta categoria.</p>
                        )}
                    </div>
                </main>
            )}

            <Footer />
        </div>
    );
}
