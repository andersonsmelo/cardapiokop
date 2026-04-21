'use client';

import { useRef, useEffect } from 'react';
import type { Category } from '@/lib/data';

interface CategoryNavProps {
    categories: Category[];
    activeId: string;
    onSelect: (id: string) => void;
}

export function CategoryNav({ categories, activeId, onSelect }: CategoryNavProps) {
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (activeId && navRef.current) {
            const activeBtn = navRef.current.querySelector<HTMLElement>(`[data-id="${activeId}"]`);
            if (activeBtn) {
                activeBtn.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [activeId]);

    return (
        <nav
            ref={navRef}
            className="sticky top-[80px] sm:top-[100px] z-40 flex overflow-x-auto whitespace-nowrap border-b border-border bg-surface/95 py-4 shadow-[0_8px_22px_rgba(68,36,22,0.08)] backdrop-blur [mask-image:linear-gradient(to_right,transparent,black_5px,black_95%,transparent)]"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
            <style jsx global>{`
                nav::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    data-id={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={`
            mx-2 rounded-full border px-6 py-2 text-sm font-medium tracking-wide transition-all duration-300
            first:ml-6 last:mr-6
            ${activeId === cat.id
                            ? 'border-brand-red bg-brand-red text-surface shadow-sm'
                            : 'border-border bg-surface text-muted hover:border-brand-red/40 hover:bg-surface-muted hover:text-foreground'
                        }
          `}
                >
                    {cat.name}
                </button>
            ))}
        </nav>
    );
}
