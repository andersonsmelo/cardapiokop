# Cafe Creme Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current dark Kopenhagen menu/admin UI with the approved light Cafe Creme visual system.

**Architecture:** Centralize the palette in CSS theme tokens, then update public-facing components and admin components to consume those tokens. Keep the current routes, data flow, component boundaries, and responsive structure intact; this is a theme/refinement pass, not a feature rebuild.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, CSS variables.

---

## Task/Subagent Map

| Task | Subagent | Required Skill(s) | Responsibility |
| --- | --- | --- | --- |
| Task 1 | Theme Foundation Worker | `senior-frontend`, `ui-ux-pro-max` | Define Cafe Creme semantic tokens and global light theme behavior. |
| Task 2 | Public Menu UI Worker | `senior-frontend`, `ui-ux-pro-max` | Update customer-facing QR Code menu screens and shared public components. |
| Task 3 | Admin UI Worker | `senior-frontend`, `ui-ux-pro-max` | Update login, admin dashboard, product form, edit/create screens, and loading states. |
| Task 4 | Accessibility And QA Worker | `senior-frontend`, `ui-ux-pro-max` | Run lint, contrast review, responsive visual checks, and final polish. |

## File Structure

- `web/src/app/globals.css`: Owns theme tokens, base colors, reusable CSS variables, and animation/focus defaults.
- `web/src/components/Header.tsx`: Public menu header and back button styling.
- `web/src/components/Footer.tsx`: Public footer typography and hover states.
- `web/src/components/CategoryCard.tsx`: Home category card styling.
- `web/src/components/CategoryNav.tsx`: Sticky category navigation styling and active/inactive states.
- `web/src/components/ProductCard.tsx`: Public product card styling, product image frame, text, and price color.
- `web/src/app/page.tsx`: Home page text colors and page shell.
- `web/src/app/[category]/page.tsx`: Category page title, underline, empty state, and page shell.
- `web/src/app/login/page.tsx`: Login panel, inputs, error state, and primary button styling.
- `web/src/app/admin/page.tsx`: Admin dashboard header, table, product rows, chips, and actions.
- `web/src/app/admin/products/new/page.tsx`: New product page shell/header styling.
- `web/src/app/admin/products/[id]/client.tsx`: Edit product page shell/header/loading state styling.
- `web/src/components/ProductForm.tsx`: Product form controls, upload, preview, checkbox, success, cancel, and submit styling.
- `web/src/components/ProtectedLayout.tsx`: Auth loading screen styling.

---

### Task 1: Theme Foundation

**Subagent:** Theme Foundation Worker  
**Required skills:** `senior-frontend`, `ui-ux-pro-max`

**Files:**
- Modify: `web/src/app/globals.css`
- Reference: `docs/superpowers/specs/2026-04-20-cafe-creme-theme-design.md`

- [ ] **Step 1: Read the approved design spec**

Run:

```bash
sed -n '1,240p' docs/superpowers/specs/2026-04-20-cafe-creme-theme-design.md
```

Expected: the Cafe Creme palette includes `#F4EADC`, `#FFF8EE`, `#8F1430`, `#C79D6B`, `#321B13`, and `#DFC7A9`.

- [ ] **Step 2: Inspect the current global CSS**

Run:

```bash
sed -n '1,260p' web/src/app/globals.css
```

Expected: identify the existing `@theme`, `:root`, body, font, and animation declarations. If `sed` does not render the file because of the local filesystem issue seen during planning, use:

```bash
perl -0pe 's/\r/\n/g' web/src/app/globals.css | sed -n '1,260p'
```

- [ ] **Step 3: Replace dark theme variables with Cafe Creme tokens**

Modify `web/src/app/globals.css` so its theme variables include these exact semantic values. Keep any existing font declarations and animations that are unrelated to color.

```css
@import "tailwindcss";

:root {
  --background: #f4eadc;
  --surface: #fff8ee;
  --surface-muted: #f0ddc4;
  --foreground: #321b13;
  --muted: #70402b;
  --border: #dfc7a9;
  --brand-red: #8f1430;
  --brand-red-hover: #7f1830;
  --gold: #c79d6b;
  --gold-soft: #e7c89f;
  --danger: #b42318;
  --danger-soft: #fbe9e7;
  --success: #2f7d32;
  --success-soft: #e8f5e9;
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-brand-red: var(--brand-red);
  --color-brand-red-hover: var(--brand-red-hover);
  --color-gold: var(--gold);
  --color-gold-soft: var(--gold-soft);
  --color-danger: var(--danger);
  --color-danger-soft: var(--danger-soft);
  --color-success: var(--success);
  --color-success-soft: var(--success-soft);
}

html {
  background: var(--background);
}

body {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(255, 248, 238, 0.86), rgba(244, 234, 220, 0) 34%),
    var(--background);
  color: var(--foreground);
}

::selection {
  background: rgba(143, 20, 48, 0.18);
  color: var(--foreground);
}

:focus-visible {
  outline: 3px solid rgba(143, 20, 48, 0.36);
  outline-offset: 3px;
}
```

