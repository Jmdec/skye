"use client";

import Link from "next/link";

const categories = [
  {
    name: "Skincare",
    href: "/products?category=skincare",
    tag: "Glow & Hydrate",
  },
  {
    name: "Fragrance",
    href: "/products?category=fragrance",
    tag: "Signature Scents",
  },
  { name: "Wellness", href: "/products?category=wellness", tag: "Body & Mind" },
  {
    name: "Skincare",
    href: "/products?category=skincare",
    tag: "Glow & Hydrate",
  },
  {
    name: "Fragrance",
    href: "/products?category=fragrance",
    tag: "Signature Scents",
  },
  { name: "Wellness", href: "/products?category=wellness", tag: "Body & Mind" },
];

const diamond = (
  <span
    aria-hidden="true"
    style={{
      display: "inline-block",
      width: 6,
      height: 6,
      background: "linear-gradient(135deg, #f472b6, #c084fc)",
      transform: "rotate(45deg)",
      opacity: 0.7,
      flexShrink: 0,
    }}
  />
);

export function CategoryMarquee() {
  return (
    <section
      style={{
        padding: "4rem 0",
        borderTop: "1px solid #f9a8d480",
        borderBottom: "1px solid #f9a8d480",
        background:
          "linear-gradient(180deg, #fff0f6 0%, #fdf4ff 50%, #fff0f6 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track-left {
          display: flex;
          width: max-content;
          animation: marquee-left 50s linear infinite;
        }
        .marquee-track-right {
          display: flex;
          width: max-content;
          animation: marquee-right 65s linear infinite;
        }
        .marquee-track-left:hover,
        .marquee-track-right:hover {
          animation-play-state: paused;
        }
        .cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 0.55rem 1.6rem;
          border: 1px solid #f9a8d4;
          border-radius: 999px;
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #be185d;
          background: rgba(255,255,255,0.6);
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.25s ease;
          font-family: var(--font-sans, sans-serif);
          backdrop-filter: blur(4px);
        }
        .cat-pill:hover {
          background: linear-gradient(135deg, #fce7f3, #faf5ff);
          border-color: #e879f9;
          color: #86198f;
          box-shadow: 0 0 0 3px #f0abfc40;
        }
        .cat-label-big {
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-family: var(--font-serif, serif);
          font-weight: 400;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          white-space: nowrap;
          padding: 0 1.5rem;
          line-height: 1;
          transition: opacity 0.2s;
        }
        .cat-label-big:hover {
          opacity: 0.75;
        }
      `}</style>

      {/* Section heading */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            background: "linear-gradient(90deg, #ec4899, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "var(--font-sans, sans-serif)",
          }}
        >
          Explore our collection
        </p>
      </div>

      {/* Row 1 — large serif names scrolling left */}
      <div style={{ overflow: "hidden", marginBottom: "1.25rem" }}>
        <div className="marquee-track-left" aria-hidden="true">
          {[...Array(4)].flatMap((_, i) =>
            ["Skincare", "Fragrance", "Wellness"].map((name, j) => (
              <span
                key={`${i}-${j}`}
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <a
                  href={`/products?category=${name.toLowerCase()}`}
                  className="cat-label-big"
                  tabIndex={-1}
                >
                  {name}
                </a>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 7,
                    background: "linear-gradient(135deg, #f472b6, #c084fc)",
                    transform: "rotate(45deg)",
                    margin: "0 0.5rem",
                    flexShrink: 0,
                    opacity: 0.6,
                  }}
                />
              </span>
            )),
          )}
        </div>
      </div>

      {/* Row 2 — pill tags scrolling right */}
      <div style={{ overflow: "hidden" }}>
        <div className="marquee-track-right">
          {[...Array(6)].flatMap((_, i) =>
            categories.map((cat, j) => (
              <span
                key={`${i}-${j}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  margin: "0 8px",
                }}
              >
                <Link href={cat.href} className="cat-pill">
                  {diamond}
                  {cat.name}
                  <span style={{ opacity: 0.5, fontWeight: 300 }}>
                    — {cat.tag}
                  </span>
                  {diamond}
                </Link>
              </span>
            )),
          )}
        </div>
      </div>

      {/* Fade edges */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to right, #fff0f6 0%, transparent 8%, transparent 92%, #fff0f6 100%)",
        }}
      />
    </section>
  );
}
