"use client";

import { ShoppingBag, Eye, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { ApiProduct } from "@/components/products-grid";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface ProductCardProps {
  product: ApiProduct;
}

const CATEGORY_COLORS: Record<string, string> = {
  skincare: "#f9a8c9",
  fragrance: "#c4b5fd",
  wellness: "#86efac",
};

const catColor = (c: string) => CATEGORY_COLORS[c.toLowerCase()] ?? "#e9d5ff";

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const images = product.images ?? [];
  const primaryImage = images.find((i) => i.isPrimary) ?? images[0] ?? null;
  const accentColor = catColor(product.category);
  const inStock = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to add items to your bag ✨");
      router.push(
        `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage?.url ?? "",
      quantity: 1,
      category: product.category,
    });
    toast.success(`Added ${product.name} to your bag ✨`);
  };

  return (
    <article className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-400">
      {/* ── Image ── */}
      <div className="relative h-64 sm:h-72 overflow-hidden bg-muted">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage.url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-pink-50">
            <ImageIcon className="w-10 h-10 text-pink-200" />
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Out of stock */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white text-sm font-medium tracking-wide uppercase">
              Out of Stock
            </span>
          </div>
        )}

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-100/90 to-rose-100/90 backdrop-blur-sm border border-pink-200">
            <span className="text-[9px] font-bold text-pink-500 uppercase tracking-wide">
              ✦ Featured
            </span>
          </div>
        )}

        {/* Quick actions — slide up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!inStock || loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: accentColor }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {!user && !loading ? "Sign in to Buy" : "Add to Bag"}
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors shrink-0">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        {/* Category dot-badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-foreground/70">
            {product.category}
          </span>
        </div>

        {/* Extra images indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-white font-medium">
              +{images.length - 1}
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Name */}
        <h3 className="font-serif text-lg leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-foreground/50 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-border/50">
          <div>
            <span className="text-base font-semibold text-foreground">
              ${Number(product.price).toFixed(2)}
            </span>
            <span
              className={`text-xs ml-2 font-medium ${
                product.stock === 0
                  ? "text-red-400"
                  : product.stock <= 5
                    ? "text-amber-500"
                    : "text-emerald-500"
              }`}
            >
              {product.stock === 0
                ? "Out of stock"
                : product.stock <= 5
                  ? `${product.stock} left`
                  : "In stock"}
            </span>
          </div>

          {/* Fallback add-to-cart button (mobile) */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock || loading}
            className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center text-black transition-all disabled:opacity-40"
            style={{ backgroundColor: accentColor }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          <span className="hidden sm:flex items-center text-xs text-foreground/30">
            View →
          </span>
        </div>
      </div>

      {/* Accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ backgroundColor: accentColor }}
      />
    </article>
  );
}