- [ ] **Step 4: Preserve existing typography and animation utilities**

If `globals.css` already contains `font-heading`, font imports, `animate-fade-up`, `@keyframes fade-up`, `line-clamp`, or other non-color utilities, keep them below the theme block. Do not remove working animations or font classes.

Expected retained shape:

```css
.font-heading {
  font-family: var(--font-heading), serif;
}

.animate-fade-up {
  animation: fade-up 0.5s ease both;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 5: Run lint after the theme change**

Run:

```bash
cd web
npm run lint
```

Expected: PASS. If lint fails because of unrelated existing files, record the exact errors before moving on; do not refactor unrelated code.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add web/src/app/globals.css
git commit -m "style: add cafe creme theme tokens"
```

Expected: commit succeeds. If git fails with `.git/index: unable to map index file: Operation timed out`, stop committing and report that git index issue; continue implementation only after the user approves working without commits.

---

### Task 2: Public Menu UI

**Subagent:** Public Menu UI Worker  
**Required skills:** `senior-frontend`, `ui-ux-pro-max`

**Files:**
- Modify: `web/src/components/Header.tsx`
- Modify: `web/src/components/Footer.tsx`
- Modify: `web/src/components/CategoryCard.tsx`
- Modify: `web/src/components/CategoryNav.tsx`
- Modify: `web/src/components/ProductCard.tsx`
- Modify: `web/src/app/page.tsx`
- Modify: `web/src/app/[category]/page.tsx`

- [ ] **Step 1: Inspect the public components**

Run:

```bash
sed -n '1,180p' web/src/components/Header.tsx
sed -n '1,120p' web/src/components/Footer.tsx
sed -n '1,140p' web/src/components/CategoryCard.tsx
sed -n '1,160p' web/src/components/CategoryNav.tsx
sed -n '1,180p' web/src/components/ProductCard.tsx
sed -n '1,120p' web/src/app/page.tsx
sed -n '1,140p' 'web/src/app/[category]/page.tsx'
```

Expected: dark hardcoded classes such as `bg-[#1E1E1E]`, `bg-[#181818]`, `border-white/5`, `text-white`, `hover:bg-white/5`, and `text-[#D8315B]` are present and need replacement.

- [ ] **Step 2: Update the public header**

In `web/src/components/Header.tsx`, replace the header and back-link classes with this token-driven version.

```tsx
<header
    className={`sticky top-0 z-50 flex h-[80px] sm:h-[100px] items-center justify-center transition-all duration-300 ${
        isHome
            ? 'bg-background/85 shadow-none backdrop-blur-sm'
            : 'bg-brand-red shadow-[0_10px_30px_rgba(50,27,19,0.16)]'
    }`}
>
    {!isHome && (
        <Link
            href="/"
            className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full text-surface transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Voltar para o início"
        >
```

Keep the existing SVG and logo `Image` block. Keep `priority`.

- [ ] **Step 3: Update category cards**

In `web/src/components/CategoryCard.tsx`, replace the `Link` class and decorative gradient/accent with:

```tsx
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
```

- [ ] **Step 4: Update product cards**

In `web/src/components/ProductCard.tsx`, replace the card, image frame, text, description, and price classes with:

```tsx
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
```

- [ ] **Step 5: Update sticky category navigation**

In `web/src/components/CategoryNav.tsx`, replace the `nav` and button class strings with:

```tsx
<nav
    ref={navRef}
    className="sticky top-[80px] sm:top-[100px] z-40 flex overflow-x-auto whitespace-nowrap border-b border-border bg-surface/95 py-4 shadow-[0_8px_22px_rgba(68,36,22,0.08)] backdrop-blur [mask-image:linear-gradient(to_right,transparent,black_5px,black_95%,transparent)]"
    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
>
```

And for the mapped `button`:

```tsx
className={`
    mx-2 rounded-full border px-6 py-2 text-sm font-medium tracking-wide transition-all duration-300
    first:ml-6 last:mr-6
    ${activeId === cat.id
        ? 'border-brand-red bg-brand-red text-surface shadow-sm'
        : 'border-border bg-surface text-muted hover:border-brand-red/40 hover:bg-surface-muted hover:text-foreground'
    }
  `}
```

