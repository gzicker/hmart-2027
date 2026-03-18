import { vtexFetch, VTEX_CONFIG } from './vtexConfig';

const IS_BASE = '/api/io/_v/api/intelligent-search';

export interface ISImage {
  imageId: string;
  imageLabel: string | null;
  imageUrl: string;
  imageText: string;
}

export interface ISInstallment {
  Value: number;
  InterestRate: number;
  TotalValuePlusInterestRate: number;
  NumberOfInstallments: number;
  Name: string;
}

export interface ISCommercialOffer {
  Price: number;
  ListPrice: number;
  AvailableQuantity: number;
  IsAvailable: boolean;
  Installments: ISInstallment[];
}

export interface ISSeller {
  sellerId: string;
  sellerName: string;
  sellerDefault: boolean;
  commertialOffer: ISCommercialOffer;
}

export interface ISSku {
  itemId: string;
  name: string;
  nameComplete: string;
  ean: string;
  referenceId: { Key: string; Value: string }[];
  images: ISImage[];
  sellers: ISSeller[];
  variations: { name: string; values: string[] }[];
}

export interface ISProduct {
  productId: string;
  productName: string;
  brand: string;
  brandId: number;
  link: string;
  linkText: string;
  description: string;
  categories: string[];
  categoryId: string;
  items: ISSku[];
  skuSpecifications?: { field: { name: string }; values: { name: string }[] }[];
  priceRange: {
    sellingPrice: { highPrice: number; lowPrice: number };
    listPrice: { highPrice: number; lowPrice: number };
  };
  [key: string]: unknown;
}

export interface ISSearchResponse {
  products: ISProduct[];
  recordsFiltered: number;
  correction?: { misspelled: boolean };
  operator: string;
  redirect?: string;
}

export interface ISAutocompleteResponse {
  itemsReturned: {
    thumb: string;
    name: string;
    href: string;
    slug: string;
    productId: string;
  }[];
  searches: { term: string; count: number }[];
}

export interface ISFacet {
  name: string;
  type: string;
  hidden: boolean;
  quantity: number;
  values: ISFacetValue[];
}

export interface ISFacetValue {
  id: string;
  name: string;
  key: string;
  value: string;
  quantity: number;
  selected: boolean;
  range?: { from: number; to: number };
  children?: ISFacetValue[];
}

export interface ISFacetsResponse {
  facets: ISFacet[];
}

export type SortOption = '' | 'price_asc' | 'price_desc' | 'orders_desc' | 'name_asc' | 'name_desc' | 'release_desc' | 'discount_desc';

/** Map our internal sort keys to VTEX Intelligent Search `sort` parameter format */
const SORT_MAP: Record<string, string> = {
  price_asc: 'price:asc',
  price_desc: 'price:desc',
  orders_desc: 'orders:desc',
  name_asc: 'name:asc',
  name_desc: 'name:desc',
  release_desc: 'release:desc',
  discount_desc: 'discount:desc',
};

export async function searchProducts(params: {
  query?: string;
  facets?: string;
  page?: number;
  count?: number;
  sort?: SortOption;
} = {}): Promise<ISSearchResponse> {
  const { query = '', facets = '', page = 1, count = 20, sort = '' } = params;
  const path = facets ? `${IS_BASE}/product_search/${facets}` : `${IS_BASE}/product_search`;
  const mappedSort = sort ? SORT_MAP[sort] || sort : undefined;
  return vtexFetch<ISSearchResponse>(path, {
    params: { query: query || undefined, page, count, sort: mappedSort, locale: VTEX_CONFIG.locale, sc: VTEX_CONFIG.salesChannel },
  });
}

export async function getProductById(productId: string): Promise<ISProduct | null> {
  const data = await vtexFetch<ISSearchResponse>(`${IS_BASE}/product_search`, {
    params: { 
      query: productId, 
      locale: VTEX_CONFIG.locale, 
      sc: VTEX_CONFIG.salesChannel 
    },
  });
  const exact = data.products?.find(p => p.productId === productId);
  if (exact) return exact;
  
  try {
    const catalogData = await vtexFetch<any[]>(
      `/api/catalog_system/pub/products/search?fq=productId:${productId}&sc=${VTEX_CONFIG.salesChannel}`
    );
    if (catalogData && catalogData.length > 0) {
      return catalogData[0] as ISProduct;
    }
  } catch (e) {
    console.warn('Catalog fallback failed:', e);
  }
  
  return null;
}

export async function searchBySlug(slug: string): Promise<ISProduct | null> {
  return getProductById(slug);
}

export async function autocomplete(query: string): Promise<ISAutocompleteResponse> {
  return vtexFetch<ISAutocompleteResponse>(`${IS_BASE}/autocomplete`, {
    params: { query, locale: VTEX_CONFIG.locale, sc: VTEX_CONFIG.salesChannel },
  });
}

export async function getFacets(params: { facets?: string; query?: string } = {}): Promise<ISFacetsResponse> {
  const { facets = '', query } = params;
  const effectiveQuery = query || (facets ? undefined : ' ');
  const path = facets
    ? `${IS_BASE}/facets/${facets}`
    : `${IS_BASE}/facets`;
  return vtexFetch<ISFacetsResponse>(path, {
    params: {
      query: effectiveQuery,
      locale: VTEX_CONFIG.locale,
      sc: VTEX_CONFIG.salesChannel,
    },
  });
}

export function getBestOffer(sku: ISSku): ISSeller | null {
  const available = sku.sellers.filter((s) => s.commertialOffer.IsAvailable);
  if (!available.length) return null;
  return available.find((s) => s.sellerDefault) || available.reduce((best, s) =>
    s.commertialOffer.Price < best.commertialOffer.Price ? s : best
  );
}

export function getDefaultSku(product: ISProduct): ISSku | null {
  return product.items.find((item) => {
    const seller = getBestOffer(item);
    return seller?.commertialOffer.IsAvailable;
  }) || product.items[0] || null;
}

export function getMainImage(sku: ISSku, width = 500, height = 500): string {
  const img = sku.images?.[0];
  if (!img) return '';
  let url = img.imageUrl;
  if (url.includes('vteximg.com') || url.includes('vtexassets.com')) {
    url = url.replace(/(-\d+-\d+)/, `-${width}-${height}`);
  }
  return url;
}

export function getBestInstallment(offer: ISCommercialOffer): ISInstallment | null {
  const noInterest = offer.Installments.filter((i) => i.InterestRate === 0);
  if (!noInterest.length) return offer.Installments[0] || null;
  return noInterest.reduce((best, i) =>
    i.NumberOfInstallments > best.NumberOfInstallments ? i : best
  );
}
