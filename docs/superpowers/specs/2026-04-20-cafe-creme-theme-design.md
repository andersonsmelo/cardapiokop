# Cafe Creme Theme Design

## Context

The current digital menu uses a very dark interface: black background, dark product cards, white text, wine red accents, and gold highlights. In the project meeting, the requested direction was to make the menu clearer while preserving the Kopenhagen brand.

The supplied Kopenhagen menu PDFs show a lighter brand expression: warm off-white backgrounds, wine red headers and section titles, champagne/gold linework, chocolate-brown text, warm product photography, and soft beige supporting shapes. The approved direction is **Cafe Creme**, a light warm palette that keeps the brand premium but improves readability on mobile.

## Approved Scope

Apply the Cafe Creme visual system to both:

- Public QR Code menu screens: home, category listing, product cards, category navigation, header, and footer.
- Administrative screens: login, admin dashboard, product table, create/edit product forms, and loading states.

The goal is consistency across customer-facing and administrative surfaces. The admin should feel like the same product, not a separate dark-mode tool.

## Palette

Use semantic tokens instead of scattering raw hex values through components.

| Token | Hex | Usage |
| --- | --- | --- |
| `background` | `#F4EADC` | Main page background; warm cafe-cream base |
| `surface` | `#FFF8EE` | Cards, forms, tables, nav surfaces |
| `surface-muted` | `#F0DDC4` | Table headers, subtle panels, selected soft backgrounds |
| `brand-red` | `#8F1430` | Primary brand color, headers, prices, primary buttons, active states |
| `brand-red-hover` | `#7F1830` | Hover/pressed primary action state |
| `gold` | `#C79D6B` | Decorative dividers, image rings, subtle premium accents |
| `gold-soft` | `#E7C89F` | Product image placeholders, gentle accent backgrounds |
| `foreground` | `#321B13` | Primary text on light backgrounds |
| `muted` | `#70402B` | Secondary text and labels |
| `border` | `#DFC7A9` | Card, form, table, and nav borders |
| `danger` | `#B42318` | Delete/error actions |
| `success` | `#2F7D32` | Success feedback |

## Visual Direction

The interface should feel warm, legible, premium, and appetizing. It should avoid becoming stark white or generic beige. The Kopenhagen wine red remains the signature color; cream and cafe tones provide clarity; champagne/gold is used as a supporting detail.

Primary surfaces should become light cream cards with subtle warm borders and soft shadows. Product cards should keep a rounded, tactile feeling, but shift from black containers to `surface` cards. Product imagery should sit in warm circular frames using `gold-soft` and `gold`, echoing the printed menu's photography treatment.

Buttons and active states should use `brand-red` with cream text. Secondary actions should use transparent or `surface` backgrounds with wine/chocolate text and warm borders. Destructive admin actions should use semantic danger red and remain visually separated from primary actions.

## Public Menu Requirements

The public menu must remain mobile-first and simple for QR Code use at the table.

Home:

- Use `background` for the page.
- Keep the brand intro centered.
- Use `gold` for the eyebrow and `brand-red` for "Kopenhagen".
- Replace dark category cards with `surface` cards, `border`, and a soft warm shadow.

Category page:

- Use a light background and wine section title.
- Keep the wine underline/accent, but tune it to the new token.
- Use product cards with `surface`, `border`, `foreground`, `muted`, and `brand-red` price.

Category navigation:

- Replace the current dark sticky nav with a light `surface` sticky bar.
- Active category uses `brand-red` background and cream text.
- Inactive category uses `surface`, `muted`, and warm border/hover states.

Header:

- Non-home header uses `brand-red`.
- Home header uses a transparent or `background` treatment over the cream page, and the logo must retain enough contrast against the cream background.
- Back button stays accessible with at least 44px touch target.

Footer:

- Use muted chocolate text on the cream background.
- Hover states use `brand-red` or `gold`, not white.

## Admin Requirements

The admin must use the same Cafe Creme tokens while preserving usability for management tasks.

Login:

- Replace dark full-screen background with `background`.
- Login panel uses `surface`, `border`, and soft shadow.
- Inputs use light backgrounds with visible labels and focus rings in `brand-red`.
- Error messages use `danger` with a light danger-tinted background.

Admin dashboard:

- Header uses `surface` with a warm border to keep the admin light; primary actions carry the `brand-red` weight.
- Product table uses `surface` background, `surface-muted` table header, warm borders, and chocolate text.
- Product names use `foreground`; category chips use `surface-muted` or light wine tint.
- Primary "Novo Produto" action uses `brand-red`.
- Edit action uses `brand-red`; delete action uses `danger`.

Product forms:

- Form container uses `surface`, warm border, and soft shadow.
- Inputs, textareas, selects, checkboxes, file upload controls, and image preview should be light and token-driven.
- Success feedback uses `success`; upload/loading hints use `brand-red`.

## Accessibility And UX Constraints

- Body text on cream surfaces must meet WCAG AA contrast target of 4.5:1.
- Secondary text must remain readable; avoid low-contrast beige-on-cream.
- Interactive elements must have visible focus states.
- Touch targets should remain at least 44px high on mobile.
- Do not rely on color alone for destructive or success states; keep clear labels.
- Preserve current route structure and interaction flows.
- Do not introduce new dependencies for the palette change.
- Avoid decorative gradients or heavy visual effects that make the menu feel less like the Kopenhagen printed material.

## Implementation Boundaries

This is a visual theme change, not a feature rebuild.

In scope:

- CSS color tokens and theme-level styles.
- Component class updates for public and admin screens.
- Light-mode interaction states.
- Focus, hover, disabled, empty, loading, success, and error state color updates.
- Basic visual verification on mobile and desktop widths.

Out of scope:

- API route restoration.
- Database changes.
- Product data changes.
- New navigation architecture.
- Typography replacement unless the existing fonts are already defined in the project and need only token/color alignment.
- New design assets beyond existing logos/product images.

## Expected Files To Touch

- `web/src/app/globals.css`
- `web/src/components/Header.tsx`
- `web/src/components/Footer.tsx`
- `web/src/components/CategoryCard.tsx`
- `web/src/components/CategoryNav.tsx`
- `web/src/components/ProductCard.tsx`
- `web/src/app/page.tsx`
- `web/src/app/[category]/page.tsx`
- `web/src/app/login/page.tsx`
- `web/src/app/admin/page.tsx`
- `web/src/app/admin/products/new/page.tsx`
- `web/src/app/admin/products/[id]/client.tsx`
- `web/src/components/ProductForm.tsx`
- `web/src/components/ProtectedLayout.tsx`

## Verification

Run:

```bash
cd web
npm run lint
```

If practical during implementation, also run:

```bash
cd web
npm run dev
```

Then visually check:

- Public home page at mobile width around 375px.
- Public category page at mobile width around 375px.
- Login page.
- Admin dashboard.
- Product form create/edit screens.

The design is successful when the UI is clearly lighter than the current version, still recognizably Kopenhagen, comfortable to read on a phone, and visually consistent between the public menu and admin.
