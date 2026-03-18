import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, Loader2, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatCents } from '@/api/checkoutApi';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';

interface MiniCartProps {
  open: boolean;
  onClose: () => void;
}

function CartContent({ onClose }: { onClose: () => void }) {
  const {
    orderForm, totalItems, total,
    updateQuantity, removeItem, goToCheckout, isUpdating,
  } = useCart();

  const items = orderForm?.items || [];

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center bg-white">
        <ShoppingBag className="h-16 w-16 text-gray-300" />
        <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
        <p className="text-sm text-gray-500">Add items to get started.</p>
        <Link
          to="/products"
          onClick={onClose}
          className="mt-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Scrollable items area */}
      <div className="flex-1 overflow-y-auto overscroll-contain bg-white">
        <div className="divide-y divide-gray-100">
          {items.map((item) => {
            const lineTotal = item.sellingPrice * item.quantity;
            const hasDiscount = item.listPrice > item.sellingPrice;

            return (
              <div key={item.uniqueId} className="flex gap-3 px-5 py-4 bg-white">
                {/* Thumbnail */}
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                    {item.name}
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-red-600 tabular-nums">
                      {formatCents(item.sellingPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through tabular-nums">
                        {formatCents(item.listPrice)}
                      </span>
                    )}
                  </div>

                  {/* Quantity row */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isUpdating}
                      className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 disabled:opacity-30 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isUpdating}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-30 transition-colors"
                      aria-label="Add one more"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky footer — single CTA, no non-functional Apple Pay */}
      <div className="border-t border-gray-200 bg-white px-5 py-4 flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">Total</span>
          <span className="text-lg font-bold text-red-600 tabular-nums">
            {formatCents(total)}
          </span>
        </div>

        <button
          onClick={goToCheckout}
          disabled={isUpdating}
          className="flex w-full items-center justify-center rounded-lg bg-red-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continue to checkout'}
        </button>
      </div>
    </>
  );
}

export default function MiniCart({ open, onClose }: MiniCartProps) {
  const isMobile = useIsMobile();
  const { totalItems } = useCart();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
        <DrawerContent className="!bg-white !border-gray-200 max-h-[85vh]">
          <div className="flex flex-col max-h-[85vh] bg-white">
            {/* Handle bar */}
            <div className="flex justify-center py-2">
              <div className="h-1.5 w-12 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="px-5 pb-3 border-b border-gray-200 bg-white">
              <DrawerTitle className="text-lg font-bold text-gray-900">
                Shopping Cart
              </DrawerTitle>
              <DrawerDescription className="sr-only">Your cart items</DrawerDescription>
              <p className="text-sm text-gray-500">{totalItems} {totalItems === 1 ? 'Item' : 'Items'} in Cart</p>
            </div>

            <CartContent onClose={onClose} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="!w-[420px] !max-w-[420px] !p-0 !bg-white !border-gray-200 flex flex-col [&>button]:hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 flex-shrink-0 bg-white">
          <div>
            <SheetTitle className="text-lg font-bold text-gray-900">
              Shopping Cart
            </SheetTitle>
            <SheetDescription className="text-sm text-gray-500">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'} in Cart
            </SheetDescription>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <CartContent onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
}
