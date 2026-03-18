

# QA Report Fixes — Implementation Plan

## Issues to Fix (16 findings)

| # | Issue | Fix |
|---|-------|-----|
| 2 | Add-to-cart fails silently (VTEX 400) | Show error toast on failure (already partially done in CartContext). Debug: add better error message from VTEX response body. |
| 3 | 100+ duplicate simulation calls per page | Each `ProductCard` calls `useProductSellerSimulation` individually. On HomePage, `useProductsSellerSimulations` is used but individual cards still trigger their own. Fix: skip individual simulation when batch data is available via prop. |
| 4 | Sort does not work | Sort param IS wired to `searchProducts` query. Verify `sort` is passed correctly — the VTEX IS API uses `OrderBy` param format like `OrderByPriceDESC`. Map our sort options to VTEX format. |
| 7 | All CTAs route to `/products` | Add query params to differentiate: `/products?q=deals`, `/products?sort=release_desc` for new arrivals, `/products?q=k-beauty` for K-Beauty, etc. |
| 9 | Hero text invisible on mobile | The text IS rendered (checked code). Classes `text-2xl sm:text-4xl` should show. The issue is likely the overlay gradient not being strong enough on mobile. Strengthen mobile gradient. |
| 10 | Mobile hamburger menu empty | Code shows categories ARE populated. But may depend on VTEX category tree loading. Add fallback static nav items (Weekly Deals, Trending, etc.) always visible. Already partially done — add more links. |
| 11 | Sign-in non-functional | Make "Sign in" text a clickable button with a toast "Coming soon" or link placeholder. |
| 13 | Hardcoded fake ratings (4.5 stars, 0 reviews) | Already fixed in adapter (rating=0, reviewCount=0). ProductCard hides when rating=0. But static `products.ts` still has hardcoded ratings — ensure they're not used. |
| 14 | Nongshim banner garbled text | Translations look clean in code. QA may have seen Korean text and thought it was garbled. No action needed OR add explicit English-only promotional copy. |
| 15 | Hero text poor contrast | Add stronger text-shadow and darken the gradient overlay, especially the bottom portion. |
| 16 | Product descriptions duplicate names | In `vtexAdapter.ts`, description falls back to `productName`. Show description only if it differs from the product name. |
| 17 | 7 icon buttons lack aria-labels | Add `aria-label` to hamburger, mobile search, account, cart, and add-to-cart buttons. |
| 18 | Footer info sections are static text | Already converted to `<Link>` in previous pass. Verify they have meaningful destinations. |
| 19 | PDP shows fulfillment for unavailable products | Hide fulfillment section when `isUnavailable` is true. |
| 20 | Language switcher no function | LanguageSelector works via Popover. QA might have had a rendering issue. Verify it's accessible on desktop. |

## Technical Changes

### 1. Fix sort mapping (searchApi.ts)
Map sort values to VTEX IS `sort` param format: `price:asc`, `price:desc`, `orders:desc`, `name:asc`, `release:desc`, `discount:desc`.

### 2. Prevent duplicate simulations (ProductCard + HomePage)
Pass simulation data as optional prop to `ProductCard`. When provided, skip the individual `useProductSellerSimulation` hook.

### 3. Differentiate navigation links
- "Weekly Deals" → `/products?q=deals`
- "New Arrivals" → `/products?sort=release_desc`  
- "Best Sellers" → `/products?sort=orders_desc`
- "K-Beauty" → `/products?q=k-beauty`
- Category images → `/products?q={category}`

### 4. Hero mobile visibility + contrast
- Ensure overlay uses `from-hmart-charcoal/90` on mobile
- Add `[text-shadow:0_2px_8px_rgba(0,0,0,0.7)]` to hero text

### 5. Aria labels (Header, ProductCard)
- Hamburger: `aria-label="Open menu"`
- Mobile search: `aria-label="Search"`
- Account button: `aria-label="Account"`
- Cart button: `aria-label="Shopping cart"`
- Add-to-cart `+` button: `aria-label="Add to cart"`

### 6. Sign-in placeholder
Make "Sign in" a button that shows toast "Sign in coming soon".

### 7. PDP: hide fulfillment when unavailable
Wrap fulfillment section in `!isUnavailable &&` check.

### 8. Product description deduplication (vtexAdapter.ts)
Set `description` to empty string if it equals `productName`. In PDP, hide description if empty.

### 9. Mobile menu — ensure nav items always visible
Already populated with categories + Weekly Deals. Add "Trending on TikTok" and "New Arrivals" links.

### 10. Cart error handling improvement
Show the VTEX error message in the toast when available, not just generic "Failed to add item".

### Files to Edit
- `src/api/searchApi.ts` — fix sort param mapping
- `src/api/vtexAdapter.ts` — deduplicate description
- `src/components/Header.tsx` — aria-labels, sign-in button, mobile nav links, differentiated nav hrefs
- `src/components/ProductCard.tsx` — aria-label on `+`, accept simulation prop
- `src/components/HeroCarousel.tsx` — stronger gradient + text-shadow for mobile
- `src/pages/HomePage.tsx` — pass batch simulations to ProductCard, differentiate category/CTA links
- `src/pages/ProductDetailPage.tsx` — hide fulfillment when unavailable, hide empty description
- `src/components/Footer.tsx` — differentiate link destinations
- `src/contexts/CartContext.tsx` — better error messages from VTEX response

