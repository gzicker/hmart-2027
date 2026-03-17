import { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown, Check, Search, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSellersForZipcode, STORE_ADDRESSES, STORE_DISPLAY_NAMES, type RegionSeller } from "@/api/stores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DEFAULT_ZIP = "10001";

export default function StoreSelector() {
  const {
    selectedStore, setSelectedStore,
    selectedSellerId, setSelectedSellerId,
    fulfillmentMethod, setFulfillmentMethod,
    hasConfirmedLocation, setHasConfirmedLocation,
    promptStoreSelector, setPromptStoreSelector,
  } = useCart();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [zipcode, setZipcode] = useState(DEFAULT_ZIP);
  const [isSearching, setIsSearching] = useState(false);
  const [sellers, setSellers] = useState<RegionSeller[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [locationLabel, setLocationLabel] = useState("");
  const initializedRef = useRef(false);

  // Auto-init with default ZIP on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    runSearch(DEFAULT_ZIP, true);
  }, []);

  // Open modal when cart prompts for confirmation
  useEffect(() => {
    if (promptStoreSelector) {
      setOpen(true);
      setPromptStoreSelector(false);
    }
  }, [promptStoreSelector, setPromptStoreSelector]);

  const searchByZip = async () => {
    const zip = zipcode.replace(/\D/g, "");
    if (zip.length < 5) return;
    setIsSearching(true);
    setHasSearched(true);
    setLocationLabel("");
    try {
      // Fetch city/state from ZIP in parallel with seller lookup
      const [results, geoRes] = await Promise.all([
        getSellersForZipcode(zip),
        fetch(`https://api.zippopotam.us/us/${zip}`).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);
      let geoLabel = "";
      if (geoRes?.places?.[0]) {
        const place = geoRes.places[0];
        geoLabel = `${place['place name']}, ${place['state abbreviation']}`;
        setLocationLabel(geoLabel);
      }
      setSellers(results);
      if (results.length === 1) {
        setSelectedSellerId(results[0].id);
        const label = fulfillmentMethod === "delivery"
          ? (geoLabel || `ZIP ${zip}`)
          : (STORE_DISPLAY_NAMES[results[0].id] || results[0].name);
        setSelectedStore(label);
      }
    } catch (err) {
      console.error("Region lookup failed:", err);
      setSellers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSeller = (seller: RegionSeller) => {
    setSelectedSellerId(seller.id);
    const label = fulfillmentMethod === "delivery"
      ? (locationLabel || `ZIP ${zipcode}`)
      : (STORE_DISPLAY_NAMES[seller.id] || seller.name);
    setSelectedStore(label);
    setOpen(false);
  };

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
            {selectedStore || "Enter ZIP code"}
          </div>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {t("store.chooseStore")}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Enter your ZIP code to find your store. Prices and availability depend on your location.
          </p>

          {/* ZIP Search */}
          <div className="flex gap-2">
            <input
              placeholder="Enter ZIP code"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value.replace(/\D/g, "").slice(0, 5))}
              onKeyDown={(e) => e.key === "Enter" && searchByZip()}
              className="flex-1 rounded-lg border border-border bg-background py-2.5 px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={searchByZip}
              disabled={isSearching || zipcode.replace(/\D/g, "").length < 5}
              className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Find
            </button>
          </div>

          {/* Fulfillment toggle */}
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {(["delivery", "pickup"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setFulfillmentMethod(method)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  fulfillmentMethod === method
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {method === "delivery" ? "Delivery" : "Pickup"}
              </button>
            ))}
          </div>

          {/* Results */}
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {hasSearched && !isSearching && sellers.length === 0 && (
            <div className="rounded-lg border border-border bg-secondary/30 p-6 text-center">
              <p className="text-sm font-medium text-foreground">No store serves ZIP code {zipcode}</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a different ZIP code</p>
            </div>
          )}

          {hasSearched && !isSearching && sellers.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {fulfillmentMethod === "delivery"
                  ? "Your zipcode"
                  : (sellers.length === 1 ? "Your store" : `${sellers.length} stores serve ZIP ${zipcode}`)}
              </p>
              {sellers.map((seller) => {
                const isSelected = selectedSellerId === seller.id;
                return (
                  <button
                    key={seller.id}
                    onClick={() => selectSeller(seller)}
                    className={`w-full rounded-lg border p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="font-medium text-foreground">
                          {fulfillmentMethod === "delivery"
                            ? (locationLabel || `ZIP ${zipcode}`)
                            : (STORE_DISPLAY_NAMES[seller.id] || seller.name)}
                        </div>
                        {fulfillmentMethod === "pickup" && STORE_ADDRESSES[seller.id] && (
                          <div className="text-xs text-muted-foreground">{STORE_ADDRESSES[seller.id]}</div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0 rounded-full bg-primary p-1">
                          <Check className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                        <MapPin className="h-3 w-3" />
                        {fulfillmentMethod === "delivery" ? `Your selected zipcode` : t("store.yourStore")}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {!hasSearched && (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Enter your ZIP code above to find your store
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Prices, promotions, inventory, and delivery options are determined by the store that serves your area.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
