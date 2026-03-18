

# Performance Optimization Plan

## What the Lighthouse diagnostics show

The screenshots reveal the dominant bottleneck is **TikTok embeds** — 5 iframes loading ~30MB of TikTok JS/CSS/fonts, consuming 18s of CPU time. This is 90%+ of the performance problem. The remaining issues are large hero images (~1.5MB total) and unused CSS (37 KiB).

## What we can fix (without losing features or experience)

### 1. Lazy-load TikTok embeds with IntersectionObserver

Replace the 5 TikTok iframes with static preview thumbnails. Only load the actual iframe when the user scrolls to the section **and** clicks "Play". This eliminates ~30MB of third-party JS on initial load.

**Approach**: Create a `LazyTikTokEmbed` component that:
- Renders a lightweight placeholder (thumbnail image + play button overlay)
- Uses `IntersectionObserver` to detect when visible
- On click, swaps the placeholder for the real `<iframe>`
- The TikTok thumbnail URL pattern: `https://www.tiktok.com/oembed?url=...` (or a static preview image)

**File**: New `src/components/LazyTikTokEmbed.tsx`, update `src/pages/HomePage.tsx`

### 2. Lazy-load route pages with React.lazy + Suspense

All 4 page components are eagerly imported in `App.tsx`. Use `React.lazy()` so only `HomePage` code ships on initial load; PDP, PLP, Checkout load on navigation.

**File**: `src/App.tsx` — wrap imports with `lazy()`, add `<Suspense>` fallback

### 3. Optimize hero images — add responsive srcSet and preload LCP image

The hero carousel loads 4 full-resolution JPGs (~500KB each). Only the first slide is visible on load.

**Approach**:
- Preload only the first hero image via `<link rel="preload">` in `index.html`
- Add `loading="lazy"` to non-active slides in `HeroCarousel.tsx`
- Add `fetchpriority="high"` to the active slide image

**Files**: `index.html`, `src/components/HeroCarousel.tsx`

### 4. Add font-display: swap to Google Fonts import

The current Google Fonts URL doesn't specify `&display=swap`. Adding it prevents FOIT (flash of invisible text).

**File**: `src/index.css` — append `&display=swap` to the Google Fonts URL

### 5. Remove recipe/banner images from eager loading

The recipe image (`recipeTteokbokki`) and banner images (`bannerNongshim`, `bannerCj`) are below the fold. Add `loading="lazy"` to those `<img>` tags.

**File**: `src/pages/HomePage.tsx`

---

## Impact estimate

| Fix | Savings |
|-----|---------|
| Lazy TikTok embeds | ~30MB network, ~16s JS execution |
| Route code-splitting | ~200KB initial JS |
| Hero image optimization | ~1MB deferred |
| font-display: swap | 70ms FCP improvement |
| Lazy below-fold images | ~500KB deferred |

## Files to change

1. **New `src/components/LazyTikTokEmbed.tsx`** — click-to-load TikTok iframe
2. **`src/pages/HomePage.tsx`** — use LazyTikTokEmbed, add `loading="lazy"` to below-fold images
3. **`src/App.tsx`** — `React.lazy` + `Suspense` for all routes
4. **`src/index.css`** — add `&display=swap` to font URL
5. **`src/components/HeroCarousel.tsx`** — `fetchpriority="high"` on active slide, `loading="lazy"` on others

Zero features removed. Same visual experience. TikTok videos still work — they just load on interaction instead of page load.

