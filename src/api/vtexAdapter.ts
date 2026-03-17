import { Product } from '@/data/products';
import { ISProduct, getDefaultSku, getBestOffer, getMainImage } from './searchApi';

export function vtexProductToProduct(vtexProduct: ISProduct): Product {
  const sku = getDefaultSku(vtexProduct);
  const offer = sku ? getBestOffer(sku) : null;
  const price = offer?.commertialOffer?.Price ?? 0;
  const listPrice = offer?.commertialOffer?.ListPrice ?? 0;
  const hasDiscount = listPrice > price;
  const imageUrl = sku ? getMainImage(sku) : '';
  const isAvailable = offer?.commertialOffer?.IsAvailable ?? false;

  // Extract weight from specifications if available
  const weightSpec = vtexProduct.skuSpecifications?.find(
    s => s.field.name.toLowerCase().includes('weight') || s.field.name.toLowerCase().includes('peso')
  );
  const weight = weightSpec?.values?.[0]?.name || sku?.name || '';

  return {
    id: vtexProduct.productId,
    name: vtexProduct.productName,
    brand: vtexProduct.brand || '',
    price: price,
    originalPrice: hasDiscount ? listPrice : undefined,
    image: imageUrl,
    category: vtexProduct.categories?.[0]?.replace(/^\//,'').replace(/\/$/,'') || '',
    weight: weight,
    inStock: isAvailable,
    isSponsored: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 0,
    fulfillment: ['delivery', 'pickup', 'shipping'],
    description: vtexProduct.description || '',
    storeName: 'H Mart',
    _vtex: {
      productId: vtexProduct.productId,
      skuId: sku?.itemId || '',
      sellerId: offer?.sellerId || '1',
      linkText: vtexProduct.linkText,
    },
  };
}

export function vtexProductsToProducts(vtexProducts: ISProduct[]): Product[] {
  return vtexProducts.map(vtexProductToProduct);
}
