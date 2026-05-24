"use client";

import { useEffect, useState, useMemo } from "react";
import { Loader2, AlertCircle, PackageX } from "lucide-react";
import { ProductCard } from "@/components/product-card";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ApiProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  featured: boolean;
  createdAt: string;
  images: ApiImage[];
}

interface ProductsGridProps {
  category?: string;
  sort?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProductsGrid({ category, sort }: ProductsGridProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    (async () => {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Failed to load products");
        setProducts(json.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = products;

    // Filter by category
    if (category) {
      list = list.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }

    // Sort
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
        list = [...list].sort(
          (a, b) => Number(b.featured) - Number(a.featured),
        );
        break;
      default:
        break;
    }

    return list;
  }, [products, category, sort]);

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-32 gap-3 text-primary/60">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading products…</span>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm max-w-lg mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────

  if (filtered.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-foreground/40">
          <PackageX className="w-10 h-10" />
          <p className="text-sm">
            {category
              ? `No products found in "${category}"`
              : "No products available"}
          </p>
        </div>
      </div>
    );
  }

  // ── Grid ──────────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-foreground/40 uppercase tracking-widest font-medium">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          {category ? ` in ${category}` : ""}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product) => (
          <a key={product.id} href={`/products/${product.id}`}>
            <ProductCard product={product} />
          </a>
        ))}
      </div>
    </div>
  );
}
