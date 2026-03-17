import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, Store, Package, Plus, Minus, ChevronRight, X, ShoppingCart, Clock, ChefHat, Loader2, AlertTriangle } from "lucide-react";
import { Product } from "@/data/products";
import { getProductById, searchProducts } from "@/api/searchApi";
import { vtexProductToProduct, vtexProductsToProducts } from "@/api/vtexAdapter";
import { simulateForSeller } from "@/api/checkoutApi";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductName, getProductSubName, getProductDescription } from "@/lib/product-utils";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import recipeTteokbokki from "@/assets/recipe-tteokbokki.jpg";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem, selectedSellerId, selectedStore } = useCart();
  const { t, language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [showPairDrawer, setShowPairDrawer] = useState(false);
  const [selectedFulfillment, setSelectedFulfillment] = useState<"delivery" | "pickup">("delivery");

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sellerPrice, setSellerPrice] = useState<{ price: number; available: boolean; listPrice: number } | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getProductById(id)
      .then((vtexProduct) => {
        if (vtexProduct) {
          const p = vtexProductToProduct(vtexProduct);
          setProduct(p);
          const first = p.fulfillment.find(f => f === "delivery" || f === "pickup") as "delivery" | "pickup" | undefined;
          setSelectedFulfillment(first || "delivery");
        } else {
          setProduct(null);
        }
      })
      .catch((err) => {
        console.error('PDP fetch error:', err);
        setProduct(null);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // Simulate price/availability for selected franchise seller
  useEffect(() => {
    if (!product) return;
    const skuId = (product as any)._vtex?.skuId;
    if (!skuId) return;

    setSimulating(true);
    simulateForSeller(skuId, selectedSellerId)
      .then(setSellerPrice)
      .catch((err) => {
        console.error('Simulation error:', err);
        setSellerPrice(null);
      })
      .finally(() => setSimulating(false));
  }, [product, selectedSellerId]);

  useEffect(() => {
    searchProducts({ query: '', count: 4 })
      .then((res) => {
        const related = vtexProductsToProducts(res.products).filter(p => p.id !== product?.id);
        setRelatedProducts(related.slice(0, 4));
      })
      .catch(console.error);
  }, [product?.id]);

  // Determine display price: use simulation result when available, fallback to IS price
  const displayPrice = sellerPrice?.available && sellerPrice.price > 0 ? sellerPrice.price : product?.price ?? 0;
  const displayListPrice = sellerPrice?.available && sellerPrice.listPrice > 0 ? sellerPrice.listPrice : product?.originalPrice;
  const isUnavailable = sellerPrice !== null && !sellerPrice.available;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="py-32 text-center">
          <p className="text-lg font-medium text-foreground">Product not found</p>
          <Link to="/products" className="mt-2 inline-block text-sm text-primary hover:underline">Browse products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const pairProduct = relatedProducts[0] || null;

  const displayName = getProductName(product, language);
  const subName = getProductSubName(product, language);
  const description = getProductDescription(product, language);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="hmart-container py-6">
        <nav className="mb-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">{t("detail.home")}</Link>
          <span className="mx-2">›</span>
          <Link to="/products" className="hover:text-primary">{t("detail.products")}</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground font-medium">{displayName}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden rounded-xl bg-card"
          >
            <img src={product.image} alt={displayName} className="h-full w-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {product.isSponsored && <span className="sponsored-badge mb-2 inline-block">{t("brands.sponsored")}</span>}
            {product.isNew && (
              <span className="mb-2 inline-block rounded-sm bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">{t("product.new")}</span>
            )}

            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{product.brand}</p>
            <h1 className="mt-1 font-display text-3xl font-medium text-foreground">
              {displayName}
              {subName && <span className="ml-3 text-xl text-muted-foreground">{subName}</span>}
            </h1>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString()} {t("product.reviews")})</span>
            </div>

            {/* Price section with simulation data */}
            <div className="mt-4">
              {simulating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Checking price at {selectedStore || "your store"}…</span>
                </div>
              ) : isUnavailable ? (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Unavailable at {selectedStore || "your store"}</p>
                    <p className="text-xs text-muted-foreground">Try selecting a different store location.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">${displayPrice.toFixed(2)}</span>
                  {displayListPrice && displayListPrice > displayPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">${displayListPrice.toFixed(2)}</span>
                      <span className="rounded-sm bg-accent/20 px-2 py-0.5 text-sm font-semibold text-accent-foreground">
                        {t("product.save")} ${(displayListPrice - displayPrice).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              )}
              {!isUnavailable && !simulating && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Price at <span className="font-medium text-foreground">{selectedStore || "your store"}</span> · {product.weight}
                </p>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>

            <div className="mt-6">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("detail.howToGet")}</h3>
              <div className="flex flex-wrap gap-2">
                {product.fulfillment.includes("delivery") && (
                  <button
                    onClick={() => setSelectedFulfillment("delivery")}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${selectedFulfillment === "delivery" ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:bg-secondary"}`}
                  >
                    <Truck className="h-4 w-4" />
                    <div className="text-left">
                      <p>{t("product.delivery")}</p>
                      <p className="text-[10px] font-normal text-muted-foreground">{t("detail.deliveryToday")}</p>
                    </div>
                  </button>
                )}
                {product.fulfillment.includes("pickup") && (
                  <button
                    onClick={() => setSelectedFulfillment("pickup")}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${selectedFulfillment === "pickup" ? "border-green-600 bg-green-50 text-green-700" : "border-border text-foreground hover:bg-secondary"}`}
                  >
                    <Store className="h-4 w-4" />
                    <div className="text-left">
                      <p>{t("product.pickup")}</p>
                      <p className="text-[10px] font-normal text-muted-foreground">{t("detail.readyIn2h")}</p>
                    </div>
                  </button>
                )}
              </div>
              {product.storeName && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("detail.from")} <span className="font-medium text-foreground">{selectedStore || "your store"}</span>
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-foreground transition-colors hover:bg-secondary"
                  disabled={isUnavailable}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-foreground transition-colors hover:bg-secondary"
                  disabled={isUnavailable}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => addItem(product, quantity)}
                disabled={isUnavailable}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-body text-sm font-semibold transition-transform ${
                  isUnavailable
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-95"
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                {isUnavailable
                  ? `Unavailable at ${selectedStore || "your store"}`
                  : `${t("product.addToCart")} — $${(displayPrice * quantity).toFixed(2)}`}
              </button>

              <button
                onClick={() => setShowPairDrawer(true)}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                title={t("detail.perfectPair")}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>

        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-medium text-foreground">{t("detail.youMightLike")}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* Perfect Pair Drawer */}
      <AnimatePresence>
        {showPairDrawer && pairProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-hmart-charcoal/40"
              onClick={() => setShowPairDrawer(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-md overflow-y-auto bg-card shadow-2xl"
            >
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display text-xl font-medium text-foreground">{t("detail.perfectPair")}</h3>
                  <button onClick={() => setShowPairDrawer(false)} className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <div className="flex gap-4">
                    <img src={product.image} alt={displayName} className="h-20 w-20 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                      <p className="text-sm font-medium text-foreground">{displayName}</p>
                      <p className="text-sm font-bold text-foreground">${displayPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="my-4 flex items-center justify-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">+</span>
                  </div>

                  <div className="flex gap-4">
                    <img src={pairProduct.image} alt={getProductName(pairProduct, language)} className="h-20 w-20 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs text-muted-foreground">{pairProduct.brand}</p>
                      <p className="text-sm font-medium text-foreground">{getProductName(pairProduct, language)}</p>
                      <p className="text-sm font-bold text-foreground">${pairProduct.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl">
                  <img src={recipeTteokbokki} alt="Tteokbokki" className="aspect-video w-full object-cover" />
                  <div className="bg-secondary/50 p-4">
                    <div className="flex items-center gap-1.5 text-primary">
                      <ChefHat className="h-4 w-4" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">{t("detail.suggestedRecipe")}</span>
                    </div>
                    <h4 className="mt-1 font-display text-lg font-medium text-foreground">{t("recipe.title")} 떡볶이</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{t("recipe.desc").slice(0, 80)}...</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t("recipe.time")}</span>
                      <span>{t("detail.serves")}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("detail.bundleTotal")}</span>
                    <span className="text-lg font-bold text-foreground">
                      ${(displayPrice + pairProduct.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addItem(product);
                    addItem(pairProduct);
                    setShowPairDrawer(false);
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t("detail.addBoth")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
