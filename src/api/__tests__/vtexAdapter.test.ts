import { describe, it, expect } from 'vitest';
import { vtexProductToProduct } from '@/api/vtexAdapter';
import type { ISProduct } from '@/api/searchApi';

const sampleVtexProduct: ISProduct = {
  productId: '123',
  productName: 'Test Gochujang',
  brand: 'CJ',
  brandId: 1,
  link: '/test-gochujang/p',
  linkText: 'test-gochujang',
  description: 'A spicy paste',
  categories: ['/Sauces/Gochujang/'],
  categoryId: '10',
  priceRange: {
    sellingPrice: { highPrice: 8.99, lowPrice: 8.99 },
    listPrice: { highPrice: 10.99, lowPrice: 10.99 },
  },
  items: [
    {
      itemId: 'sku-456',
      name: '500g',
      nameComplete: 'Test Gochujang 500g',
      ean: '',
      referenceId: [],
      images: [
        { imageId: 'img1', imageUrl: 'https://example.com/img.jpg', imageLabel: 'main', imageText: '' },
      ],
      variations: [],
      sellers: [
        {
          sellerId: '1',
          sellerName: 'H Mart',
          sellerDefault: true,
          commertialOffer: {
            Price: 8.99,
            ListPrice: 10.99,
            AvailableQuantity: 50,
            IsAvailable: true,
            Installments: [],
          },
        },
        {
          sellerId: '2',
          sellerName: 'Partner',
          sellerDefault: false,
          commertialOffer: {
            Price: 9.49,
            ListPrice: 9.49,
            AvailableQuantity: 0,
            IsAvailable: false,
            Installments: [],
          },
        },
      ],
    },
  ],
};

describe('vtexProductToProduct', () => {
  it('maps basic product fields correctly', () => {
    const result = vtexProductToProduct(sampleVtexProduct);
    expect(result.id).toBe('123');
    expect(result.name).toBe('Test Gochujang');
    expect(result.brand).toBe('CJ');
    expect(result.description).toBe('A spicy paste');
  });

  it('extracts price and originalPrice from first seller offer', () => {
    const result = vtexProductToProduct(sampleVtexProduct);
    expect(result.price).toBe(8.99);
    expect(result.originalPrice).toBe(10.99);
  });

  it('sets originalPrice to undefined when no discount', () => {
    const noDiscount: ISProduct = {
      ...sampleVtexProduct,
      items: [{
        ...sampleVtexProduct.items[0],
        sellers: [{
          ...sampleVtexProduct.items[0].sellers[0],
          commertialOffer: {
            Price: 8.99,
            ListPrice: 8.99,
            AvailableQuantity: 10,
            IsAvailable: true,
            Installments: [],
          },
        }],
      }],
    };
    const result = vtexProductToProduct(noDiscount);
    expect(result.originalPrice).toBeUndefined();
  });

  it('extracts image URL from first SKU', () => {
    const result = vtexProductToProduct(sampleVtexProduct);
    expect(result.image).toBe('https://example.com/img.jpg');
  });

  it('extracts category from categories path', () => {
    const result = vtexProductToProduct(sampleVtexProduct);
    expect(result.category).toBe('Gochujang');
  });

  it('does NOT assign fake ratings or fulfillment', () => {
    const result = vtexProductToProduct(sampleVtexProduct);
    expect(result.rating).toBe(0);
    expect(result.reviewCount).toBe(0);
    expect(result.fulfillment).toEqual([]);
  });

  it('maps _vtex metadata including all sellers', () => {
    const result = vtexProductToProduct(sampleVtexProduct);
    expect(result._vtex).toBeDefined();
    expect(result._vtex!.productId).toBe('123');
    expect(result._vtex!.skuId).toBe('sku-456');
    expect(result._vtex!.sellerId).toBe('1');
    expect(result._vtex!.sellers).toHaveLength(2);
    expect(result._vtex!.sellers![0].available).toBe(true);
    expect(result._vtex!.sellers![1].available).toBe(false);
  });

  it('marks product inStock based on first seller availability', () => {
    const result = vtexProductToProduct(sampleVtexProduct);
    expect(result.inStock).toBe(true);
  });

  it('handles empty items array gracefully', () => {
    const empty: ISProduct = { ...sampleVtexProduct, items: [] };
    const result = vtexProductToProduct(empty);
    expect(result.image).toBe('');
    expect(result.price).toBe(0);
    expect(result._vtex?.skuId).toBe('');
  });
});
