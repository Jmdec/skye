"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1400&auto=format&fit=crop&q=80",
    label: "Skincare",
    headline: "Luminous",
    subheadline: "Radiance",
    description: "Vitamin C serums & botanicals that transform your glow",
    cta: "Shop Skincare",
    accent: "#f9a8c9",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1590580463662-88d585eda98f?w=1400&auto=format&fit=crop&q=80",
    label: "Fragrance",
    headline: "Velvet",
    subheadline: "Bloom",
    description: "Intoxicating florals drawn from an Australian native garden",
    cta: "Shop Fragrance",
    accent: "#f3c4d3",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=1400&auto=format&fit=crop&q=80",
    label: "Night Care",
    headline: "Silk",
    subheadline: "Renewal",
    description: "Peptide-rich night creams that work while you rest",
    cta: "Shop Night Care",
    accent: "#e8b4c8",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1400&auto=format&fit=crop&q=80",
    label: "Wellness",
    headline: "Inner",
    subheadline: "Harmony",
    description: "Botanical teas & oils for mind, body and spirit",
    cta: "Shop Wellness",
    accent: "#c8d8b4",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1400&auto=format&fit=crop&q=80",
    label: "Aromatherapy",
    headline: "Pure",
    subheadline: "Essence",
    description: "Essential oils sourced from nature's finest botanicals",
    cta: "Shop Oils",
    accent: "#d4c4f0",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  const DURATION = 5000;

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setPrev(current);
      setCurrent(index);
      setAnimating(true);
      setProgress(0);
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 800);
    },
    [animating, current],
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(next, DURATION);
    return () => clearInterval(interval);
  }, [next]);

  // Progress bar
  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / DURATION) * 100, 100));
      if (elapsed < DURATION) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [current]);

  const slide = slides[current];
  const prevSlide = prev !== null ? slides[prev] : null;

  return (
    <section className="relative overflow-hidden bg-black min-h-[90vh] flex items-end">
      {/* ── Background images ── */}
      {prevSlide && (
        <div
          key={`prev-${prev}`}
          className="absolute inset-0 z-0"
          style={{ animation: "slideOut 0.8s ease forwards" }}
        >
          <img
            src={prevSlide.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        </div>
      )}

      <div
        key={`curr-${current}`}
        className="absolute inset-0 z-10"
        style={{ animation: "slideIn 0.8s ease forwards" }}
      >
        <img
          src={slide.image}
          alt={slide.label}
          className="w-full h-full object-cover"
          style={{ animation: "zoomIn 6s ease forwards" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-20 w-full pb-16 pt-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          {/* Left: headline */}
          <div>
            {/* Label pill */}
            <div
              key={`label-${current}`}
              className="inline-flex items-center gap-2 mb-6"
              style={{ animation: "fadeUp 0.6s 0.1s both" }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: slide.accent }}
              />
              <span
                className="text-xs uppercase tracking-[0.25em] font-medium"
                style={{ color: slide.accent }}
              >
                {slide.label}
              </span>
            </div>

            {/* Big headline */}
            <h1
              key={`h1-${current}`}
              className="font-serif leading-none text-white mb-4"
              style={{ animation: "fadeUp 0.7s 0.2s both" }}
            >
              <span className="block text-[clamp(4rem,10vw,9rem)] font-light tracking-tight opacity-90">
                {slide.headline}
              </span>
              <span
                className="block text-[clamp(4rem,10vw,9rem)] font-semibold italic tracking-tight -mt-4"
                style={{ color: slide.accent }}
              >
                {slide.subheadline}
              </span>
            </h1>

            <p
              key={`desc-${current}`}
              className="text-white/60 text-base sm:text-lg max-w-sm leading-relaxed mb-8"
              style={{ animation: "fadeUp 0.7s 0.35s both" }}
            >
              {slide.description}
            </p>

            <div
              key={`cta-${current}`}
              className="flex flex-wrap gap-3"
              style={{ animation: "fadeUp 0.7s 0.45s both" }}
            >
              <Link href="/products">
                <Button
                  className="rounded-full h-12 px-8 text-sm font-semibold tracking-wide text-black gap-2"
                  style={{ backgroundColor: slide.accent }}
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="ghost"
                  className="rounded-full h-12 px-8 text-sm font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/40"
                >
                  Our Story
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: stats + nav */}
          <div className="flex flex-col items-start lg:items-end gap-8">
            {/* Stats */}
            <div
              className="flex items-center gap-8"
              style={{ animation: "fadeUp 0.7s 0.5s both" }}
            >
              {[
                { value: "500+", label: "Products" },
                { value: "10k+", label: "Customers" },
                { value: "4.9★", label: "Rating" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-right">
                  <p className="text-2xl font-serif font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/40 tracking-wide mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Slide thumbnails / nav */}
            <div className="flex items-center gap-3">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className="relative group overflow-hidden rounded-xl transition-all duration-500"
                  style={{
                    width: i === current ? 80 : 48,
                    height: 56,
                    outline:
                      i === current
                        ? `2px solid ${slide.accent}`
                        : "2px solid transparent",
                    outlineOffset: 2,
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <img
                    src={s.image}
                    alt={s.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.3)",
                      opacity: i === current ? 0 : 0.5,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <div
            className="h-full transition-none"
            style={{
              width: `${progress}%`,
              backgroundColor: slide.accent,
            }}
          />
        </div>

        {/* ── Slide counter ── */}
        <div className="absolute top-6 right-6 sm:right-12 lg:right-20 text-white/40 text-xs font-mono tracking-widest">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </div>

        {/* ── Brand badge top-left ── */}
        <div className="absolute top-6 left-6 sm:left-12 lg:left-20">
          <span className="text-white/80 text-xs uppercase tracking-[0.3em] font-medium">
            Premium Australian Beauty
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes zoomIn {
          from {
            transform: scale(1.08);
          }
          to {
            transform: scale(1);
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
