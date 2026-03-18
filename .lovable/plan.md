

## MiniCart Rewrite Plan

### Problem
The current MiniCart is a custom `div`-based overlay. It has `bg-white` in the code, but the user reports it appears transparent. Likely causes: the fixed positioning and z-index may conflict with other elements, there's no body scroll lock, no animations, and no proper a11y (focus trap, ESC key). The user wants to switch to using the existing `Sheet` (desktop) and `Drawer`/vaul (mobile) primitives which handle all of this automatically.

### What changes

**Replace `src/components/MiniCart.tsx` entirely** with the user's provided code structure:

1. **Use `useIsMobile()` hook** to branch between two rendering modes
2. **Desktop** — Radix `Sheet` with `side="right"`, overridden to `!bg-white !w-[420px] !p-0`, hide default close button via `[&>button]:hidden`, full-height flex column, custom header with X button, scrollable items, sticky footer
3. **Mobile** — vaul `Drawer` as bottom sheet with `max-h-[85vh]`, handle bar, same content
4. **Shared `CartContent` component** — extracted into a reusable function containing the items list (scrollable) and sticky footer
5. **Explicit `bg-white` everywhere** — not `bg-background` (which is `hsl(40 14% 97%)`, an off-white), not `bg-card`
6. **H Mart branding** — red-600 for prices and CTA button, matching the `--primary` color
7. **Item layout change** — trash button on left, quantity count in middle, plus button (red circle) on right, per the H Mart Korea style
8. **Body scroll lock, ESC key, focus trap, animations** — all handled automatically by Sheet and Drawer primitives

### Files to modify
- `src/components/MiniCart.tsx` — full rewrite (single file change)

