import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MenuContainer } from '@/components/MenuContainer';
import { DataAccessError, getAllProducts, getCategories } from '@/lib/data';

export const revalidate = 60;

async function loadHomeData() {
  try {
    const [categories, products] = await Promise.all([
      getCategories(),
      getAllProducts(),
    ]);

    return { categories, products, unavailable: false as const };
  } catch (error) {
    if (!(error instanceof DataAccessError)) {
      throw error;
    }

    return { categories: [], products: [], unavailable: true as const };
  }
}

export default async function Home() {
  const { categories, products, unavailable } = await loadHomeData();

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />

      {unavailable ? (
        <main className="mx-auto max-w-md px-6 py-10">
          <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-[0_18px_44px_rgba(68,36,22,0.12)]">
            <h1 className="font-heading text-2xl text-brand-red">Cardápio temporariamente indisponível</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Não foi possível carregar as categorias e os produtos agora. Tente novamente em instantes.
            </p>
          </div>
        </main>
      ) : (
        <MenuContainer categories={categories} products={products} />
      )}

      <Footer />
    </div>
  );
}
