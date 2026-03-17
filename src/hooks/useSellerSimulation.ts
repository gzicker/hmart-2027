import { useEffect, useMemo, useState } from "react";
import { simulateForSeller } from "@/api/checkoutApi";
import { Product } from "@/data/products";

export interface SellerSimulationResult {
  price: number;
  available: boolean;
  listPrice: number;
}

const simulationCache = new Map<string, SellerSimulationResult>();
const pendingCache = new Map<string, Promise<SellerSimulationResult>>();

function getCacheKey(product: Product, sellerId: string) {
  const skuId = product._vtex?.skuId;
  return skuId ? `${skuId}:${sellerId}` : "";
}

async function fetchSimulation(product: Product, sellerId: string): Promise<SellerSimulationResult | null> {
  const skuId = product._vtex?.skuId;
  if (!skuId) return null;

  const key = getCacheKey(product, sellerId);
  const cached = simulationCache.get(key);
  if (cached) return cached;

  const pending = pendingCache.get(key);
  if (pending) return pending;

  const request = simulateForSeller(skuId, sellerId)
    .then((result) => {
      simulationCache.set(key, result);
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
  const cacheKey = useMemo(() => getCacheKey(product, sellerId), [product, sellerId]);
  const [simulation, setSimulation] = useState<SellerSimulationResult | null>(() => {
    return cacheKey ? simulationCache.get(cacheKey) ?? null : null;
  });

  useEffect(() => {
    let cancelled = false;

    if (!cacheKey) {
      setSimulation(null);
      return;
    }

    const cached = simulationCache.get(cacheKey);
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

    return () => {
      cancelled = true;
    };
  }, [cacheKey, product, sellerId]);

  return simulation;
}

export function useProductsSellerSimulations(products: Product[], sellerId: string) {
  const productsKey = useMemo(
    () => products.map((product) => `${product.id}:${product._vtex?.skuId || ""}`).join("|"),
    [products]
  );

  const [simulations, setSimulations] = useState<Record<string, SellerSimulationResult>>({});

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const results = await Promise.all(
        products.map(async (product) => {
          try {
            const simulation = await fetchSimulation(product, sellerId);
            return simulation ? ([product.id, simulation] as const) : null;
          } catch {
            return null;
          }
        })
      );

      if (cancelled) return;

      setSimulations((prev) => ({
        ...prev,
        ...Object.fromEntries(results.filter(Boolean) as Array<readonly [string, SellerSimulationResult]>),
      }));
    }

    if (products.length > 0) {
      run();
    }

    return () => {
      cancelled = true;
    };
  }, [productsKey, products, sellerId]);

  return simulations;
}
