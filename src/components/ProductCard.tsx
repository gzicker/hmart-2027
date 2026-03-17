import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductName, getProductSubName } from "@/lib/product-utils";
import { useProductSellerSimulation } from "@/hooks/useSellerSimulation";
import { Plus, Star, AlertTriangle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  hideIfUnavailable?: boolean;
}

export default function ProductCard({ product, featured, hideIfUnavailable }: ProductCardProps) {
  const { addItem, selectedSellerId } = useCart();
  const { t, language } = useLanguage();

  const displayName = getProductName(product, language);
  const subName = getProductSubName(product, language);
  const simulation = useProductSellerSimulation(product, selectedSellerId);

  const isUnavailable = simulation ? !simulation.available : false;
  const displayPrice = simulation?.available && simulation.price > 0 ? simulation.price : product.price;
  const displayListPrice = simulation?.available && simulation.listPrice > 0 ? simulation.listPrice : product.originalPrice;

  if (hideIfUnavailable && isUnavailable) return null;

  return (
    <div className={`product-card group ${featured ? "col-span-2 row-span-2" : ""} ${isUnavailable ? "opacity-60" : ""}`}>
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

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3
            className="mt-0.5 text-sm font-medium leading-tight text-foreground line-clamp-2 group-hover:line-clamp-3 hover:text-primary"
            title={`${displayName}${subName ? ` ${subName}` : ""}`}
          >
            {displayName}
          </h3>
          {subName && (
            <p
              className="mt-0.5 text-xs leading-tight text-muted-foreground line-clamp-1 group-hover:line-clamp-2"
              title={subName}
            >
              {subName}
            </p>
          )}
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
        </div>

        {isUnavailable ? (
          <div className="mt-auto flex items-center gap-1.5 pt-2">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-medium text-destructive">Unavailable</span>
          </div>
        ) : (
          <div className="mt-auto flex items-center justify-between pt-2">
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
