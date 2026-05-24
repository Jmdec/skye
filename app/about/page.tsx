import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ValueCard } from "@/components/ValueCard";

export const metadata = {
  title: "About Us | Skye Avenue",
  description: "Discover the story behind Skye Avenue luxury beauty",
};

const values = [
  {
    num: "I",
    name: "Quality First",
    body: "Not trending — genuinely excellent. Every product meets our rigorous standard before it reaches you.",
  },
  {
    num: "II",
    name: "Authenticity",
    body: "Sourced direct from luxury houses. 100% authentic, always — no compromises.",
  },
  {
    num: "III",
    name: "You, First",
    body: "Your satisfaction is our promise. We stand behind everything we offer.",
  },
];

const pills = [
  { icon: "✦", label: "Our promise", value: "Every product earns its place" },
  { icon: "◈", label: "Sourced from", value: "Luxury brands worldwide" },
  { icon: "❋", label: "Committed to", value: "Sustainable, ethical beauty" },
];

export default function AboutPage() {
  return (
    <div
      style={{
        fontFamily: "'Jost', sans-serif",
        fontWeight: 300,
        background: "#fff0f5",
      }}
    >
      <Header />

      <main>
        {/* HERO */}
        <section
          style={{
            background:
              "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 30%, #f9a8d4 60%, #f472b6 100%)",
            padding: "52px 40px 48px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <div style={{ animation: "heroFadeIn 0.7s ease both" }}>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: ".28em",
                textTransform: "uppercase",
                color: "#9d174d",
                marginBottom: "14px",
                opacity: 0.8,
              }}
            >
              Est. Sydney, Australia
            </p>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(44px, 6vw, 72px)",
                fontWeight: 300,
                lineHeight: 1.05,
                color: "#500724",
              }}
            >
              Beauty,{" "}
              <em style={{ fontStyle: "italic", color: "#be185d" }}>curated</em>
              <br />
              for you.
            </h1>
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.75,
                color: "#831843",
                marginTop: "16px",
                maxWidth: "300px",
                opacity: 0.85,
              }}
            >
              We find the world&apos;s finest beauty — so you don&apos;t have
              to. Premium, intentional, and always 100% authentic.
            </p>
          </div>

          {/* RIGHT — animated compact 3-card grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            {pills.map((pill, i) => (
              <div
                key={pill.label}
                className="pill-card"
                style={{
                  background: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.65)",
                  borderRadius: "14px",
                  padding: "16px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  backdropFilter: "blur(6px)",
                  animation: `cardFadeUp 0.6s ease both`,
                  animationDelay: `${0.15 + i * 0.12}s`,
                  cursor: "default",
                  transition:
                    "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
                }}
              >
                <div
                  className="pill-icon"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f9a8d4, #ec4899)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    flexShrink: 0,
                    transition: "transform 0.35s ease",
                  }}
                >
                  {pill.icon}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "9px",
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      color: "#9d174d",
                      marginBottom: "4px",
                      opacity: 0.8,
                    }}
                  >
                    {pill.label}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#500724",
                      fontWeight: 400,
                      lineHeight: 1.4,
                    }}
                  >
                    {pill.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VALUES */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            borderTop: "1px solid rgba(236,72,153,0.2)",
          }}
        >
          {values.map((val, i) => (
            <ValueCard
              key={val.num}
              num={val.num}
              name={val.name}
              body={val.body}
              borderRight={i < 2}
            />
          ))}
        </div>

        {/* STORY */}
        <section
          style={{
            padding: "56px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "56px",
            alignItems: "center",
            background:
              "linear-gradient(160deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: "#ec4899",
                marginBottom: "12px",
              }}
            >
              Our origin
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "40px",
                fontWeight: 300,
                color: "#500724",
                lineHeight: 1.1,
                marginBottom: "20px",
              }}
            >
              Born from a <em style={{ fontStyle: "italic" }}>passion</em>
              <br />
              for beauty.
            </h2>
            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#831843",
                opacity: 0.8,
              }}
            >
              <p>
                Skye Avenue started as a personal pursuit — the search for
                products that truly deliver. What began as a private collection
                became a curated marketplace for women who refuse to settle.
              </p>
              <p style={{ marginTop: "12px" }}>
                We believe beauty is about feeling confident, not just looking
                it. Every product we carry reflects that belief.
              </p>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              maxWidth: "260px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                aspectRatio: "1/1",
                background:
                  "linear-gradient(135deg, #fce7f3, #f9a8d4, #f472b6)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "96px",
                  fontWeight: 300,
                  color: "rgba(157,23,77,0.18)",
                  fontStyle: "italic",
                  userSelect: "none",
                }}
              >
                SA
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                right: "-8px",
                background: "#fff",
                border: "1px solid rgba(236,72,153,0.25)",
                borderRadius: "12px",
                padding: "10px 16px",
                boxShadow: "0 4px 20px rgba(236,72,153,0.15)",
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
                Founded in
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "20px",
                  color: "#500724",
                }}
              >
                Sydney, AU
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            background:
              "linear-gradient(135deg, #db2777 0%, #ec4899 40%, #f472b6 70%, #f9a8d4 100%)",
            padding: "56px 40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "48px",
              fontWeight: 300,
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: "12px",
            }}
          >
            Let&apos;s <em style={{ fontStyle: "italic" }}>connect.</em>
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.8)",
              marginBottom: "32px",
            }}
          >
            Questions or curiosity — we&apos;d love to hear from you.
          </p>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#fff",
              color: "#be185d",
              padding: "14px 32px",
              borderRadius: "100px",
              fontSize: "11px",
              letterSpacing: ".2em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Get in Touch →
          </Link>
        </section>
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        /* ── Page load: left text slides in from left ── */
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateX(-18px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Cards stagger fade up on load ── */
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Hover: lift + glow ── */
        .pill-card:hover {
          transform: translateY(-6px) scale(1.04) !important;
          box-shadow: 0 18px 40px rgba(236, 72, 153, 0.2);
          background: rgba(255, 255, 255, 0.75) !important;
        }

        /* ── Icon rotates + scales on card hover ── */
        .pill-card:hover .pill-icon {
          transform: rotate(20deg) scale(1.18);
        }

        /* ── Shimmer sweep across card on hover ── */
        .pill-card {
          position: relative;
          overflow: hidden;
        }

        .pill-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 25%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 75%
          );
          transform: translateX(-100%);
          transition: transform 0.55s ease;
          pointer-events: none;
          border-radius: 14px;
        }

        .pill-card:hover::after {
          transform: translateX(120%);
        }
      `}</style>
    </div>
  );
}
