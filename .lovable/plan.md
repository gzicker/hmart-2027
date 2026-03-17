

## Fix: Subtitle still showing more than 2 lines

**Problem**: `line-clamp-2` via Tailwind may not be reliably clamping — the subtitle still renders 3-4 lines as seen in the screenshot.

**Root cause**: The `group-hover:line-clamp-none` class may be interfering with the base `line-clamp-2`, or there's a specificity issue. Tailwind's line-clamp utilities set multiple properties (`display`, `-webkit-box-orient`, `-webkit-line-clamp`, `overflow`) and the hover variant may not cleanly override all of them.

**Fix** — use a more robust approach with `max-h` + `overflow-hidden`:

### `src/components/ProductCard.tsx`

For the subtitle `<p>` element:
- Replace `line-clamp-2 group-hover:line-clamp-none` with:
  - `overflow-hidden max-h-[2.25rem]` (2 lines of `text-xs` with `leading-tight` ≈ 1.125rem per line)
  - `group-hover:max-h-40` (expands on hover to show all content)
  - Add `transition-all duration-300` for smooth expansion

For the title `<h3>`:
- Similarly replace `line-clamp-2 group-hover:line-clamp-3` with:
  - `overflow-hidden max-h-[2.5rem]` (2 lines of `text-sm` with `leading-tight`)
  - `group-hover:max-h-[3.75rem]` (3 lines on hover)
  - Add `transition-all duration-300`

This approach is more reliable across browsers and avoids the webkit line-clamp conflicts.

