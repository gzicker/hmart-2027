import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  getOrCreateOrderForm,
  addItems,
  updateItems,
  findItemIndex,
  redirectToCheckout,
  getItemCount,
  getSubtotal,
  getDiscounts,
  type OrderForm,
} from "@/api/checkoutApi";

interface CartContextType {
  orderForm: OrderForm | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  totalItems: number;
  subtotal: number;
  discounts: number;
  total: number;
  addItem: (skuId: string, quantity: number, sellerId: string) => Promise<void>;
  updateQuantity: (skuId: string, quantity: number) => Promise<void>;
  removeItem: (skuId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  goToCheckout: () => void;
  refresh: () => Promise<void>;
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  selectedSellerId: string;
  setSelectedSellerId: (id: string) => void;
  fulfillmentMethod: "delivery" | "pickup" | "shipping";
  setFulfillmentMethod: (method: "delivery" | "pickup" | "shipping") => void;
  hasConfirmedLocation: boolean;
  setHasConfirmedLocation: (v: boolean) => void;
  promptStoreSelector: boolean;
  setPromptStoreSelector: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [orderForm, setOrderForm] = useState<OrderForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState("Select store");
  const [selectedSellerId, setSelectedSellerId] = useState("1");
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"delivery" | "pickup" | "shipping">("delivery");
  const [hasConfirmedLocation, setHasConfirmedLocation] = useState(false);
  const [promptStoreSelector, setPromptStoreSelector] = useState(false);
  const initialized = useRef(false);

  // Ref to always have the latest orderForm in queued operations
  const orderFormRef = useRef<OrderForm | null>(null);
  orderFormRef.current = orderForm;

  // Async mutation queue — serializes cart operations to prevent race conditions
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const enqueue = useCallback((fn: () => Promise<void>) => {
    const next = queueRef.current.then(fn, fn);
    queueRef.current = next;
    return next;
  }, []);

  // --- Show toast on error ---
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // --- Initialize: load or create orderForm ---
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    getOrCreateOrderForm()
      .then((of) => {
        setOrderForm(of);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('[Cart] Failed to init orderForm:', err);
        setIsLoading(false);
        setError('Failed to initialize cart');
      });
  }, []);

  // --- ADD ITEM ---
  const addItem = useCallback(async (skuId: string, quantity: number, sellerId: string) => {
    if (!hasConfirmedLocation) {
      setPromptStoreSelector(true);
    }

    return enqueue(async () => {
      const current = orderFormRef.current;
      if (!current) return;
      setIsUpdating(true);
      setError(null);
      try {
        const updated = await addItems(current.orderFormId, [
          { id: skuId, quantity, seller: sellerId || selectedSellerId },
        ]);
        setOrderForm(updated);
      } catch (err: any) {
        console.error('[Cart] addItem failed:', err);
        const vtexMsg = err?.response?.data?.error?.message || err?.message || '';
        setError(vtexMsg ? `Failed to add item: ${vtexMsg}` : 'Failed to add item to cart');
      } finally {
        setIsUpdating(false);
      }
    });
  }, [selectedSellerId, hasConfirmedLocation, enqueue]);

  // --- UPDATE QUANTITY ---
  const updateQuantity = useCallback(async (skuId: string, quantity: number) => {
    return enqueue(async () => {
      const current = orderFormRef.current;
      if (!current) return;
      const index = findItemIndex(current, skuId);
      if (index < 0) return;

      setIsUpdating(true);
      setError(null);
      try {
        const updated = await updateItems(current.orderFormId, [
          { index, quantity: Math.max(0, quantity) },
        ]);
        setOrderForm(updated);
      } catch (err: any) {
        console.error('[Cart] updateQuantity failed:', err);
        setError('Failed to update quantity');
      } finally {
        setIsUpdating(false);
      }
    });
  }, [enqueue]);

  // --- REMOVE ITEM ---
  const removeItem = useCallback(async (skuId: string) => {
    return enqueue(async () => {
      const current = orderFormRef.current;
      if (!current) return;
      const index = findItemIndex(current, skuId);
      if (index < 0) return;

      setIsUpdating(true);
      setError(null);
      try {
        const updated = await updateItems(current.orderFormId, [
          { index, quantity: 0 },
        ]);
        setOrderForm(updated);
      } catch (err: any) {
        console.error('[Cart] removeItem failed:', err);
        setError('Failed to remove item');
      } finally {
        setIsUpdating(false);
      }
    });
  }, [enqueue]);

  // --- CLEAR CART ---
  const clearCart = useCallback(async () => {
    return enqueue(async () => {
      const current = orderFormRef.current;
      if (!current || current.items.length === 0) return;
      setIsUpdating(true);
      setError(null);
      try {
        const updates = current.items.map((_, index) => ({ index, quantity: 0 }));
        const updated = await updateItems(current.orderFormId, updates);
        setOrderForm(updated);
      } catch (err: any) {
        console.error('[Cart] clearCart failed:', err);
        setError('Failed to clear cart');
      } finally {
        setIsUpdating(false);
      }
    });
  }, [enqueue]);

  // --- CHECKOUT ---
  const goToCheckout = useCallback(() => {
    redirectToCheckout(orderFormRef.current?.orderFormId);
  }, []);

  // --- REFRESH ---
  const refresh = useCallback(async () => {
    setIsUpdating(true);
    try {
      const of = await getOrCreateOrderForm();
      setOrderForm(of);
    } catch (err) {
      console.error('[Cart] refresh failed:', err);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // --- Computed values ---
  const totalItems = orderForm ? getItemCount(orderForm) : 0;
  const subtotal = orderForm ? getSubtotal(orderForm) : 0;
  const discounts = orderForm ? getDiscounts(orderForm) : 0;
  const total = orderForm?.value ?? 0;

  return (
    <CartContext.Provider value={{
      orderForm, isLoading, isUpdating, error,
      totalItems, subtotal, discounts, total,
      addItem, updateQuantity, removeItem, clearCart, goToCheckout, refresh,
      selectedStore, setSelectedStore,
      selectedSellerId, setSelectedSellerId,
      fulfillmentMethod, setFulfillmentMethod,
      hasConfirmedLocation, setHasConfirmedLocation,
      promptStoreSelector, setPromptStoreSelector,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
