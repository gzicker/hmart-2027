import { vtexFetch, VTEX_CONFIG } from './vtexConfig';

// ============================================================
// TYPES — OrderForm structure
// ============================================================

export interface OrderFormItem {
  id: string;
  productId: string;
  name: string;
  skuName: string;
  imageUrl: string;
  detailUrl: string;
  quantity: number;
  uniqueId: string;
  seller: string;
  sellerName: string;
  price: number;         // unit price in cents
  listPrice: number;     // unit list price in cents
  sellingPrice: number;  // unit selling price in cents (after promos)
  isGift: boolean;
  availability: string;
  measurementUnit: string;
  unitMultiplier: number;
}

export interface OrderFormTotalizer {
  id: string;    // "Items" | "Shipping" | "Discounts"
  name: string;
  value: number; // in cents
}

export interface OrderForm {
  orderFormId: string;
  items: OrderFormItem[];
  totalizers: OrderFormTotalizer[];
  value: number;          // grand total in cents
  salesChannel: string;
  loggedIn: boolean;
  canEditData: boolean;
  messages: { code: string | null; status: string; text: string }[];
  marketingData: unknown;
  clientProfileData: unknown;
  shippingData: unknown;
  paymentData: unknown;
  ratesAndBenefitsData: unknown;
  selectableGifts: unknown[];
}

// ============================================================
// LOCAL STORAGE — persist orderFormId across sessions
// ============================================================

const ORDERFORM_KEY = 'vtex_orderFormId';

function getStoredId(): string | null {
  try { return localStorage.getItem(ORDERFORM_KEY); } catch { return null; }
}

function storeId(id: string): void {
  try { localStorage.setItem(ORDERFORM_KEY, id); } catch {}
}

function clearId(): void {
  try { localStorage.removeItem(ORDERFORM_KEY); } catch {}
}

// ============================================================
// ORDERFORM OPERATIONS
// ============================================================

export async function getOrCreateOrderForm(): Promise<OrderForm> {
  const storedId = getStoredId();

  if (storedId) {
    try {
      const of = await vtexFetch<OrderForm>(
        `/api/checkout/pub/orderForm/${storedId}`,
        { params: { sc: VTEX_CONFIG.salesChannel } }
      );
      storeId(of.orderFormId);
      return of;
    } catch {
      clearId();
    }
  }

  const of = await vtexFetch<OrderForm>(
    '/api/checkout/pub/orderForm',
    { params: { sc: VTEX_CONFIG.salesChannel } }
  );
  storeId(of.orderFormId);
  return of;
}

export async function addItems(
  orderFormId: string,
  items: Array<{ id: string; quantity: number; seller: string }>
): Promise<OrderForm> {
  const of = await vtexFetch<OrderForm>(
    `/api/checkout/pub/orderForm/${orderFormId}/items`,
    {
      method: 'POST',
      body: { orderItems: items },
      params: { sc: VTEX_CONFIG.salesChannel },
    }
  );
  storeId(of.orderFormId);
  return of;
}

export async function updateItems(
  orderFormId: string,
  updates: Array<{ index: number; quantity: number }>
): Promise<OrderForm> {
  const of = await vtexFetch<OrderForm>(
    `/api/checkout/pub/orderForm/${orderFormId}/items`,
    {
      method: 'PATCH',
      body: { orderItems: updates },
    }
  );
  storeId(of.orderFormId);
  return of;
}

export function findItemIndex(orderForm: OrderForm, skuId: string): number {
  return orderForm.items.findIndex(item => item.id === skuId || item.uniqueId === skuId);
}

export function redirectToCheckout(orderFormId?: string): void {
  const id = orderFormId || getStoredId();
  if (!id) return;
  window.location.href = `${VTEX_CONFIG.checkoutUrl}/?orderFormId=${id}#/cart`;
}

// ============================================================
// HELPERS
// ============================================================

export function getItemCount(of: OrderForm): number {
  return of.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getSubtotal(of: OrderForm): number {
  return of.totalizers.find(t => t.id === 'Items')?.value ?? 0;
}

export function getDiscounts(of: OrderForm): number {
  return Math.abs(of.totalizers.find(t => t.id === 'Discounts')?.value ?? 0);
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// ============================================================
// SIMULATION — single SKU (backward compat)
// ============================================================

export interface SimulationResult {
  price: number;       // in dollars
  available: boolean;
  listPrice: number;   // in dollars
}

export async function simulateForSeller(
  skuId: string,
  sellerId: string,
  quantity = 1
): Promise<SimulationResult> {
  const results = await simulateBatch([{ id: skuId, quantity, seller: sellerId }]);
  return results.get(skuId) ?? { price: 0, available: false, listPrice: 0 };
}

// ============================================================
// SIMULATION — batched (multiple SKUs in one request)
// ============================================================

export async function simulateBatch(
  items: Array<{ id: string; quantity: number; seller: string }>
): Promise<Map<string, SimulationResult>> {
  const data = await vtexFetch<any>(
    '/api/checkout/pub/orderForms/simulation',
    {
      method: 'POST',
      body: {
        items,
        country: 'USA',
      },
      params: { sc: VTEX_CONFIG.salesChannel },
    }
  );

  const results = new Map<string, SimulationResult>();
  for (const item of data.items || []) {
    results.set(item.id, {
      price: item.sellingPrice ? item.sellingPrice / 100 : (item.price ? item.price / 100 : 0),
      listPrice: item.listPrice ? item.listPrice / 100 : 0,
      available: item.availability === 'available',
    });
  }
  return results;
}
