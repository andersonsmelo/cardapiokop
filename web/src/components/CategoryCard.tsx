import Link from 'next/link';
import type { Category } from '@/lib/data';

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            href={`/${category.slug}`}
            className="group relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-surface shadow-[0_12px_28px_rgba(68,36,22,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-red/45 hover:shadow-[0_16px_34px_rgba(68,36,22,0.12)]"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-gold-soft/20" />

            <h3 className="relative z-10 font-heading text-xl font-medium text-foreground transition-colors duration-300 group-hover:text-brand-red">
                {category.name}
            </h3>

            <div className="absolute bottom-0 left-0 h-1 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
        </Link>
    );
}
