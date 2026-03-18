import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatCents } from '@/api/checkoutApi';

interface MiniCartProps {
  open: boolean;
  onClose: () => void;
}

export default function MiniCart({ open, onClose }: MiniCartProps) {
  const {
    orderForm,
    totalItems,
    total,
    updateQuantity,
    removeItem,
    goToCheckout,
    isUpdating,
  } = useCart();

  const items = orderForm?.items || [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Desktop: right drawer / Mobile: bottom sheet */}
      <div
        className="
          absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl
          lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-full lg:w-[420px] lg:max-w-md lg:rounded-none
          bg-white shadow-2xl flex flex-col
        "
      >
        {/* ====== HEADER ====== */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">Cart</span>
            {totalItems > 0 && (
              <span className="text-sm font-medium text-gray-500">
                ({totalItems})
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ====== ITEMS ====== */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300" />
              <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
              <p className="text-sm text-gray-500">Add items to get started.</p>
              <Link
                to="/products"
                onClick={onClose}
                className="mt-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const lineTotal = item.sellingPrice * item.quantity;
                const hasDiscount = item.listPrice > item.sellingPrice;

                return (
                  <div key={item.uniqueId} className="flex gap-4 px-5 py-4">
                    {/* Thumbnail */}
                    <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                        {item.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 tabular-nums">
                          {formatCents(item.sellingPrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-400 line-through tabular-nums">
                            {formatCents(item.listPrice)}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Quantity stepper */}
                        <div className="flex items-center rounded-lg border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={isUpdating}
                            className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Line total + remove */}
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-gray-900 tabular-nums">
                            {formatCents(lineTotal)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={isUpdating}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ====== FOOTER (sticky) ====== */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-700">Subtotal</span>
              <span className="text-lg font-bold text-gray-900 tabular-nums">
                {formatCents(total)}
              </span>
            </div>

            <p className="text-xs text-gray-400">
              Shipping and taxes calculated at checkout.
            </p>

            <button
              onClick={goToCheckout}
              disabled={isUpdating}
              className="flex w-full items-center justify-center rounded-lg bg-gray-900 py-3.5 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:opacity-60"
            >
              {isUpdating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Checkout'
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
