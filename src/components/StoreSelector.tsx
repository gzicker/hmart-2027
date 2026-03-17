import { useState } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FRANCHISE_STORES } from "@/api/stores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function StoreSelector() {
  const { selectedStore, selectedStoreData, setSelectedStoreById, fulfillmentMethod, setFulfillmentMethod } = useCart();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-primary"
      >
        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
        <div className="text-left hidden sm:block">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none mb-0.5">
            {fulfillmentMethod === "delivery" ? t("store.deliverTo") : fulfillmentMethod === "pickup" ? t("store.pickupAt") : t("store.shipFrom")}
          </div>
          <div className="font-medium text-foreground leading-tight truncate max-w-[140px]">
            {selectedStoreData?.name || selectedStore || 'Select store'}
          </div>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{t("store.chooseStore")}</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Select your store. Product availability, prices, and delivery options depend on the selected location.
          </p>

          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {(["delivery", "pickup", "shipping"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setFulfillmentMethod(method)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  fulfillmentMethod === method
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {method === "delivery" ? t("checkout.delivery") : method === "pickup" ? t("checkout.pickup") : t("checkout.ship")}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {FRANCHISE_STORES.map((store) => {
              const isSelected = selectedStoreData?.id === store.id;
              return (
                <button
                  key={store.id}
                  onClick={() => {
                    setSelectedStoreById(store.id);
                    setOpen(false);
                  }}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{store.name}</div>
                      <div className="text-sm text-muted-foreground">{store.address}</div>
                      <div className="text-xs text-muted-foreground/70">Seller: {store.sellerId}</div>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0 rounded-full bg-primary p-1">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                      <MapPin className="h-3 w-3" /> {t("store.yourStore")}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Prices, promotions, and product availability may vary by store location.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
