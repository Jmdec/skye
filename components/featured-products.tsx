"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ApiProduct } from "@/components/products-grid";

export function FeaturedProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        const all: ApiProduct[] = Array.isArray(data)
          ? data
          : (data.data ?? data.products ?? []);

        // Filter featured first, fall back to first 6 if none are flagged
        const featured = all.filter((p) => p.featured);
        setProducts((featured.length > 0 ? featured : all).slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Featured Collection
            </h2>
            <p className="text-foreground/60">
              Our most-loved products handpicked for you
            </p>
          </div>

          <Link href="/products" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              className="w-full sm:w-auto text-primary hover:bg-primary/10 rounded-md"
            >
              View All Products
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-foreground/40 py-12">
            No featured products available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
