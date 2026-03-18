import { useEffect, useMemo, useState } from "react";
import { simulateBatch, simulateForSeller, type SimulationResult } from "@/api/checkoutApi";
import { Product } from "@/data/products";

export type SellerSimulationResult = SimulationResult;

// Cache with TTL (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 500;

interface CacheEntry {
  result: SellerSimulationResult;
  timestamp: number;
}

const simulationCache = new Map<string, CacheEntry>();
const pendingCache = new Map<string, Promise<SellerSimulationResult>>();

function getCacheKey(product: Product, sellerId: string) {
  const skuId = product._vtex?.skuId;
  return skuId ? `${skuId}:${sellerId}` : "";
}

function getCachedResult(key: string): SellerSimulationResult | null {
  const entry = simulationCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    simulationCache.delete(key);
    return null;
  }
  return entry.result;
}

function setCachedResult(key: string, result: SellerSimulationResult) {
  // Evict oldest entries if cache is too large
  if (simulationCache.size >= MAX_CACHE_SIZE) {
    const firstKey = simulationCache.keys().next().value;
    if (firstKey) simulationCache.delete(firstKey);
  }
  simulationCache.set(key, { result, timestamp: Date.now() });
}

async function fetchSimulation(product: Product, sellerId: string): Promise<SellerSimulationResult | null> {
  const skuId = product._vtex?.skuId;
  if (!skuId) return null;

  const key = getCacheKey(product, sellerId);
  const cached = getCachedResult(key);
  if (cached) return cached;

  const pending = pendingCache.get(key);
  if (pending) return pending;

  const request = simulateForSeller(skuId, sellerId)
    .then((result) => {
      setCachedResult(key, result);
      pendingCache.delete(key);
      return result;
    })
    .catch((error) => {
      pendingCache.delete(key);
      throw error;
    });

  pendingCache.set(key, request);
  return request;
}

export function useProductSellerSimulation(product: Product, sellerId: string) {
  // '__skip__' sentinel: when batch simulation data is passed as prop, skip individual call
  const skip = sellerId === '__skip__';
  const cacheKey = useMemo(() => skip ? '' : getCacheKey(product, sellerId), [product, sellerId, skip]);
  const [simulation, setSimulation] = useState<SellerSimulationResult | null>(() => {
    return cacheKey ? getCachedResult(cacheKey) : null;
  });

  useEffect(() => {
    let cancelled = false;

    if (!cacheKey || skip) {
      setSimulation(null);
      return;
    }

    const cached = getCachedResult(cacheKey);
    if (cached) {
      setSimulation(cached);
      return;
    }

    fetchSimulation(product, sellerId)
      .then((result) => {
        if (!cancelled) setSimulation(result);
      })
      .catch(() => {
        if (!cancelled) setSimulation(null);
      });

    return () => { cancelled = true; };
  }, [cacheKey, product, sellerId, skip]);

  return simulation;
}

/**
 * Batched simulation for multiple products — sends ONE API request instead of N.
 */
export function useProductsSellerSimulations(products: Product[], sellerId: string) {
  const productsKey = useMemo(
    () => products.map((product) => `${product.id}:${product._vtex?.skuId || ""}`).join("|"),
    [products]
  );

  const [simulations, setSimulations] = useState<Record<string, SellerSimulationResult>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoaded(false);

    async function run() {
      // Separate cached vs uncached
      const uncachedItems: Array<{ id: string; quantity: number; seller: string; productId: string }> = [];
      const cachedResults: Record<string, SellerSimulationResult> = {};

      for (const product of products) {
        const skuId = product._vtex?.skuId;
        if (!skuId) continue;

        const key = getCacheKey(product, sellerId);
        const cached = getCachedResult(key);
        if (cached) {
          cachedResults[product.id] = cached;
        } else {
          uncachedItems.push({
            id: skuId,
            quantity: 1,
            seller: product._vtex?.sellerId || sellerId,
            productId: product.id,
          });
        }
      }

      // Batch fetch uncached items in a single API call
      let batchResults: Record<string, SellerSimulationResult> = {};
      if (uncachedItems.length > 0) {
        try {
          const resultMap = await simulateBatch(
            uncachedItems.map(({ id, quantity, seller }) => ({ id, quantity, seller }))
          );

          for (const item of uncachedItems) {
            const result = resultMap.get(item.id);
            if (result) {
              const key = `${item.id}:${sellerId}`;
              setCachedResult(key, result);
              batchResults[item.productId] = result;
            }
          }
        } catch (err) {
          console.error('[Simulation] Batch failed:', err);
        }
      }

      if (cancelled) return;

      setSimulations((prev) => ({
        ...prev,
        ...cachedResults,
        ...batchResults,
      }));
    }

    if (products.length > 0) {
      run();
    }

    return () => { cancelled = true; };
  }, [productsKey, products, sellerId]);

  return simulations;
}
