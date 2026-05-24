"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { Product } from "@/lib/products";
import { toast } from "sonner";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsAdding(true);

    // Simulate a slight delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      category: product.category,
    });

    toast.success(`Added ${quantity} × ${product.name} to your bag ✨`);
    setQuantity(1);
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 sticky top-20 sm:top-24">
      {/* Category */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-primary/70">
          {product.category}
        </span>
      </div>

      {/* Product Name */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-2">
          {product.name}
        </h1>
        <p className="text-foreground/60">{product.shortDescription}</p>
      </div>

      {/* Price */}
      <div className="border-y border-border py-6">
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-semibold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-foreground/50">AUD</span>
        </div>
        <p className="text-sm text-foreground/60 mt-2">Size: {product.size}</p>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.inStock ? (
          <>
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm text-primary font-medium">In Stock</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-sm text-destructive font-medium">
              Out of Stock
            </span>
          </>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-foreground">Quantity</span>
        <div className="flex items-center border border-border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity === 1 || !product.inStock}
            className="p-2 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 border-l border-r border-border text-center min-w-[50px]">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={!product.inStock}
            className="p-2 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-12 text-base font-semibold flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          {isAdding ? "Adding..." : "Add to Bag"}
        </Button>

        <Button
          onClick={handleBuyNow}
          disabled={!product.inStock || isAdding}
          variant="outline"
          className="w-full border-primary/30 hover:bg-primary/5 rounded-md h-12 text-base font-semibold"
        >
          Buy Now
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-foreground/60 mb-1">
            Free Shipping
          </p>
          <p className="text-sm text-foreground/70">On orders over AUD $100</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-foreground/60 mb-1">
            30-Day Returns
          </p>
          <p className="text-sm text-foreground/70">No questions asked</p>
        </div>
      </div>
    </div>
  );
}