- [ ] **Step 6: Update home and category page text colors**

In `web/src/app/page.tsx`, keep the structure and update the intro classes to:

```tsx
<p className="mb-2 text-sm uppercase tracking-widest text-gold">Bem-vindo à</p>
<h1 className="font-heading text-4xl text-brand-red">Kopenhagen</h1>
<p className="mt-3 text-sm leading-relaxed text-muted">
```

In `web/src/app/[category]/page.tsx`, update the title and empty state to:

```tsx
<h1 className="font-heading relative pb-3 text-3xl text-brand-red">
    {category.name}
    <span className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-gold"></span>
</h1>
```

And:

```tsx
<p className="text-center text-muted">Nenhum produto encontrado nesta categoria.</p>
```

- [ ] **Step 7: Update footer**

In `web/src/components/Footer.tsx`, replace muted dark hover styling with:

```tsx
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
```

- [ ] **Step 8: Run lint for public UI**

Run:

```bash
cd web
npm run lint
```

Expected: PASS. Fix only lint issues introduced in the files touched by Task 2.

- [ ] **Step 9: Commit Task 2**

Run:

```bash
git add web/src/components/Header.tsx web/src/components/Footer.tsx web/src/components/CategoryCard.tsx web/src/components/CategoryNav.tsx web/src/components/ProductCard.tsx web/src/app/page.tsx 'web/src/app/[category]/page.tsx'
git commit -m "style: apply cafe creme theme to public menu"
```

Expected: commit succeeds, unless the known `.git/index` timeout is still present.

---

### Task 3: Admin And Form UI

**Subagent:** Admin UI Worker  
**Required skills:** `senior-frontend`, `ui-ux-pro-max`

**Files:**
- Modify: `web/src/app/login/page.tsx`
- Modify: `web/src/app/admin/page.tsx`
- Modify: `web/src/app/admin/products/new/page.tsx`
- Modify: `web/src/app/admin/products/[id]/client.tsx`
- Modify: `web/src/components/ProductForm.tsx`
- Modify: `web/src/components/ProtectedLayout.tsx`

- [ ] **Step 1: Inspect admin files**

Run:

```bash
sed -n '1,150p' web/src/app/login/page.tsx
sed -n '1,220p' web/src/app/admin/page.tsx
sed -n '1,90p' web/src/app/admin/products/new/page.tsx
sed -n '1,110p' 'web/src/app/admin/products/[id]/client.tsx'
sed -n '1,320p' web/src/components/ProductForm.tsx
sed -n '1,80p' web/src/components/ProtectedLayout.tsx
```

Expected: existing admin surfaces still use dark classes such as `bg-surface` with `border-white/5`, `bg-black/20`, `text-white`, `hover:bg-white/5`, and `red-700`.

- [ ] **Step 2: Update login page surfaces and controls**

In `web/src/app/login/page.tsx`, update only JSX class names. Use these exact class replacements:

```tsx
<div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="w-full max-w-md animate-fade-up rounded-2xl border border-border bg-surface p-8 shadow-[0_18px_44px_rgba(68,36,22,0.14)]">
```

Logo placeholder:

```tsx
<div className="flex h-full w-full items-center justify-center rounded-full border border-brand-red/20 bg-brand-red/10 font-heading text-3xl text-brand-red">
```

Inputs:

```tsx
className="w-full rounded-lg border border-border bg-white/55 px-4 py-3 text-foreground transition-all placeholder:text-muted/55 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
```

Error:

```tsx
<div className="rounded-lg border border-danger/20 bg-danger-soft p-3 text-center text-sm text-danger">
```

Submit button:

```tsx
className="w-full rounded-lg bg-brand-red py-3 font-medium text-surface transition-colors hover:bg-brand-red-hover disabled:cursor-not-allowed disabled:opacity-50"
```

- [ ] **Step 3: Update admin dashboard shell**

In `web/src/app/admin/page.tsx`, update the page shell/header/main action classes:

```tsx
<div className="min-h-screen bg-background pb-10">
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 shadow-[0_8px_22px_rgba(68,36,22,0.08)] backdrop-blur">
```

Admin title and logout:

```tsx
<h1 className="font-heading text-xl text-brand-red">Kopenhagen Admin</h1>
<span className="hidden text-sm text-muted sm:block">Logado</span>
<button
    onClick={signOut}
    className="text-sm text-muted transition-colors hover:text-brand-red"
>
```

Primary CTA:

