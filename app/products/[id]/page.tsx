"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Tag,
  DollarSign,
  Package,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { ApiProduct } from "@/components/products-grid";

// ── Types ─────────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  skincare: "#f9a8c9",
  fragrance: "#c4b5fd",
  wellness: "#86efac",
};

const catColor = (c: string) => CATEGORY_COLORS[c?.toLowerCase()] ?? "#f9a8c9";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [related, setRelated] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { addItem } = useCart();

  // ── Fetch product ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    setActiveIdx(0);
    setQuantity(1);

    (async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const json = await res.json();
        if (res.status === 404) {
          router.replace("/404");
          return;
        }
        if (!res.ok) throw new Error(json.message ?? "Failed to load product");

        const p: ApiProduct = json.data;
        setProduct(p);

        // Set active image to the primary one
        const primaryIdx = p.images.findIndex((i) => i.isPrimary);
        setActiveIdx(primaryIdx >= 0 ? primaryIdx : 0);

        // Fetch related (same category)
        const allRes = await fetch("/api/products");
        const allJson = await allRes.json();
        if (allRes.ok) {
          const others: ApiProduct[] = (allJson.data ?? []).filter(
            (x: ApiProduct) =>
              x.category.toLowerCase() === p.category.toLowerCase() &&
              x.id !== p.id,
          );
          setRelated(others.slice(0, 3));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  // ── Cart handlers ─────────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 300));
    const primaryImage =
      product.images.find((i) => i.isPrimary) ?? product.images[0];
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: primaryImage?.url ?? "",
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

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-primary/60">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading product…</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm max-w-lg">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error || "Product not found"}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────
  const accentColor = catColor(product.category);
  const images = product.images;
  const activeImage = images[activeIdx];
  const inStock = product.stock > 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* ── Breadcrumb ── */}
        <div className="border-b border-border/60 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-xs text-foreground/40">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.toLowerCase()}`}
              className="hover:text-foreground transition-colors capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground/70 truncate max-w-[200px]">
              {product.name}
            </span>
          </div>
        </div>

        {/* ── Hero Product Section ── */}
        <section className="py-10 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* ── Left: Images ── */}
              <div className="lg:sticky lg:top-20 space-y-3">
                {/* Main image */}
                <div
                  className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-border/40 shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}18 0%, #fdf6f9 100%)`,
                  }}
                >
                  {activeImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeImage.url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-pink-200" />
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-foreground/70">
                      {product.category}
                    </span>
                  </div>

                  {/* Featured badge */}
                  {product.featured && (
                    <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-100/90 to-rose-100/90 backdrop-blur-sm border border-pink-200">
                      <span className="text-[9px] font-bold text-pink-500 uppercase tracking-wide">
                        ✦ Featured
                      </span>
                    </div>
                  )}

                  {/* Out of stock overlay */}
                  {!inStock && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                      <span className="text-white font-semibold tracking-wide">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Image nav arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveIdx(
                            (i) => (i - 1 + images.length) % images.length,
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveIdx((i) => (i + 1) % images.length)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveIdx(idx)}
                            className={`h-1.5 rounded-full transition-all ${
                              idx === activeIdx
                                ? "bg-pink-500 w-4"
                                : "bg-white/60 w-1.5"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveIdx(idx)}
                        className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                          idx === activeIdx
                            ? "border-pink-400"
                            : "border-pink-100 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Stock pill */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted/60 rounded-full border border-border/50">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {inStock
                        ? product.stock <= 5
                          ? `Only ${product.stock} left`
                          : "In Stock"
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Right: Info ── */}
              <div className="flex flex-col gap-8">
                {/* Heading */}
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.25em] font-medium mb-3"
                    style={{ color: accentColor }}
                  >
                    {product.category}
                  </p>
                  <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground leading-tight tracking-tight">
                    {product.name}
                  </h1>
                  <p className="text-foreground/50 mt-3 text-base leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-serif font-semibold text-foreground">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>

                {/* Quick info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-100">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">
                        Price
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">
                        Stock
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {product.stock}
                    </p>
                    <p
                      className={`text-xs mt-0.5 font-medium ${
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
                          ? "Low stock"
                          : "In stock"}
                    </p>
                  </div>
                </div>

                {/* Category tag */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-pink-400" />
                  <span className="px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-xs text-gray-600 font-medium">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-200 text-xs text-pink-500 font-semibold uppercase tracking-wide">
                      ✦ Featured
                    </span>
                  )}
                </div>

                <div className="h-px bg-border/50" />

                {/* Quantity + Add to Cart */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">
                      Quantity
                    </span>
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity === 1 || !inStock}
                        className="p-2 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 border-l border-r border-border text-center min-w-[50px]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        disabled={!inStock}
                        className="p-2 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!inStock || isAdding}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: accentColor }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {isAdding ? "Adding…" : "Add to Bag"}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={!inStock || isAdding}
                      className="w-full py-3 px-6 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: "✦", label: "Free shipping", sub: "Over $100" },
                    { icon: "◎", label: "Clean formula", sub: "No nasties" },
                    { icon: "↺", label: "Easy returns", sub: "30-day policy" },
                  ].map((badge) => (
                    <div
                      key={badge.label}
                      className="flex flex-col items-center text-center p-3 rounded-2xl bg-muted/40 border border-border/40 gap-1.5"
                    >
                      <span
                        className="text-base"
                        style={{ color: accentColor }}
                      >
                        {badge.icon}
                      </span>
                      <span className="text-[11px] font-semibold text-foreground/80">
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-foreground/40">
                        {badge.sub}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-gray-300">
                  Added {product.createdAt}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="py-12 sm:py-16 border-t border-border/60">
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 font-medium mb-2">
                    You May Also Like
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground capitalize">
                    More {product.category}
                  </h2>
                </div>
                <Link
                  href={`/products?category=${product.category.toLowerCase()}`}
                  className="text-xs text-foreground/50 hover:text-primary transition-colors underline underline-offset-4"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <a key={p.id} href={`/products/${p.id}`}>
                    <ProductCard product={p} />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
