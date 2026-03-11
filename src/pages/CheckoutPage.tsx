import { useState } from "react";
import { Link } from "react-router-dom";
import { Truck, Store, Package, Minus, Plus, Trash2, ShieldCheck, CreditCard, MapPin, ChevronRight, Crown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProductName } from "@/lib/product-utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const {
    items, updateQuantity, removeItem, totalPrice,
    fulfillmentMethod, setFulfillmentMethod, selectedStore,
  } = useCart();
  const { t, language } = useLanguage();

  const [hmartPlus, setHmartPlus] = useState(false);
  const hmartPlusFee = hmartPlus ? 9.99 : 0;
  const deliveryFee = fulfillmentMethod === "delivery" ? 5.99 : fulfillmentMethod === "shipping" ? 9.99 : 0;
  const tax = (totalPrice + hmartPlusFee) * 0.08875;
  const grandTotal = totalPrice + deliveryFee + hmartPlusFee + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="hmart-container flex flex-col items-center justify-center py-24 text-center">
          <h1 className="font-display text-3xl font-medium text-foreground">{t("checkout.emptyCart")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("checkout.emptyDesc")}</p>
          <Link to="/products" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
            {t("checkout.continueShopping")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="hmart-container py-6">
        <nav className="mb-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">{t("detail.home")}</Link>
          <span className="mx-2">›</span>
          <span className="font-medium text-foreground">{t("checkout.title")}</span>
        </nav>

        <h1 className="mb-8 font-display text-3xl font-medium text-foreground">{t("checkout.title")}</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Fulfillment Selection */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-lg font-medium text-foreground">{t("checkout.fulfillmentMethod")}</h2>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setFulfillmentMethod("delivery")}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors ${fulfillmentMethod === "delivery" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"}`}
                >
                  <Truck className={`h-6 w-6 ${fulfillmentMethod === "delivery" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium text-foreground">{t("checkout.delivery")}</span>
                  <span className="text-[10px] text-muted-foreground">{t("checkout.deliveryTime")}</span>
                </button>
                <button
                  onClick={() => setFulfillmentMethod("pickup")}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors ${fulfillmentMethod === "pickup" ? "border-green-600 bg-green-50" : "border-border hover:bg-secondary"}`}
                >
                  <Store className={`h-6 w-6 ${fulfillmentMethod === "pickup" ? "text-green-600" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium text-foreground">{t("checkout.pickup")}</span>
                  <span className="text-[10px] text-muted-foreground">{t("checkout.pickupTime")}</span>
                </button>
                <button
                  onClick={() => setFulfillmentMethod("shipping")}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors ${fulfillmentMethod === "shipping" ? "border-blue-600 bg-blue-50" : "border-border hover:bg-secondary"}`}
                >
                  <Package className={`h-6 w-6 ${fulfillmentMethod === "shipping" ? "text-blue-600" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium text-foreground">{t("checkout.ship")}</span>
                  <span className="text-[10px] text-muted-foreground">{t("checkout.shipTime")}</span>
                </button>
              </div>

              {fulfillmentMethod !== "shipping" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    {fulfillmentMethod === "delivery" ? t("checkout.deliveringFrom") : t("checkout.pickupAt")}{" "}
                    <span className="font-medium text-foreground">{selectedStore}</span>
                  </span>
                  <button className="ml-auto text-xs font-medium text-primary">{t("checkout.change")}</button>
                </div>
              )}

              {fulfillmentMethod === "shipping" && (
                <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                  <p className="text-sm font-medium text-foreground">{t("checkout.shipTo")}</p>
                  <p className="text-xs text-muted-foreground">124 Main St, New York, NY 10001</p>
                  <button className="mt-1 text-xs font-medium text-primary">{t("checkout.changeAddress")}</button>
                </div>
              )}
            </div>

            {/* H Mart Plus Sign Up */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <button
                onClick={() => setHmartPlus(!hmartPlus)}
                className={`flex w-full items-center gap-3 rounded-lg border-2 p-4 transition-all ${hmartPlus ? "border-primary bg-primary/10 shadow-sm" : "border-primary/20 bg-card hover:border-primary/40"}`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-foreground">{t("checkout.joinPlus")}</p>
                  <p className="text-[11px] text-muted-foreground">{t("checkout.plusBenefits")}</p>
                </div>
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">$9.99/mo</span>
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${hmartPlus ? "border-primary bg-primary" : "border-primary/40"}`}>
                  {hmartPlus && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </button>
            </div>

            {/* Cart Items */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-lg font-medium text-foreground">
                {t("checkout.yourItems")} ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <div className="divide-y divide-border">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <Link to={`/product/${product.id}`}>
                      <img src={product.image} alt={getProductName(product, language)} className="h-20 w-20 rounded-lg object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-[11px] text-muted-foreground">{product.brand}</p>
                        <Link to={`/product/${product.id}`} className="text-sm font-medium text-foreground hover:text-primary">
                          {getProductName(product, language)}
                        </Link>
                        <p className="text-[11px] text-muted-foreground">{product.weight}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded border border-border">
                          <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2 py-1 text-muted-foreground hover:text-foreground">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[1.5rem] text-center text-xs font-semibold">{quantity}</span>
                          <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2 py-1 text-muted-foreground hover:text-foreground">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(product.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">${(product.price * quantity).toFixed(2)}</p>
                      {product.originalPrice && (
                        <p className="text-[11px] text-muted-foreground line-through">${(product.originalPrice * quantity).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-lg font-medium text-foreground">{t("checkout.paymentMethod")}</h2>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
                  <p className="text-[11px] text-muted-foreground">Visa · Expires 12/28</p>
                </div>
                <button className="ml-auto text-xs font-medium text-primary">{t("checkout.change")}</button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-28 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-lg font-medium text-foreground">{t("checkout.orderSummary")}</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
                  <span className="font-medium text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {fulfillmentMethod === "delivery" ? t("checkout.deliveryFee") : fulfillmentMethod === "shipping" ? t("checkout.shipping") : t("checkout.pickup")}
                  </span>
                  <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-foreground"}`}>
                    {deliveryFee === 0 ? t("checkout.free") : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {hmartPlus && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.hmartPlus")}</span>
                    <span className="font-medium text-foreground">$9.99</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("checkout.tax")}</span>
                  <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                </div>

                {totalPrice >= 49 && fulfillmentMethod === "delivery" && (
                  <div className="rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                    {t("checkout.freeDelivery")}
                  </div>
                )}

                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">{t("checkout.total")}</span>
                    <span className="text-xl font-bold text-foreground">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95">
                {t("checkout.placeOrder")} <ChevronRight className="h-4 w-4" />
              </button>

              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground py-3.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02] active:scale-95">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.72 7.54c-.46.53-1.21.94-1.94.88-.09-.76.28-1.56.72-2.06.46-.53 1.26-.92 1.91-.95.08.79-.23 1.57-.69 2.13zm.69 1.08c-1.07-.06-1.99.61-2.5.61-.51 0-1.29-.58-2.13-.56-1.1.02-2.11.64-2.67 1.62-1.14 1.97-.29 4.89.81 6.49.55.79 1.19 1.67 2.05 1.64.82-.03 1.13-.53 2.12-.53s1.27.53 2.13.51c.88-.01 1.44-.8 1.98-1.59.62-.91.88-1.79.89-1.84-.02-.01-1.71-.66-1.73-2.61-.01-1.63 1.33-2.41 1.39-2.45-.76-1.12-1.94-1.24-2.34-1.29z"/></svg>
                {t("checkout.pay")}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("checkout.secureCheckout")}
              </div>

              <div className="mt-4 rounded-lg bg-accent/10 p-3">
                <p className="text-xs font-semibold text-foreground">{t("checkout.smartRewards")}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t("checkout.earn")} <span className="font-bold text-accent-foreground">{Math.floor(grandTotal)}</span> {t("checkout.earnPoints")}
                </p>
              </div>

              <Link to="/products" className="mt-4 block text-center text-xs font-medium text-primary hover:underline">
                {t("checkout.continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