```tsx
className="flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-brand-red-hover"
```

- [ ] **Step 4: Update admin table**

In `web/src/app/admin/page.tsx`, replace table wrapper, table text, header, rows, image fallback, chips, and action colors with:

```tsx
<div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_18px_44px_rgba(68,36,22,0.12)]">
    <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted">
            <thead className="bg-surface-muted font-heading uppercase tracking-wider text-brand-red">
```

Rows:

```tsx
<tr key={product.id} className="transition-colors hover:bg-surface-muted/50">
```

Image shell:

```tsx
<div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-gold-soft">
```

Product name:

```tsx
<span className="font-medium text-foreground">{product.name}</span>
```

Category chip:

```tsx
<span className="rounded border border-border bg-surface-muted px-2 py-1 text-xs text-brand-red">
```

Featured states:

```tsx
<span className="text-xs font-medium text-brand-red">★ Sim</span>
<span className="text-xs text-muted/70">Não</span>
```

Actions:

```tsx
className="text-brand-red transition-colors hover:text-brand-red-hover"
className="text-danger transition-colors hover:text-danger/80"
```

Empty state:

```tsx
<div className="py-12 text-center text-muted">
```

- [ ] **Step 5: Update product create/edit shells**

In `web/src/app/admin/products/new/page.tsx` and `web/src/app/admin/products/[id]/client.tsx`, update shell/header classes:

```tsx
<div className="min-h-screen bg-background pb-10">
    <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
            <h1 className="font-heading text-xl text-brand-red">
```

In the edit client loading state, use:

```tsx
<div className="py-20 text-center">
    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-brand-red"></div>
</div>
```

- [ ] **Step 6: Update ProductForm form shell and success state**

In `web/src/components/ProductForm.tsx`, replace form wrapper and success state with:

```tsx
<form onSubmit={handleSubmit} className="relative max-w-2xl space-y-6 rounded-xl border border-border bg-surface p-8 shadow-[0_18px_44px_rgba(68,36,22,0.12)]">
```

Success state:

```tsx
<div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-success/25 bg-success-soft px-6 py-2 text-sm font-medium text-success animate-fade-up">
    Produto salvo com sucesso!
</div>
```

- [ ] **Step 7: Update ProductForm labels and controls**

In `web/src/components/ProductForm.tsx`, replace all text input, textarea, select, URL input classes with:

```tsx
className="w-full rounded-lg border border-border bg-white/55 px-4 py-3 text-foreground transition-all placeholder:text-muted/55 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
```

For the `select`, append `appearance-none`:

```tsx
className="w-full appearance-none rounded-lg border border-border bg-white/55 px-4 py-3 text-foreground transition-all focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
```

For `option`, use:

```tsx
className="bg-surface text-foreground"
```

For labels, keep this shape:

```tsx
<label className="mb-2 block text-sm font-medium text-muted">
```

- [ ] **Step 8: Update upload, preview, checkbox, and form buttons**

In `web/src/components/ProductForm.tsx`, update file input class to:

```tsx
className="block w-full cursor-pointer text-sm text-muted
file:mr-4 file:rounded-full file:border-0
file:bg-brand-red file:px-4 file:py-2
file:text-sm file:font-semibold file:text-surface
hover:file:bg-brand-red-hover"
```

Preview container:

```tsx
<div className="relative h-40 w-full overflow-hidden rounded-lg border border-border bg-white/55">
```

Checkbox:

```tsx
className="h-5 w-5 rounded border-border bg-white/55 text-brand-red focus:ring-brand-red"
```

Checkbox label:

```tsx
<span className="text-foreground transition-colors group-hover:text-brand-red">Destacar este produto</span>
```

Cancel link:

```tsx
className="flex-1 rounded-lg border border-border py-3 text-center text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
```

Submit button:

```tsx
className="flex-1 rounded-lg bg-brand-red py-3 font-medium text-surface transition-colors hover:bg-brand-red-hover disabled:opacity-50"
```

- [ ] **Step 9: Update ProtectedLayout loading screen**

In `web/src/components/ProtectedLayout.tsx`, update the loading wrapper/spinner to:

```tsx
<div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-brand-red"></div>
</div>
```

- [ ] **Step 10: Run lint for admin UI**

Run:

```bash
cd web
npm run lint
```

Expected: PASS. Fix only lint issues introduced in the files touched by Task 3.

- [ ] **Step 11: Commit Task 3**

Run:

