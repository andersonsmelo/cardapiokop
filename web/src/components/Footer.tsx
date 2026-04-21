export function Footer() {
    return (
        <footer className="mt-auto bg-transparent px-6 py-8 text-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <p className="mb-2 text-[10px] font-medium tracking-wider text-muted/75">
                TODOS OS DIREITOS RESERVADOS A KOPENHAGEN
            </p>
            <a
                href="https://ascendcreative.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium tracking-widest text-muted transition-colors hover:text-brand-red"
            >
                Desenvolvido pela Ascend Creative
            </a>
        </footer>
    );
}
