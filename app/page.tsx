"use client"
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import { FeaturedProducts } from "@/components/featured-products";
import { CategoryMarquee } from "@/components/category-marquee";
import { NewsletterSection } from "@/components/newsletter-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <HeroSection />

        {/* Categories Marquee */}
        <CategoryMarquee />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Trust Section */}
        <section
          className="border-y"
          style={{
            padding: "2.5rem 0",
            background:
              "linear-gradient(135deg, #fff0f6 0%, #fdf4ff 50%, #fff0f6 100%)",
            borderColor: "#f9a8d450",
          }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <p
                className="text-xs uppercase tracking-widest mb-2"
                style={{
                  background: "linear-gradient(90deg, #ec4899, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Why shop with us
              </p>

              <h2
                className="font-serif text-3xl font-normal tracking-tight"
                style={{ color: "#831843" }}
              >
                Beauty, redefined for you.
              </h2>
            </div>

            <style jsx>{`
              @keyframes trustFadeUp {
                from {
                  opacity: 0;
                  transform: translateY(22px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @keyframes trustNumPop {
                from {
                  opacity: 0;
                  transform: scale(0.7);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }

              .trust-card {
                opacity: 0;
                animation: trustFadeUp 0.6s ease forwards;
              }

              .trust-card:nth-child(1) {
                animation-delay: 0.1s;
              }
              .trust-card:nth-child(2) {
                animation-delay: 0.25s;
              }
              .trust-card:nth-child(3) {
                animation-delay: 0.4s;
              }

              .trust-num {
                display: inline-block;
                animation: trustNumPop 0.45s
                  cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                animation-delay: 0.3s;
                opacity: 0;
              }
            `}</style>

            <div className="grid grid-cols-1 sm:grid-cols-3">
              {[
                {
                  num: "01",
                  title: "Luxury Within Reach",
                  body: "Premium beauty shouldn't cost a fortune. We bring you high-end products at prices that actually make sense.",
                },
                {
                  num: "02",
                  title: "Thoughtfully Curated",
                  body: "Every product earns its place. We hand-pick only the pieces we truly believe in — no fillers, no fluff.",
                },
                {
                  num: "03",
                  title: "Beauty Worth Exploring",
                  body: "From skincare rituals to signature scents, discover products that feel like a treat every single time.",
                },
              ].map((item, i, arr) => (
                <div
                  key={item.num}
                  className="trust-card flex flex-col gap-3 p-6"
                  style={{
                    borderRight:
                      i < arr.length - 1 ? "1px solid #f9a8d460" : "none",
                  }}
                >
                  <span
                    className="trust-num font-serif leading-none"
                    style={{
                      fontSize: "2.8rem",
                      background:
                        "linear-gradient(135deg, #ec4899, #a855f7)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {item.num}
                  </span>

                  <div
                    style={{
                      height: 2,
                      width: 28,
                      background:
                        "linear-gradient(90deg, #ec4899, #a855f7)",
                      borderRadius: 99,
                    }}
                  />

                  <p
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: "#9d174d" }}
                  >
                    {item.title}
                  </p>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#be185d", opacity: 0.75 }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}