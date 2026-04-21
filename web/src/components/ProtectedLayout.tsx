'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-brand-red"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return <>{children}</>;
}
