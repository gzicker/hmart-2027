import { vtexFetch } from './vtexConfig';

export interface RegionSeller {
  id: string;
  name: string;
  logo: string;
}

/**
 * Queries VTEX Regions API to find which sellers serve a given ZIP code.
 * This checks against ALL zip code ranges indexed in VTEX logistics tables.
 * Returns the actual sellers configured in VTEX, not a static list.
 */
export async function getSellersForZipcode(postalCode: string, country = 'USA'): Promise<RegionSeller[]> {
  const data = await vtexFetch<Array<{ id: string; sellers: RegionSeller[] }>>(
    '/api/checkout/pub/regions',
    { params: { country, postalCode } }
  );

  // Flatten and deduplicate sellers across all regions
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
