import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { Product } from "@/data/products";
import { CartItem } from "@/data/cart";
import { getOrCreateOrderForm, addToCart as vtexAddToCart, updateCartItems as vtexUpdateItems, redirectToCheckout as vtexRedirectToCheckout, type OrderForm } from "@/api/checkoutApi";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  goToCheckout: () => void;
  totalItems: number;
  totalPrice: number;
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  fulfillmentMethod: "delivery" | "pickup" | "shipping";
  setFulfillmentMethod: (method: "delivery" | "pickup" | "shipping") => void;
  isVtexSynced: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedStore, setSelectedStore] = useState("H Mart Manhattan");
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"delivery" | "pickup" | "shipping">("delivery");
  const [orderFormId, setOrderFormId] = useState<string | null>(null);
  const [isVtexSynced, setIsVtexSynced] = useState(false);
  const initialized = useRef(false);

  // Initialize orderForm on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    getOrCreateOrderForm()
      .then((of) => {
        setOrderFormId(of.orderFormId);
        setIsVtexSynced(true);
      })
      .catch((err) => {
        console.warn('[Cart] VTEX orderForm init failed, using local cart:', err);
      });
  }, []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    // Update local state immediately
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });

    // Sync with VTEX in background
    if (orderFormId) {
      const vtexData = (product as any)._vtex;
      const skuId = vtexData?.skuId || product.id;
      const sellerId = vtexData?.sellerId || '1';
      vtexAddToCart(orderFormId, [{ id: skuId, quantity, seller: sellerId }])
        .then((of) => setOrderFormId(of.orderFormId))
        .catch((err) => console.warn('[Cart] VTEX add failed:', err));
    }
  }, [orderFormId]);

  const removeItem = useCallback((productId: string) => {
    // Remove from local state
    setItems((prev) => prev.filter((i) => i.product.id !== productId));

    // Remove from VTEX - find the item index in the ACTUAL orderForm
    if (orderFormId) {
      getOrCreateOrderForm().then((of) => {
        const vtexData = items.find(i => i.product.id === productId);
        const skuId = (vtexData?.product as any)?._vtex?.skuId || productId;
        const vtexIndex = of.items.findIndex(item => item.id === skuId);
        if (vtexIndex >= 0) {
          vtexUpdateItems(orderFormId, [{ index: vtexIndex, quantity: 0 }])
            .then((updatedOf) => setOrderFormId(updatedOf.orderFormId))
            .catch(console.warn);
        }
      }).catch(console.warn);
    }
  }, [orderFormId, items]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    // Update local state immediately
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );

    // Update in VTEX - find correct index from actual orderForm
    if (orderFormId) {
      getOrCreateOrderForm().then((of) => {
        const vtexData = items.find(i => i.product.id === productId);
        const skuId = (vtexData?.product as any)?._vtex?.skuId || productId;
        const vtexIndex = of.items.findIndex(item => item.id === skuId);
        if (vtexIndex >= 0) {
          vtexUpdateItems(orderFormId, [{ index: vtexIndex, quantity }])
            .then((updatedOf) => setOrderFormId(updatedOf.orderFormId))
            .catch(console.warn);
        }
      }).catch(console.warn);
    }
  }, [orderFormId, items, removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const goToCheckout = useCallback(() => {
    if (orderFormId) {
      vtexRedirectToCheckout(orderFormId);
    } else {
      // Fallback: go to local checkout page
      window.location.href = '/checkout';
    }
  }, [orderFormId]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity, clearCart, goToCheckout,
        totalItems, totalPrice,
        selectedStore, setSelectedStore,
        fulfillmentMethod, setFulfillmentMethod,
        isVtexSynced,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