```bash
git add web/src/app/login/page.tsx web/src/app/admin/page.tsx web/src/app/admin/products/new/page.tsx 'web/src/app/admin/products/[id]/client.tsx' web/src/components/ProductForm.tsx web/src/components/ProtectedLayout.tsx
git commit -m "style: apply cafe creme theme to admin"
```

Expected: commit succeeds, unless the known `.git/index` timeout is still present.

---

### Task 4: Accessibility, Visual QA, And Final Polish

**Subagent:** Accessibility And QA Worker  
**Required skills:** `senior-frontend`, `ui-ux-pro-max`

**Files:**
- Verify: all files changed in Tasks 1-3
- Modify only if needed: `web/src/app/globals.css`, `web/src/components/*.tsx`, `web/src/app/**/*.tsx`

- [ ] **Step 1: Run a focused raw-color scan**

Run:

```bash
rg -n "#1E1E1E|#252525|#121212|#181818|#D8315B|#A81C30|border-white|bg-black|text-white|hover:bg-white|red-700|yellow-500|blue-400|blue-300" web/src/app web/src/components -g '*.tsx' -g '*.css'
```

Expected: no remaining matches in themed UI files, except acceptable `text-white` inside contexts where the background is `brand-red` and cream text is not available. Prefer replacing those with `text-surface`.

- [ ] **Step 2: Fix any remaining dark-theme classes**

If Step 1 finds classes introduced by the old dark UI, replace them with these mappings:

```text
bg-black/20              -> bg-white/55
border-white/5           -> border-border
border-white/10          -> border-border
text-white               -> text-foreground or text-surface depending on background
hover:bg-white/5         -> hover:bg-surface-muted
bg-[#1E1E1E]             -> bg-surface border border-border
bg-[#181818]             -> bg-surface border-border
text-[#D8315B]           -> text-brand-red
bg-[#A81C30]             -> bg-brand-red
hover:bg-red-700         -> hover:bg-brand-red-hover
text-yellow-500          -> text-brand-red
text-blue-400            -> text-brand-red
text-red-400             -> text-danger
```

- [ ] **Step 3: Run lint**

Run:

```bash
cd web
npm run lint
```

Expected: PASS.

- [ ] **Step 4: Start the dev server**

Run:

```bash
cd web
npm run dev
```

Expected: Next.js starts on `http://localhost:3000`. If port 3000 is busy, use the port printed by Next.js.

- [ ] **Step 5: Visually check customer pages**

Open:

```text
http://localhost:3000/
```

Expected:

- Background is warm cream, not black.
- Category cards are light with warm borders.
- "Kopenhagen" is wine red.
- Eyebrow/accent is gold.
- Text is chocolate/muted brown and readable.

Open one generated category URL, for example:

```text
http://localhost:3000/cafes
```

Expected:

- Header and category title use Cafe Creme tokens.
- Product cards are light.
- Prices are wine red.
- Product descriptions are readable on mobile width.

- [ ] **Step 6: Visually check admin pages**

Open:

```text
http://localhost:3000/login
```

Expected:

- Login background is cream.
- Panel is light.
- Inputs have visible borders and focus rings.
- Error styling, if triggered, is danger red on a light danger surface.

If auth/API routes are available locally, also open:

```text
http://localhost:3000/admin
http://localhost:3000/admin/products/new
```

Expected:

- Admin dashboard is light and consistent with public menu.
- Table headers use warm muted surface.
- Primary action uses wine red.
- Delete actions use semantic danger red.
- Product form controls are light, readable, and have visible focus states.

- [ ] **Step 7: Check mobile width**

Use browser dev tools or Playwright at 375px width.

Manual expected checks:

- No horizontal scrolling on `/`.
- No horizontal scrolling on a category page.
- Sticky header and category nav do not cover content.
- Product card text wraps cleanly.
- Buttons and nav pills remain at least 44px tall or have comfortable tap area.

- [ ] **Step 8: Stop dev server**

If `npm run dev` is still running in the terminal, stop it with `Ctrl+C`.

Expected: no dev server process remains running from this task.

- [ ] **Step 9: Commit Task 4**

Run:

```bash
git add web/src/app web/src/components web/src/app/globals.css
git commit -m "style: polish cafe creme theme accessibility"
```

Expected: commit succeeds if changes were made. If Task 4 required no file changes, skip this commit and record that QA passed without additional edits.

---

## Self-Review

- Spec coverage: all approved scope sections are covered by Tasks 1-4.
- Placeholder scan: no unresolved placeholder markers or unspecified implementation steps remain.
- Type consistency: no new TypeScript types, props, or data contracts are introduced.
- Scope check: plan is limited to visual theme updates and verification; API restoration and database work remain out of scope.
