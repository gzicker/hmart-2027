import { vtexFetch } from './vtexConfig';

export interface RegionSeller {
  id: string;
  name: string;
  logo: string;
}

/** Known pickup store addresses (display-only metadata for pickup mode) */
export const STORE_ADDRESSES: Record<string, string> = {
  hmartusqaca: '2300 South St, Lakewood, CA 90712',
  hmartusqanls: '7801 N Milwaukee Ave, Niles, IL 60714',
  hmartusqahsv: '300 Grand Ave, Englewood, NJ 07631',
  hmartusqaord: '2916 Colonial Dr, Orlando, FL 32803',
  hmartusqahrh: '11401 Harry Hines Blvd, Dallas, TX 75229',
};

/**
 * Queries VTEX Regions API to find which sellers serve a given ZIP code.
 * Returns the actual sellers configured in VTEX, not a static list.
 */
export async function getSellersForZipcode(postalCode: string, country = 'USA'): Promise<RegionSeller[]> {
  const data = await vtexFetch<Array<{ id: string; sellers: RegionSeller[] }>>(
    '/api/checkout/pub/regions',
    { params: { country, postalCode } }
  );

  const seen = new Set<string>();
  const sellers: RegionSeller[] = [];
  for (const region of data || []) {
    for (const seller of region.sellers || []) {
      if (!seen.has(seller.id)) {
        seen.add(seller.id);
        sellers.push(seller);
      }
    }
  }
  return sellers;
}
