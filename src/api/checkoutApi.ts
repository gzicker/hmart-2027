import { vtexFetch, VTEX_CONFIG } from './vtexConfig';

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
  price: number;
  listPrice: number;
  sellingPrice: number;
}

export interface OrderForm {
  orderFormId: string;
  items: OrderFormItem[];
  totalizers: { id: string; name: string; value: number }[];
  value: number;
  messages: { code: string | null; status: string; text: string }[];
}

const ORDERFORM_KEY = 'vtex_orderFormId';

function getStoredOrderFormId(): string | null {
  try { return localStorage.getItem(ORDERFORM_KEY); } catch { return null; }
}

function storeOrderFormId(id: string): void {
  try { localStorage.setItem(ORDERFORM_KEY, id); } catch {}
}

export async function getOrCreateOrderForm(): Promise<OrderForm> {
  const storedId = getStoredOrderFormId();
  if (storedId) {
    try {
      const of = await vtexFetch<OrderForm>(`/api/checkout/pub/orderForm/${storedId}`, {
        params: { sc: VTEX_CONFIG.salesChannel },
      });
      storeOrderFormId(of.orderFormId);
      return of;
    } catch {
      localStorage.removeItem(ORDERFORM_KEY);
    }
  }
  const of = await vtexFetch<OrderForm>('/api/checkout/pub/orderForm', {
    params: { sc: VTEX_CONFIG.salesChannel },
  });
  storeOrderFormId(of.orderFormId);
  return of;
}

export async function addToCart(orderFormId: string, items: Array<{ id: string; quantity: number; seller: string }>): Promise<OrderForm> {
  const of = await vtexFetch<OrderForm>(`/api/checkout/pub/orderForm/${orderFormId}/items`, {
    method: 'POST',
    body: { orderItems: items },
    params: { sc: VTEX_CONFIG.salesChannel },
  });
  storeOrderFormId(of.orderFormId);
  return of;
}

export async function updateCartItems(orderFormId: string, items: Array<{ index: number; quantity: number }>): Promise<OrderForm> {
  const of = await vtexFetch<OrderForm>(`/api/checkout/pub/orderForm/${orderFormId}/items`, {
    method: 'PATCH',
    body: { orderItems: items },
  });
  storeOrderFormId(of.orderFormId);
  return of;
}

export function redirectToCheckout(orderFormId?: string): void {
  const id = orderFormId || getStoredOrderFormId();
  if (!id) return;
  window.location.href = `${VTEX_CONFIG.checkoutUrl}/?orderFormId=${id}#/cart`;
}

export async function simulateForSeller(
  skuId: string,
  sellerId: string,
  quantity = 1
): Promise<{ price: number; available: boolean; listPrice: number }> {
  const data = await vtexFetch<any>(
    '/api/checkout/pub/orderForms/simulation',
    {
      method: 'POST',
      body: {
        items: [{ id: skuId, quantity, seller: sellerId }],
        country: 'USA',
      },
      params: { sc: VTEX_CONFIG.salesChannel },
    }
  );

  const item = data.items?.[0];
  if (!item || item.availability !== 'available') {
    return { price: 0, available: false, listPrice: 0 };
  }

  return {
    price: item.sellingPrice ? item.sellingPrice / 100 : item.price || 0,
    listPrice: item.listPrice ? item.listPrice / 100 : 0,
    available: true,
  };
}
