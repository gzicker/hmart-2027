import { useState } from "react";
import { MapPin, ChevronDown, Check, Search, Loader2, Clock, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FRANCHISE_STORES, getDeliverySLAsForZipcode, formatShippingEstimate, type DeliverySLA } from "@/api/stores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function StoreSelector() {
  const {
    selectedStore, selectedStoreData, setSelectedStoreById,
    fulfillmentMethod, setFulfillmentMethod,
    selectedSLA, setSelectedSLA,
  } = useCart();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [zipcode, setZipcode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [availableSLAs, setAvailableSLAs] = useState<DeliverySLA[]>([]);
  const [searchDone, setSearchDone] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleZipcodeSearch = async () => {
    const cleaned = zipcode.replace(/\D/g, "");
    if (cleaned.length < 5) return;

    setIsSearching(true);
    setSearchError(null);
    setAvailableSLAs([]);
    setSearchDone(false);

    try {
      if (fulfillmentMethod === "delivery") {
        const slas = await getDeliverySLAsForZipcode(cleaned);
        setAvailableSLAs(slas);
        setSearchDone(true);
        if (slas.length === 0) {
          setSearchError("No delivery options available for this zipcode.");
        }
      }
    } catch {
      setSearchError("Could not look up zipcode. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSLA = (sla: DeliverySLA) => {
    setSelectedSLA(sla);
    // Auto-select the franchise store in background
    setSelectedStoreById(sla.storeId);
    setOpen(false);
  };

  const handleSelectStore = (storeId: string) => {
    setSelectedStoreById(storeId);
    setOpen(false);
  };

  const displayLabel = fulfillmentMethod === "delivery"
    ? (selectedSLA?.name || selectedStoreData?.name || selectedStore || "Select delivery")
    : (selectedStoreData?.name || selectedStore || "Select store");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-primary"
      >
        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
        <div className="text-left hidden sm:block">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none mb-0.5">
            {fulfillmentMethod === "delivery" ? t("store.deliverTo") : t("store.pickupAt")}
          </div>
          <div className="font-medium text-foreground leading-tight truncate max-w-[140px]">
            {displayLabel}
          </div>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {fulfillmentMethod === "delivery" ? t("store.chooseStore") : t("store.chooseStore")}
            </DialogTitle>
          </DialogHeader>

          {/* Fulfillment toggle */}
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {(["delivery", "pickup"] as const).map((method) => (
              <button
                key={method}
                onClick={() => {
                  setFulfillmentMethod(method);
                  setAvailableSLAs([]);
                  setSearchDone(false);
                  setSearchError(null);
                }}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  fulfillmentMethod === method
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {method === "delivery" ? t("checkout.delivery") : t("checkout.pickup")}
              </button>
            ))}
          </div>

          {/* DELIVERY MODE — zipcode + SLAs */}
          {fulfillmentMethod === "delivery" && (
            <>
              <p className="text-sm text-muted-foreground">
                Enter your zipcode to see available delivery options.
              </p>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter zipcode"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleZipcodeSearch()}
                  className="flex-1"
                  maxLength={10}
                />
                <button
                  onClick={handleZipcodeSearch}
                  disabled={isSearching || zipcode.replace(/\D/g, "").length < 5}
                  className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Find
                </button>
              </div>

              {searchError && (
                <p className="text-sm text-destructive">{searchError}</p>
              )}

              {searchDone && availableSLAs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Available for {zipcode}
                  </p>
                  {availableSLAs.map((sla) => {
                    const isSelected = selectedSLA?.id === sla.id && selectedSLA?.sellerId === sla.sellerId;
                    return (
                      <button
                        key={`${sla.id}-${sla.sellerId}`}
                        onClick={() => handleSelectSLA(sla)}
                        className={`w-full rounded-lg border p-4 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{sla.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              {sla.shippingEstimate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {formatShippingEstimate(sla.shippingEstimate)}
                                </span>
                              )}
                              <span className="font-medium">
                                {sla.price === 0 ? (
                                  <span className="text-green-600">Free</span>
                                ) : (
                                  `$${sla.price.toFixed(2)}`
                                )}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex-shrink-0 rounded-full bg-primary p-1">
                              <Check className="h-3.5 w-3.5 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* PICKUP MODE — store list */}
          {fulfillmentMethod === "pickup" && (
            <>
              <p className="text-sm text-muted-foreground">
                Select a store for pickup.
              </p>

              <div className="space-y-2">
                {FRANCHISE_STORES.map((store) => {
                  const isSelected = selectedStoreData?.id === store.id;
                  return (
                    <button
                      key={store.id}
                      onClick={() => handleSelectStore(store.id)}
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
            </>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Prices, promotions, and product availability may vary by location.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
