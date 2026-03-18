import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
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
  /** The real VTEX orderForm — single source of truth */
  orderForm: OrderForm | null;
  /** Is the cart loading (initial load)? */
  isLoading: boolean;
  /** Is an operation (add/update/remove) in progress? */
  isUpdating: boolean;
  /** Error message if last operation failed */
  error: string | null;

  /** Cart computed values */
  totalItems: number;
  subtotal: number;      // in cents
  discounts: number;     // in cents
  total: number;         // in cents

  /** Add a SKU to cart */
  addItem: (skuId: string, quantity: number, sellerId: string) => Promise<void>;
  /** Update quantity of an item by its SKU id */
  updateQuantity: (skuId: string, quantity: number) => Promise<void>;
  /** Remove an item by its SKU id */
  removeItem: (skuId: string) => Promise<void>;
  /** Clear all items from cart */
  clearCart: () => Promise<void>;
  /** Redirect to VTEX native checkout */
  goToCheckout: () => void;
  /** Refresh orderForm from server */
  refresh: () => Promise<void>;

  /** Store/region selection */
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  selectedSellerId: string;
  setSelectedSellerId: (id: string) => void;
  fulfillmentMethod: "delivery" | "pickup" | "shipping";
  setFulfillmentMethod: (method: "delivery" | "pickup" | "shipping") => void;

  /** Location confirmation */
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
    if (!orderForm) return;
    setIsUpdating(true);
    setError(null);

    if (!hasConfirmedLocation) {
      setPromptStoreSelector(true);
    }

    try {
      const updated = await addItems(orderForm.orderFormId, [
        { id: skuId, quantity, seller: sellerId || selectedSellerId },
      ]);
      setOrderForm(updated);
    } catch (err: any) {
      console.error('[Cart] addItem failed:', err);
      setError('Failed to add item to cart');
    } finally {
      setIsUpdating(false);
    }
  }, [orderForm, selectedSellerId, hasConfirmedLocation]);

  // --- UPDATE QUANTITY ---
  const updateQuantity = useCallback(async (skuId: string, quantity: number) => {
    if (!orderForm) return;
    const index = findItemIndex(orderForm, skuId);
    if (index < 0) return;

    setIsUpdating(true);
    setError(null);
    try {
      const updated = await updateItems(orderForm.orderFormId, [
        { index, quantity: Math.max(0, quantity) },
      ]);
      setOrderForm(updated);
    } catch (err: any) {
      console.error('[Cart] updateQuantity failed:', err);
      setError('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  }, [orderForm]);

  // --- REMOVE ITEM ---
  const removeItem = useCallback(async (skuId: string) => {
    if (!orderForm) return;
    const index = findItemIndex(orderForm, skuId);
    if (index < 0) return;

    setIsUpdating(true);
    setError(null);
    try {
      const updated = await updateItems(orderForm.orderFormId, [
        { index, quantity: 0 },
      ]);
      setOrderForm(updated);
    } catch (err: any) {
      console.error('[Cart] removeItem failed:', err);
      setError('Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  }, [orderForm]);

  // --- CLEAR CART ---
  const clearCart = useCallback(async () => {
    if (!orderForm || orderForm.items.length === 0) return;
    setIsUpdating(true);
    setError(null);
    try {
      const updates = orderForm.items.map((_, index) => ({ index, quantity: 0 }));
      const updated = await updateItems(orderForm.orderFormId, updates);
      setOrderForm(updated);
    } catch (err: any) {
      console.error('[Cart] clearCart failed:', err);
      setError('Failed to clear cart');
    } finally {
      setIsUpdating(false);
    }
  }, [orderForm]);

  // --- CHECKOUT ---
  const goToCheckout = useCallback(() => {
    redirectToCheckout(orderForm?.orderFormId);
  }, [orderForm]);

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
