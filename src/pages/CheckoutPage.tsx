import { Link } from "react-router-dom";
import { Truck, Store, Minus, Plus, Trash2, ShieldCheck, MapPin, ChevronRight, Crown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCents } from "@/api/checkoutApi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const {
    orderForm, isLoading, isUpdating,
    updateQuantity, removeItem,
    totalItems, subtotal, total,
    goToCheckout,
    fulfillmentMethod, setFulfillmentMethod, selectedStore,
  } = useCart();
  const { t } = useLanguage();

  const [hmartPlus, setHmartPlus] = useState(false);
  const hmartPlusFee = hmartPlus ? 999 : 0; // cents
  const deliveryFee = fulfillmentMethod === "delivery" ? 599 : 0; // cents

  // Tax is NOT computed client-side — it will be calculated by VTEX at checkout.
  // Showing an estimate disclaimer instead of a hardcoded rate.
  const grandTotal = subtotal + deliveryFee + hmartPlusFee;

  const items = orderForm?.items || [];

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

  if (!items.length) {
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
              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  {fulfillmentMethod === "delivery" ? t("checkout.deliveringFrom") : t("checkout.pickupAt")}{" "}
                  <span className="font-medium text-foreground">{selectedStore}</span>
                </span>
                <button className="ml-auto text-xs font-medium text-primary">{t("checkout.change")}</button>
              </div>
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
                {t("checkout.yourItems")} ({totalItems})
              </h2>
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.uniqueId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-[11px] text-muted-foreground">{item.skuName}</p>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isUpdating}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[1.5rem] text-center text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating}
                          className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{formatCents(item.sellingPrice * item.quantity)}</p>
                      {item.listPrice > item.sellingPrice && (
                        <p className="text-[11px] text-muted-foreground line-through">{formatCents(item.listPrice * item.quantity)}</p>
                      )}
                    </div>
                  </div>
                ))}
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
                  <span className="font-medium text-foreground">{formatCents(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {fulfillmentMethod === "delivery" ? t("checkout.deliveryFee") : t("checkout.pickup")}
                  </span>
                  <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-foreground"}`}>
                    {deliveryFee === 0 ? t("checkout.free") : formatCents(deliveryFee)}
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
                  <span className="text-xs font-medium text-muted-foreground italic">Calculated at checkout</span>
                </div>

                {subtotal >= 4900 && fulfillmentMethod === "delivery" && (
                  <div className="rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                    {t("checkout.freeDelivery")}
                  </div>
                )}

                <div className="border-t border-border pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">{t("checkout.total")}</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-foreground">{formatCents(grandTotal)}</span>
                      <p className="text-[10px] text-muted-foreground">+ tax</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={goToCheckout}
                disabled={isUpdating}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {t("checkout.placeOrder")} <ChevronRight className="h-4 w-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("checkout.secureCheckout")}
              </div>

              <div className="mt-4 rounded-lg bg-accent/10 p-3">
                <p className="text-xs font-semibold text-foreground">{t("checkout.smartRewards")}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t("checkout.earn")} <span className="font-bold text-accent-foreground">{Math.floor(grandTotal / 100)}</span> {t("checkout.earnPoints")}
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
