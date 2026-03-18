import { Product } from '@/data/products';
import { ISProduct } from './searchApi';

export function vtexProductToProduct(vtexProduct: ISProduct): Product {
  const sku = vtexProduct.items?.[0];
  const seller = sku?.sellers?.[0];
  const offer = seller?.commertialOffer;

  const price = offer?.Price ?? 0;
  const listPrice = offer?.ListPrice ?? 0;
  const hasDiscount = listPrice > 0 && listPrice > price;
  const isAvailable = (offer?.AvailableQuantity ?? 0) > 0;

  const imageUrl = sku?.images?.[0]?.imageUrl ?? '';

  return {
    id: vtexProduct.productId,
    name: vtexProduct.productName,
    brand: vtexProduct.brand || 'H Mart',
    price,
    originalPrice: hasDiscount ? listPrice : undefined,
    image: imageUrl,
    category: vtexProduct.categories?.[0]?.replace(/^\//, '').replace(/\/$/, '').split('/').pop() || '',
    weight: sku?.nameComplete || sku?.name || '',
    inStock: isAvailable,
    isSponsored: false,
    isNew: false,
    // No fake ratings — 0 means "no data", UI will hide the rating display
    rating: 0,
    reviewCount: 0,
    // Empty array — actual fulfillment comes from simulation/logistics, not hardcoded
    fulfillment: [],
    description: vtexProduct.description || vtexProduct.productName,
    storeName: 'H Mart',
    _vtex: {
      productId: vtexProduct.productId,
      skuId: sku?.itemId || '',
      sellerId: seller?.sellerId || '1',
      linkText: vtexProduct.linkText,
      sellers: sku?.sellers?.map(s => ({
        sellerId: s.sellerId,
        price: s.commertialOffer?.Price ?? 0,
        listPrice: s.commertialOffer?.ListPrice ?? 0,
        available: (s.commertialOffer?.AvailableQuantity ?? 0) > 0 && (s.commertialOffer?.IsAvailable ?? false),
      })) || [],
    },
  };
}

export function vtexProductsToProducts(vtexProducts: ISProduct[]): Product[] {
  return vtexProducts.map(vtexProductToProduct);
}
