import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductName, getProductSubName } from "@/lib/product-utils";
import { simulateForSeller } from "@/api/checkoutApi";
import { Plus, Star, AlertTriangle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  hideIfUnavailable?: boolean;
}

export default function ProductCard({ product, featured, hideIfUnavailable }: ProductCardProps) {
  const { addItem, selectedSellerId, selectedStore } = useCart();
  const { t, language } = useLanguage();

  const displayName = getProductName(product, language);
  const subName = getProductSubName(product, language);

  const [sellerPrice, setSellerPrice] = useState<{ price: number; available: boolean; listPrice: number } | null>(null);

  useEffect(() => {
    const skuId = (product as any)._vtex?.skuId;
    if (!skuId) return;

    simulateForSeller(skuId, selectedSellerId)
      .then(setSellerPrice)
      .catch(() => setSellerPrice(null));
  }, [product, selectedSellerId]);

  const displayPrice = sellerPrice?.available && sellerPrice.price > 0 ? sellerPrice.price : product.price;
  const displayListPrice = sellerPrice?.available && sellerPrice.listPrice > 0 ? sellerPrice.listPrice : product.originalPrice;
  const isUnavailable = sellerPrice !== null && !sellerPrice.available;

  if (hideIfUnavailable && isUnavailable) return null;

  return (
    <div className={`product-card ${featured ? "col-span-2 row-span-2" : ""} ${isUnavailable ? "opacity-60" : ""}`}>
      {product.isSponsored && (
        <div className="absolute left-2 top-2 z-10">
          <span className="sponsored-badge">{t("brands.sponsored")}</span>
        </div>
      )}
      {product.isNew && (
        <div className="absolute left-2 top-2 z-10">
          <span className="inline-flex items-center rounded-sm bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
            {t("product.new")}
          </span>
        </div>
      )}
      {displayListPrice && displayListPrice > displayPrice && !isUnavailable && (
        <div className="absolute right-2 top-2 z-10">
          <span className="inline-flex items-center rounded-sm bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
            {t("product.save")} ${(displayListPrice - displayPrice).toFixed(2)}
          </span>
        </div>
      )}

      <Link to={`/product/${product.id}`}>
        <div className="product-card-image">
          <img src={product.image} alt={displayName} loading="lazy" />
        </div>
      </Link>

      <div className="p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-0.5 text-sm font-medium leading-tight text-foreground hover:text-primary">
            {displayName}
            {subName && <span className="ml-1.5 text-muted-foreground">{subName}</span>}
          </h3>
        </Link>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{product.weight}</p>

        <div className="mt-1.5 flex items-center gap-1">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span className="text-xs font-medium text-foreground">{product.rating}</span>
          <span className="text-[10px] text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5">
          {product.fulfillment.includes("delivery") && (
            <span className="text-[10px] font-medium text-primary">{t("product.delivery")}</span>
          )}
          {product.fulfillment.includes("pickup") && (
            <span className="text-[10px] font-medium text-green-600">{t("product.pickup")}</span>
          )}
          {product.fulfillment.includes("shipping") && (
            <span className="text-[10px] font-medium text-blue-600">{t("product.ship")}</span>
          )}
        </div>

        {isUnavailable ? (
          <div className="mt-2 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-medium text-destructive">Unavailable</span>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-foreground">${displayPrice.toFixed(2)}</span>
              {displayListPrice && displayListPrice > displayPrice && (
                <span className="text-xs text-muted-foreground line-through">${displayListPrice.toFixed(2)}</span>
              )}
            </div>
            <button
              onClick={() => addItem(product)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
