

## Standardize Product Card Heights

**Problem**: Product names and subtitles vary in length, causing inconsistent card heights across the grid.

**Solution**: Clamp the product title area to 2 lines with CSS `line-clamp`, and reveal the full text on hover via a tooltip or expanded state. This is standard practice in e-commerce (Amazon, Instacart, Coupang all do this).

### Changes

**`src/components/ProductCard.tsx`**:
- Wrap the `<h3>` (which contains `displayName` + `subName`) in a container with `line-clamp-2` and a `group` class for hover behavior
- On hover, expand to show full text using `group-hover:line-clamp-none` with a subtle transition
- Add `title` attribute on the `<h3>` so users can also see full text via native tooltip
- Make the card itself a flex column with fixed sections so the price/button area always aligns at the bottom

**`src/index.css`**:
- Update `.product-card` to use `flex flex-col` for consistent bottom alignment
- Add the card content area (`p-3`) as `flex-1 flex flex-col` so price sticks to bottom

### Specific approach:
1. Card uses `flex flex-col h-full` — image on top, content fills remaining space
2. Content section (`p-3`) becomes `flex-1 flex flex-col` — price/button pushed to bottom via `mt-auto`
3. Title `<h3>` gets `line-clamp-2` (max 2 lines visible by default)
4. On card hover (`group-hover`), title expands to `line-clamp-3` max — enough to read but won't break layout dramatically
5. SubName (Korean/English secondary name) shown on same line after main name, inheriting the clamp

This keeps cards visually uniform while preserving all data — no information is lost.

