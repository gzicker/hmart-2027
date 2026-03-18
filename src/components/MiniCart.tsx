import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, Truck, Tag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatCents } from "@/api/checkoutApi";
import { Progress } from "@/components/ui/progress";

const FREE_SHIPPING_THRESHOLD = 4900; // $49.00 in cents

interface MiniCartProps {
  open: boolean;
  onClose: () => void;
}

export default function MiniCart({ open, onClose }: MiniCartProps) {
  const {
    orderForm, totalItems, subtotal, discounts, total,
    updateQuantity, removeItem, goToCheckout, isUpdating,
  } = useCart();

  const items = orderForm?.items || [];
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <div>
              <span className="text-base font-bold text-foreground">Your Cart</span>
              {totalItems > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-secondary">
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Free shipping progress */}
        {totalItems > 0 && (
          <div className="border-b border-border px-5 py-3">
            {hasFreeShipping ? (
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <Truck className="h-4 w-4" />
                You've got free shipping!
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5" />
                    Add {formatCents(amountToFreeShipping)} for free shipping
                  </span>
                  <span>{formatCents(FREE_SHIPPING_THRESHOLD)}</span>
                </div>
                <Progress value={shippingProgress} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
              <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add items to get started</p>
              <Link
                to="/products"
                onClick={onClose}
                className="mt-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.uniqueId} className="px-5 py-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-2">{item.name}</p>

                      {item.sellerName && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Sold by {item.sellerName}
                        </p>
                      )}

                      {/* Price */}
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {formatCents(item.sellingPrice * item.quantity)}
                        </span>
                        {item.listPrice > item.sellingPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatCents(item.listPrice * item.quantity)}
                          </span>
                        )}
                        {item.quantity > 1 && (
                          <span className="text-xs text-muted-foreground">
                            ({formatCents(item.sellingPrice)} each)
                          </span>
                        )}
                      </div>

                      {/* Quantity controls */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-lg border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isUpdating}
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating}
                          className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Gift badge */}
                  {item.isGift && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <Tag className="h-3 w-3" /> Free gift
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            {discounts > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-green-600">
                  <Tag className="h-3.5 w-3.5" /> Discounts
                </span>
                <span className="text-green-600">-{formatCents(discounts)}</span>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-foreground">Subtotal</span>
                <span className="text-base font-bold text-foreground">{formatCents(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={goToCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                View full cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
