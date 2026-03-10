import { useState } from "react";
import { MapPin, ChevronDown, Navigation, Clock, Phone, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STORES = [
  { id: "manhattan", name: "H Mart Manhattan", address: "39 3rd Ave, New York, NY 10003", phone: "(212) 539-0580", hours: "8AM – 10PM", distance: "0.3 mi" },
  { id: "flushing", name: "H Mart Flushing", address: "29-02 Union St, Flushing, NY 11354", phone: "(718) 888-9440", hours: "8AM – 10PM", distance: "7.2 mi" },
  { id: "fort-lee", name: "H Mart Fort Lee", address: "300 River Rd, Edgewater, NJ 07020", phone: "(201) 886-9300", hours: "8AM – 10PM", distance: "9.1 mi" },
  { id: "boston", name: "H Mart Burlington", address: "3 Burlington Mall Rd, Burlington, MA 01803", phone: "(781) 799-8688", hours: "9AM – 9PM", distance: "215 mi" },
  { id: "austin", name: "H Mart Austin", address: "11301 Lakeline Blvd, Austin, TX 78717", phone: "(512) 829-3700", hours: "8AM – 9PM", distance: "1,745 mi" },
];

export default function StoreSelector() {
  const { selectedStore, setSelectedStore, fulfillmentMethod, setFulfillmentMethod } = useCart();
  const [open, setOpen] = useState(false);
  const [zipcode, setZipcode] = useState("");

  const currentStore = STORES.find((s) => s.name === selectedStore) || STORES[0];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-primary"
      >
        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
        <div className="text-left hidden sm:block">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none mb-0.5">
            {fulfillmentMethod === "delivery" ? "Deliver to" : fulfillmentMethod === "pickup" ? "Pickup at" : "Ship from"}
          </div>
          <div className="font-medium text-foreground leading-tight truncate max-w-[140px]">{selectedStore}</div>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Choose your store</DialogTitle>
          </DialogHeader>

          {/* Fulfillment tabs */}
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
                {method}
              </button>
            ))}
          </div>

          {/* Zipcode input */}
          {fulfillmentMethod === "delivery" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Enter your ZIP code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Navigation className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="e.g. 10003"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Find stores
                </button>
              </div>
            </div>
          )}

          {/* Store list */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {fulfillmentMethod === "pickup" ? "Select a store for pickup" : "Stores near you"}
            </p>
            {STORES.map((store) => (
              <button
                key={store.id}
                onClick={() => {
                  setSelectedStore(store.name);
                  setOpen(false);
                }}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  selectedStore === store.name
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{store.name}</div>
                    <div className="text-sm text-muted-foreground">{store.address}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{store.hours}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{store.phone}</span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
                    {store.distance}
                  </span>
                </div>
                {selectedStore === store.name && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                    <MapPin className="h-3 w-3" /> Your selected store
                  </div>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
