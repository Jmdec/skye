"use client";

import { Suspense, useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductsGrid } from "@/components/products-grid";
import { useSearchParams } from "next/navigation";

interface CategoryStat {
  label: string;
  color: string;
  count: number;
}

interface BackendProduct {
  id: string;
  category: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  skincare: "linear-gradient(135deg,#f9a8d4,#ec4899)",
  fragrance: "linear-gradient(135deg,#fbb6ce,#f472b6)",
  wellness: "linear-gradient(135deg,#fda4af,#fb7185)",
  makeup: "linear-gradient(135deg,#fce7f3,#be185d)",
};

const CATEGORY_ICONS: Record<string, string> = {
  skincare: "✦",
  fragrance: "◈",
  wellness: "❋",
  makeup: "◉",
};

const FALLBACK_CATS = [
  { label: "Skincare", color: CATEGORY_COLORS.skincare },
  { label: "Fragrance", color: CATEGORY_COLORS.fragrance },
  { label: "Wellness", color: CATEGORY_COLORS.wellness },
  { label: "Makeup", color: CATEGORY_COLORS.makeup },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const sort = searchParams.get("sort") ?? undefined;

  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (!res.ok) return;
        const products: BackendProduct[] = json.data ?? [];
        const counts: Record<string, number> = {};
        products.forEach((p) => {
          const cat = p.category.toLowerCase();
          counts[cat] = (counts[cat] ?? 0) + 1;
        });
        const stats: CategoryStat[] = Object.entries(counts).map(
          ([cat, count]) => ({
            label: cat.charAt(0).toUpperCase() + cat.slice(1),
            color:
              CATEGORY_COLORS[cat] ?? "linear-gradient(135deg,#f9a8d4,#ec4899)",
            count,
          }),
        );
        setCategoryStats(stats);
      } catch {
        /* silently ignore */
      }
    })();
  }, []);

  const displayCats = categoryStats.length > 0 ? categoryStats : FALLBACK_CATS;

  return (
    <main style={{ overflowX: "hidden" }}>
      {/* ── HERO ── */}
      <section
        className="hero-section"
        style={{
          background:
            "linear-gradient(135deg,#fce7f3 0%,#fbcfe8 30%,#f9a8d4 60%,#f472b6 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.18,
            backgroundImage:
              "radial-gradient(circle,#be185d 1.2px,transparent 1.2px)",
            backgroundSize: "18px 18px",
            maskImage: "linear-gradient(to left,black 0%,transparent 60%)",
            WebkitMaskImage:
              "linear-gradient(to left,black 0%,transparent 60%)",
          }}
        />
        {/* Blob top-right */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(244,114,182,0.35),transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Blob bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: "20%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(251,207,232,0.4),transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Hero inner grid ── */}
        <div className="hero-inner">
          {/* ── LEFT: Text content ── */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              className="hero-eyebrow"
              style={{
                fontSize: "10px",
                letterSpacing: ".28em",
                textTransform: "uppercase",
                color: "#9d174d",
                marginBottom: "16px",
                opacity: 0.8,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span className="hero-line" />
              Est. Sydney, Australia
            </p>

            <h1
              className="hero-title"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(36px,6vw,76px)",
                fontWeight: 300,
                lineHeight: 1.02,
                color: "#500724",
                marginBottom: "16px",
              }}
            >
              Our{" "}
              <em style={{ fontStyle: "italic", color: "#be185d" }}>
                Collection
              </em>
            </h1>

            <p
              className="hero-sub"
              style={{
                fontSize: "13px",
                lineHeight: 1.75,
                color: "#831843",
                opacity: 0.85,
                maxWidth: "340px",
                marginBottom: "28px",
              }}
            >
              Carefully curated luxury beauty — skincare, fragrance &amp;
              wellness for the modern woman.
            </p>

            <div className="hero-divider" />

            {/* Category pills */}
            <div
              className="hero-pills"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "28px",
              }}
            >
              {displayCats.map((cat) => (
                <a
                  key={cat.label}
                  href={`/products?category=${cat.label.toLowerCase()}`}
                  className="cat-pill"
                >
                  <span className="cat-dot" style={{ background: cat.color }} />
                  {cat.label}
                  {"count" in cat && (
                    <span
                      style={{
                        fontSize: "10px",
                        opacity: 0.55,
                        marginLeft: "2px",
                      }}
                    >
                      ({(cat as CategoryStat).count})
                    </span>
                  )}
                </a>
              ))}
            </div>

            {/* Stats */}
            <div
              className="hero-stats"
              style={{ display: "flex", gap: "32px" }}
            >
              {[
                ["50+", "Products"],
                ["4", "Categories"],
                ["100%", "Authentic"],
              ].map(([num, label]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "32px",
                      fontWeight: 300,
                      lineHeight: 1,
                      color: "#be185d",
                    }}
                  >
                    {num}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: ".18em",
                      color: "#9d174d",
                      opacity: 0.7,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Decorative category cards — hidden on mobile ── */}
          <div
            className="hero-right"
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {displayCats.map((cat, i) => (
              <a
                key={cat.label}
                href={`/products?category=${cat.label.toLowerCase()}`}
                className="deco-card"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: cat.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                    marginBottom: "10px",
                    transition: "transform 0.35s ease",
                  }}
                  className="deco-icon"
                >
                  {CATEGORY_ICONS[cat.label.toLowerCase()] ?? "✦"}
                </div>

                <p
                  style={{
                    fontSize: "9px",
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "#9d174d",
                    opacity: 0.7,
                    marginBottom: "4px",
                  }}
                >
                  Category
                </p>

                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "18px",
                    fontWeight: 300,
                    color: "#500724",
                    lineHeight: 1.2,
                    marginBottom: "8px",
                  }}
                >
                  {cat.label}
                </p>

                {"count" in cat && (
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#ec4899",
                      opacity: 0.8,
                    }}
                  >
                    {(cat as CategoryStat).count} products
                  </p>
                )}

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "10px",
                    color: "#ec4899",
                    marginTop: "8px",
                  }}
                >
                  Shop →
                </span>

                {/* Bottom accent line */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background:
                      "linear-gradient(90deg,#be185d,#ec4899,#f9a8d4)",
                  }}
                />
              </a>
            ))}

            {/* Floating badge — contained within hero-right, no negative offsets */}
            <div
              className="hero-badge"
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "#fff",
                border: "1px solid rgba(236,72,153,0.25)",
                borderRadius: "12px",
                padding: "10px 16px",
                boxShadow: "0 4px 20px rgba(236,72,153,0.15)",
                zIndex: 2,
              }}
            >
              <p
                style={{
                  fontSize: "9px",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "#ec4899",
                  marginBottom: "2px",
                }}
              >
                Curated
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "18px",
                  color: "#500724",
                  lineHeight: 1,
                }}
              >
                Luxury Only
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products Section ── */}
      <section style={{ paddingTop: "40px", paddingBottom: "56px" }}>
        <ProductsGrid category={category} sort={sort} />
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <div
      style={{
        fontFamily: "'Jost', sans-serif",
        fontWeight: 300,
        background: "#fff0f5",
        overflowX: "hidden",
      }}
    >
      <Header />

      <Suspense
        fallback={
          <div
            style={{
              padding: "80px 40px",
              textAlign: "center",
              color: "#be185d",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "22px",
              fontWeight: 300,
            }}
          >
            Loading collection…
          </div>
        }
      >
        <ProductsContent />
      </Suspense>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        @keyframes fadeSlideLeft {
          from { opacity:0; transform:translateX(-16px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes lineGrow {
          from { width:0; }
          to   { width:36px; }
        }
        @keyframes dividerGrow {
          from { width:0; }
          to   { width:100%; }
        }
        @keyframes cardFadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes badgePop {
          from { opacity:0; transform:scale(0.85) translateY(-8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }

        /* ── Hero layout ── */
        .hero-section {
          overflow: hidden;
        }
        .hero-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          padding: 48px 24px 44px;
          position: relative;
          align-items: center;
        }
        @media (min-width: 768px) {
          .hero-inner {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            padding: 52px 40px 48px;
          }
        }

        /* Hide right deco cards on mobile */
        .hero-right {
          display: none;
        }
        @media (min-width: 768px) {
          .hero-right {
            display: grid !important;
          }
        }

        .hero-eyebrow { opacity:0; animation: fadeSlideLeft 0.55s ease 0.1s forwards; }
        .hero-line {
          display:inline-block; height:1px; width:0; vertical-align:middle;
          background:linear-gradient(90deg,#be185d,#f9a8d4);
          animation: lineGrow 0.6s ease 0.4s forwards;
        }
        .hero-title  { opacity:0; animation: fadeUp 0.6s ease 0.2s  forwards; }
        .hero-sub    { opacity:0; animation: fadeUp 0.6s ease 0.35s forwards; }
        .hero-divider {
          height:1px; width:0; margin-bottom:24px;
          background:linear-gradient(90deg,#f472b6,#fce7f3,transparent);
          animation: dividerGrow 0.8s ease 0.5s forwards;
        }
        .hero-pills  { opacity:0; animation: fadeUp 0.5s ease 0.65s forwards; }
        .hero-stats  { opacity:0; animation: fadeUp 0.5s ease 0.8s  forwards; }
        .hero-badge  { opacity:0; animation: badgePop 0.5s ease 0.9s forwards; }

        .cat-pill {
          display:inline-flex; align-items:center; gap:8px;
          padding:6px 16px; border-radius:999px;
          border:1px solid rgba(236,72,153,0.3);
          background:rgba(255,255,255,0.5);
          font-family:'Jost',sans-serif; font-size:11px; font-weight:400;
          color:#9d174d; text-decoration:none;
          backdrop-filter:blur(6px);
          transition:all 0.25s ease;
          position:relative; overflow:hidden;
        }
        .cat-pill::after {
          content:''; position:absolute; inset:0; border-radius:999px;
          background:linear-gradient(110deg,transparent 25%,rgba(255,255,255,0.55) 50%,transparent 75%);
          transform:translateX(-100%); transition:transform 0.5s ease;
        }
        .cat-pill:hover { background:rgba(255,255,255,0.75); border-color:#ec4899; color:#be185d; transform:translateY(-3px); box-shadow:0 8px 24px rgba(236,72,153,0.15); }
        .cat-pill:hover::after { transform:translateX(120%); }
        .cat-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; transition:transform 0.25s ease; }
        .cat-pill:hover .cat-dot { transform:scale(1.4); }

        .deco-card {
          background:rgba(255,255,255,0.5);
          border:1px solid rgba(255,255,255,0.65);
          border-radius:14px; padding:18px 16px;
          display:flex; flex-direction:column;
          backdrop-filter:blur(6px);
          text-decoration:none;
          position:relative; overflow:hidden;
          opacity:0;
          animation: cardFadeUp 0.55s ease both;
          transition:transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
          cursor:pointer;
        }
        .deco-card::after {
          content:''; position:absolute; inset:0; border-radius:14px;
          background:linear-gradient(110deg,transparent 25%,rgba(255,255,255,0.5) 50%,transparent 75%);
          transform:translateX(-100%); transition:transform 0.55s ease;
          pointer-events:none;
        }
        .deco-card:hover {
          transform:translateY(-5px) scale(1.03);
          box-shadow:0 16px 36px rgba(236,72,153,0.18);
          background:rgba(255,255,255,0.72);
        }
        .deco-card:hover::after { transform:translateX(120%); }
        .deco-card:hover .deco-icon { transform:rotate(20deg) scale(1.15); }
      `}</style>
    </div>
  );
}
