'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <header
            className={`sticky top-0 z-50 flex h-[80px] sm:h-[100px] items-center justify-center transition-all duration-300 ${isHome ? 'bg-background/85 shadow-none backdrop-blur-sm' : 'bg-brand-red shadow-[0_10px_30px_rgba(50,27,19,0.16)]'
                }`}
        >
            {!isHome && (
                <Link
                    href="/"
                    className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full text-surface transition-colors hover:bg-surface/10 hover:text-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    aria-label="Voltar para o início"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </Link>
            )}

            <div className={`relative h-[60px] w-[200px] sm:h-[80px] sm:w-[250px] transition-opacity duration-300 ${isHome ? 'opacity-90' : 'opacity-100'}`}>
                <Image
                    src="/logotipo.webp"
                    alt="Kopenhagen"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </header>
    );
}
