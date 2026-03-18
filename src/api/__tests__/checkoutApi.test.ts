import { describe, it, expect } from 'vitest';
import { formatCents, getItemCount, getSubtotal, getDiscounts, findItemIndex } from '@/api/checkoutApi';
import type { OrderForm } from '@/api/checkoutApi';

describe('formatCents', () => {
  it('formats cents to dollar string', () => {
    expect(formatCents(999)).toBe('$9.99');
    expect(formatCents(0)).toBe('$0.00');
    expect(formatCents(100)).toBe('$1.00');
    expect(formatCents(1)).toBe('$0.01');
    expect(formatCents(12345)).toBe('$123.45');
  });

  it('handles negative cents', () => {
    expect(formatCents(-500)).toBe('$-5.00');
  });
});

const mockOrderForm: OrderForm = {
  orderFormId: 'test-123',
  items: [
    {
      id: 'sku-1', productId: 'p1', name: 'Item 1', skuName: 'SKU 1',
      imageUrl: '', detailUrl: '', quantity: 2, uniqueId: 'u1',
      seller: '1', sellerName: 'Seller', price: 999, listPrice: 1299,
      sellingPrice: 899, isGift: false, availability: 'available',
      measurementUnit: 'un', unitMultiplier: 1,
    },
    {
      id: 'sku-2', productId: 'p2', name: 'Item 2', skuName: 'SKU 2',
      imageUrl: '', detailUrl: '', quantity: 1, uniqueId: 'u2',
      seller: '1', sellerName: 'Seller', price: 500, listPrice: 500,
      sellingPrice: 500, isGift: false, availability: 'available',
      measurementUnit: 'un', unitMultiplier: 1,
    },
  ],
  totalizers: [
    { id: 'Items', name: 'Items Total', value: 2298 },
    { id: 'Discounts', name: 'Discounts', value: -200 },
  ],
  value: 2098,
  salesChannel: '1',
  loggedIn: false,
  canEditData: true,
  messages: [],
  marketingData: null,
  clientProfileData: null,
  shippingData: null,
  paymentData: null,
  ratesAndBenefitsData: null,
  selectableGifts: [],
};

describe('getItemCount', () => {
  it('sums all item quantities', () => {
    expect(getItemCount(mockOrderForm)).toBe(3); // 2 + 1
  });

  it('returns 0 for empty items', () => {
    expect(getItemCount({ ...mockOrderForm, items: [] })).toBe(0);
  });
});

describe('getSubtotal', () => {
  it('returns Items totalizer value', () => {
    expect(getSubtotal(mockOrderForm)).toBe(2298);
  });

  it('returns 0 when no Items totalizer', () => {
    expect(getSubtotal({ ...mockOrderForm, totalizers: [] })).toBe(0);
  });
});

describe('getDiscounts', () => {
  it('returns absolute value of Discounts totalizer', () => {
    expect(getDiscounts(mockOrderForm)).toBe(200);
  });

  it('returns 0 when no Discounts totalizer', () => {
    expect(getDiscounts({ ...mockOrderForm, totalizers: [] })).toBe(0);
  });
});

describe('findItemIndex', () => {
  it('finds item by SKU id', () => {
    expect(findItemIndex(mockOrderForm, 'sku-1')).toBe(0);
    expect(findItemIndex(mockOrderForm, 'sku-2')).toBe(1);
  });

  it('finds item by uniqueId', () => {
    expect(findItemIndex(mockOrderForm, 'u1')).toBe(0);
  });

  it('returns -1 for missing item', () => {
    expect(findItemIndex(mockOrderForm, 'nonexistent')).toBe(-1);
  });
});
