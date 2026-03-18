

# Diagnosis & Fix Plan

## Problem 1: Unavailable products shown without notification

**Root Cause**: In `HomePage.tsx` line 184, we pass `simulationData={productSimulations[product.id] ?? null}`. When batch simulation hasn't finished loading yet, `productSimulations[product.id]` is `undefined`, and `?? null` coerces it to `null`. In `ProductCard`, `simulation` becomes `null`, so the fallback `!product.inStock` kicks in — and the IS API says `inStock: true` (it doesn't know about regional availability). So products that should be "Unavailable" for the selected seller appear as available with no badge.

The `chefPicks` filter (line 63-66) also has the same timing issue: before batch loads, `productSimulations[product.id]?.available` is `undefined` for all products, so `available` array is empty, and it falls back to showing the first 4 products regardless of availability.

**Fix**:
- Add an `isSimulationLoaded` flag to `useProductsSellerSimulations` so consumers know when data is ready vs still loading.
- In `HomePage`, only pass `simulationData` when batch is loaded. While loading, don't pass the prop (let `undefined` trigger individual simulation or show a loading skeleton).
- In `chefPicks`, only filter by availability after simulations are loaded.
- In `ProductListPage`, products don't use batch simulation — each card triggers individual simulation. This is fine but means the PLP currently shows all products as "available" until individual simulations load. We should also show a subtle "Unavailable" state based on simulation results there.

## Problem 2: Zipcode/store selection not persisting across pages

**Root Cause**: `CartContext` stores `selectedSellerId`, `selectedStore`, `fulfillmentMethod`, and `hasConfirmedLocation` in plain React state (initialized to `"1"`, `"Select store"`, `"delivery"`, `false`). CartProvider is at the app root, so state persists across route changes — that part is fine.

However, `StoreSelector` has its own `initializedRef` and runs `runSearch(DEFAULT_ZIP, true)` on mount. Since each page renders its own `<Header />` → `<StoreSelector />`, when navigating, StoreSelector remounts, `initializedRef` resets to `false`, and it re-runs the default ZIP search. This **overwrites** the user's manually selected seller with the auto-init result (`hmartusqahsv` from ZIP 10001).

**Fix**:
- Persist `selectedSellerId`, `selectedStore`, `fulfillmentMethod`, and `hasConfirmedLocation` to `localStorage` in `CartContext`, reading on init and writing on change.
- In `StoreSelector`, skip auto-init if `hasConfirmedLocation` is already `true` (user already selected a store). Only auto-init when there's no persisted selection.

## Files to Change

1. **`src/hooks/useSellerSimulation.ts`** — Add `isLoaded` boolean return to `useProductsSellerSimulations`
2. **`src/pages/HomePage.tsx`** — Use `isLoaded` to gate `simulationData` prop and `chefPicks` filter
3. **`src/contexts/CartContext.tsx`** — Persist location state to localStorage
4. **`src/components/StoreSelector.tsx`** — Skip auto-init when location already confirmed

