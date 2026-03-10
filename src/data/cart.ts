import { create } from "zustand" is not available, so we'll use React context instead.
// We'll use a simple context-based cart for the POC.

import { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

// Simple in-memory cart state (will be managed via React context)
export const initialCart: CartItem[] = [];
