export interface FranchiseStore {
  id: string;
  sellerId: string;
  name: string;
  city: string;
  state: string;
  address: string;
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
 * Find the nearest franchise store for a given zipcode using VTEX simulation.
 * Sends a simulation request with each seller and returns the first available one.
 */
export async function findStoreByZipcode(zipcode: string): Promise<FranchiseStore | null> {
  const { vtexFetch, VTEX_CONFIG } = await import('./vtexConfig');

  // Try simulation with each franchise seller to see which one serves this zipcode
  for (const store of FRANCHISE_STORES) {
    try {
      const data = await vtexFetch<any>(
        '/api/checkout/pub/orderForms/simulation',
        {
          method: 'POST',
          body: {
            items: [],
            postalCode: zipcode,
            country: 'USA',
            salesChannel: VTEX_CONFIG.salesChannel,
          },
          params: { sc: VTEX_CONFIG.salesChannel },
          timeout: 5000,
        }
      );

      // Check if logistics info indicates this seller can serve the zipcode
      const logisticsInfo = data?.logisticsInfo;
      if (logisticsInfo && logisticsInfo.length > 0) {
        return store;
      }
    } catch {
      // This seller can't serve the zipcode, try next
      continue;
    }
  }

  return null;
}

