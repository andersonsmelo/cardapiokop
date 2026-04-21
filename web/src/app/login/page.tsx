'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao fazer login');
            }
            
            router.push('/admin');
            router.refresh();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Erro ao fazer login');
            } else {
                setError('Erro ao fazer login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md animate-fade-up rounded-2xl border border-border bg-surface p-8 shadow-[0_18px_44px_rgba(68,36,22,0.14)]">
                <div className="text-center mb-8">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="flex h-full w-full items-center justify-center rounded-full border border-brand-red/20 bg-brand-red/10 font-heading text-3xl text-brand-red">
                            K
                        </div>
                    </div>
                    <h1 className="font-heading text-2xl text-foreground">Área Administrativa</h1>
                    <p className="text-muted text-sm mt-2">Faça login para gerenciar o cardápio</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-muted mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-border bg-white/55 px-4 py-3 text-foreground transition-all placeholder:text-muted/55 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-muted mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-border bg-white/55 px-4 py-3 text-foreground transition-all placeholder:text-muted/55 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg border border-danger/20 bg-danger-soft p-3 text-center text-sm text-danger">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-brand-red py-3 font-medium text-surface transition-colors hover:bg-brand-red-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
