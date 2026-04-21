import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryCard } from '@/components/CategoryCard';
import { getCategories } from '@/lib/data';

export const revalidate = 60;

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />

      <main className="mx-auto max-w-md px-6 py-8">
        <div className="mb-10 text-center animate-fade-up">
          <p className="mb-2 text-sm uppercase tracking-widest text-gold">Bem-vindo à</p>
          <h1 className="font-heading text-4xl text-brand-red">Kopenhagen</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Descubra o sabor único dos nossos clássicos, cafés e sobremesas.
          </p>
        </div>

        <div className="grid gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
