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
    setItems((prev) => {
      const index = prev.findIndex((i) => i.product.id === productId);
      if (index >= 0 && orderFormId) {
        vtexUpdateItems(orderFormId, [{ index, quantity: 0 }]).catch(console.warn);
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  }, [orderFormId]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => {
      const index = prev.findIndex((i) => i.product.id === productId);
      if (index >= 0 && orderFormId) {
        vtexUpdateItems(orderFormId, [{ index, quantity }]).catch(console.warn);
      }
      return prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
    });
  }, [orderFormId, removeItem]);

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
