import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Plus, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className={`product-card ${featured ? "col-span-2 row-span-2" : ""}`}>
      {product.isSponsored && (
        <div className="absolute left-2 top-2 z-10">
          <span className="sponsored-badge">Sponsored</span>
        </div>
      )}
      {product.isNew && (
        <div className="absolute left-2 top-2 z-10">
          <span className="inline-flex items-center rounded-sm bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
            New!
          </span>
        </div>
      )}
      {product.originalPrice && (
        <div className="absolute right-2 top-2 z-10">
          <span className="inline-flex items-center rounded-sm bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
            Save ${(product.originalPrice - product.price).toFixed(2)}
          </span>
        </div>
      )}

      <Link to={`/product/${product.id}`}>
        <div className="product-card-image">
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>
      </Link>

      <div className="p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-0.5 text-sm font-medium leading-tight text-foreground hover:text-primary">
            {product.name}
            {product.nameKo && <span className="ml-1.5 text-muted-foreground">{product.nameKo}</span>}
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
            <span className="text-[10px] font-medium text-primary">Delivery</span>
          )}
          {product.fulfillment.includes("pickup") && (
            <span className="text-[10px] font-medium text-green-600">Pickup</span>
          )}
          {product.fulfillment.includes("shipping") && (
            <span className="text-[10px] font-medium text-blue-600">Ship</span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-95"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
