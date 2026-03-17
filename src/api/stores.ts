import { vtexFetch, VTEX_CONFIG } from './vtexConfig';

export interface FranchiseStore {
  id: string;
  sellerId: string;
  name: string;
  city: string;
  state: string;
  address: string;
}

export interface DeliverySLA {
  id: string;
  name: string;
  shippingEstimate: string;
  price: number;
  /** Internal — never show to user */
  sellerId: string;
  /** Internal — never show to user */
  storeId: string;
}

export const FRANCHISE_STORES: FranchiseStore[] = [
  { id: 'hmartusqaca', sellerId: 'hmartusqaca', name: 'H Mart Lakewood', city: 'Lakewood', state: 'CA', address: 'Lakewood, CA' },
  { id: 'hmartusqanls', sellerId: 'hmartusqanls', name: 'H Mart Niles', city: 'Niles', state: 'IL', address: 'Niles, IL' },
  { id: 'hmartusqahsv', sellerId: 'hmartusqahsv', name: 'H Mart New Jersey', city: 'New Jersey', state: 'NJ', address: 'New Jersey, NJ' },
  { id: 'hmartusqaord', sellerId: 'hmartusqaord', name: 'H Mart Orlando', city: 'Orlando', state: 'FL', address: 'Orlando, FL' },
  { id: 'hmartusqahrh', sellerId: 'hmartusqahrh', name: 'H Mart Dallas', city: 'Dallas', state: 'TX', address: 'Dallas – Harry Hines, TX' },
];

export const DEFAULT_STORE = FRANCHISE_STORES[0];

/**
 * Parse VTEX shippingEstimate string (e.g. "3bd" = 3 business days, "45m" = 45 min)
 * into a human-readable label.
 */
export function formatShippingEstimate(estimate: string): string {
  if (!estimate) return '';
  const match = estimate.match(/^(\d+)([a-z]+)$/i);
  if (!match) return estimate;
  const [, num, unit] = match;
  const n = parseInt(num, 10);
  switch (unit) {
    case 'bd': return n === 0 ? 'Same day' : n === 1 ? '1 business day' : `${n} business days`;
    case 'd': return n === 0 ? 'Same day' : n === 1 ? '1 day' : `${n} days`;
    case 'h': return n === 1 ? '1 hour' : `${n} hours`;
    case 'm': return n <= 60 ? `${n} min` : `${Math.round(n / 60)} hours`;
    default: return estimate;
  }
}

/**
 * Probe a single franchise seller for available delivery SLAs at a given zipcode.
 * Uses a lightweight simulation with a probe SKU.
 */
async function probeSeller(
  store: FranchiseStore,
  postalCode: string,
  probeSkuId: string,
): Promise<DeliverySLA[]> {
  try {
    const data = await vtexFetch<any>(
      '/api/checkout/pub/orderForms/simulation',
      {
        method: 'POST',
        body: {
          items: [{ id: probeSkuId, quantity: 1, seller: store.sellerId }],
          postalCode,
          country: 'USA',
        },
        params: { sc: VTEX_CONFIG.salesChannel },
        timeout: 8000,
      },
    );

    const logisticsInfo = data?.logisticsInfo?.[0];
    if (!logisticsInfo?.slas?.length) return [];

    return logisticsInfo.slas
      .filter((sla: any) => sla.availableDeliveryWindows !== undefined || sla.deliveryChannel === 'delivery')
      .map((sla: any) => ({
        id: sla.id,
        name: sla.name || sla.id,
        shippingEstimate: sla.shippingEstimate || '',
        price: sla.price ? sla.price / 100 : 0,
        sellerId: store.sellerId,
        storeId: store.id,
      }));
  } catch {
    return [];
  }
}

/**
 * Query all franchise stores for available delivery SLAs at a zipcode.
 * Returns deduplicated SLAs (first match per SLA name wins).
 */
export async function getDeliverySLAsForZipcode(
  postalCode: string,
  probeSkuId?: string,
): Promise<DeliverySLA[]> {
  // Use a known probe SKU or fallback — we try "1" which is common in VTEX
  const skuId = probeSkuId || '1';

  const results = await Promise.allSettled(
    FRANCHISE_STORES.map((store) => probeSeller(store, postalCode, skuId)),
  );

  const allSLAs: DeliverySLA[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const sla of result.value) {
      // Deduplicate by SLA id — keep the cheapest option
      if (!seen.has(sla.id)) {
        seen.add(sla.id);
        allSLAs.push(sla);
      }
    }
  }

  return allSLAs;
}

/**
 * Find stores that offer pickup for a given zipcode.
 */
export async function findPickupStoresForZipcode(postalCode: string, probeSkuId?: string): Promise<FranchiseStore[]> {
  const skuId = probeSkuId || '1';
  const available: FranchiseStore[] = [];

  const results = await Promise.allSettled(
    FRANCHISE_STORES.map(async (store) => {
      try {
        const data = await vtexFetch<any>(
          '/api/checkout/pub/orderForms/simulation',
          {
            method: 'POST',
            body: {
              items: [{ id: skuId, quantity: 1, seller: store.sellerId }],
              postalCode,
              country: 'USA',
            },
            params: { sc: VTEX_CONFIG.salesChannel },
            timeout: 8000,
          },
        );
        const logistics = data?.logisticsInfo?.[0];
        const hasPickup = logistics?.slas?.some((sla: any) => sla.deliveryChannel === 'pickup-in-point');
        return hasPickup ? store : null;
      } catch {
        return null;
      }
    }),
  );

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) available.push(r.value);
  }

  return available;
}
