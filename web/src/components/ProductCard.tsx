import Image from 'next/image';
import type { Product } from '@/lib/data';

interface ProductCardProps {
    product: Product;
    index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
    return (
        <article
            className={`
        group relative flex overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_28px_rgba(68,36,22,0.10)] transition-all hover:-translate-y-0.5 hover:border-brand-red/35 hover:shadow-[0_18px_36px_rgba(68,36,22,0.14)]
        ${product.featured ? 'flex-col' : 'flex-row items-center'}
        opacity-0 animate-fade-up
      `}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className={`relative shrink-0 overflow-hidden p-3 ${product.featured ? 'h-48 w-full' : 'h-28 w-28'}`}>
                <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-gold bg-gold-soft shadow-inner">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover scale-110"
                        sizes={product.featured ? "(max-width: 576px) 100vw, 576px" : "112px"}
                    />
                </div>
            </div>

            <div className="flex flex-1 flex-col justify-center p-4 pl-0">
                <h3 className="font-heading mb-1 text-lg font-medium text-foreground">
                    {product.name}
                </h3>

                <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-muted">
                    {product.description}
                </p>

                <div className="mt-1 flex items-center justify-between">
                    <span className="text-base font-bold tracking-wide text-brand-red">
                        {product.price}
                    </span>
                </div>
            </div>
        </article>
    );
}
