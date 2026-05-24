"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";

// ── Image helper ───────────────────────────────────────────────────────────────
// Uses NEXT_PUBLIC_IMAGE_URL (e.g. http://localhost:8000) as the base.
// Falls back to the raw value if it already looks like an absolute URL.
function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder-product.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/$/, "") ?? "";
return `${base}/${path}`;
}

export function CartContent() {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCart();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const subtotal   = totalPrice;
  const total      = subtotal;

  if (items.length === 0) {
    return (
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
              Your bag is empty
            </h2>

            <p className="text-foreground/60 mb-8 max-w-sm">
              Discover our curated collection of luxury beauty and skincare
              products
            </p>

            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 px-6">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Cart Items ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 sm:gap-6 pb-6 border-b border-border last:border-0"
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={resolveImageUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      // Unoptimised for external Laravel URL; remove if you
                      // add the domain to next.config.js images.remotePatterns
                      unoptimized
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <Link
                      href={`/products/${item.id}`}
                      className="font-serif text-lg sm:text-xl font-semibold text-foreground hover:text-primary transition-colors mb-1 truncate"
                    >
                      {item.name}
                    </Link>

                    <p className="text-sm text-foreground/60 mb-4">
                      {item.category}
                    </p>

                    {/* Quantity and Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-auto">
                      <div className="flex items-center gap-3 border border-border rounded-lg w-fit">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="p-2 hover:bg-accent/10 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-accent/10 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-foreground/50">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8 pt-8 border-t border-border">
              <Link href="/products">
                <Button variant="ghost" className="text-primary hover:bg-primary/10">
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* ── Order Summary ────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

               

                
              </div>
<div className="flex justify-between items-center mb-6">
  <span className="font-semibold text-foreground">
    Total <span className="text-sm font-normal text-foreground/50">({totalItems} items)</span>
  </span>
  <span className="font-serif text-2xl font-semibold text-foreground">
    ${total.toFixed(2)}
  </span>
</div>

             

              <Link href="/checkout" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-12 font-semibold mb-3">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/products" className="block">
                <Button
                  variant="outline"
                  className="w-full border-primary/30 hover:bg-primary/5 rounded-md h-12 font-semibold"
                >
                  Continue Shopping
                </Button>
              </Link>

              <button
                onClick={clearCart}
                className="w-full mt-3 text-sm text-destructive hover:text-destructive/80 transition-colors py-2"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}