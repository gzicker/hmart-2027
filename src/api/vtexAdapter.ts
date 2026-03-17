import { Product } from '@/data/products';
import { ISProduct, getDefaultSku, getBestOffer, getMainImage } from './searchApi';

export function vtexProductToProduct(vtexProduct: ISProduct): Product {
  // Get first SKU
  const sku = vtexProduct.items?.[0];
  // Get first seller from that SKU
  const seller = sku?.sellers?.[0];
  // Get commercial offer
  const offer = seller?.commertialOffer;

  // Extract prices - VTEX returns prices as decimals (e.g. 4.99), not cents
  const price = offer?.Price ?? 0;
  const listPrice = offer?.ListPrice ?? 0;
  const hasDiscount = listPrice > 0 && listPrice > price;
  const isAvailable = (offer?.AvailableQuantity ?? 0) > 0;

  // Extract image URL
  const imageUrl = sku?.images?.[0]?.imageUrl ?? '';

  return {
    id: vtexProduct.productId,
    name: vtexProduct.productName,
    brand: vtexProduct.brand || 'H Mart',
    price: price,
    originalPrice: hasDiscount ? listPrice : undefined,
    image: imageUrl,
    category: vtexProduct.categories?.[0]?.replace(/^\//, '').replace(/\/$/, '').split('/').pop() || '',
    weight: sku?.nameComplete || sku?.name || '',
    inStock: isAvailable,
    isSponsored: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 0,
    fulfillment: ['delivery', 'pickup'] as ("delivery" | "pickup")[],
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
