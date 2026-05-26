import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

const pressFeatures = [
  {
    outlet: "Beauty Insider AU",
    date: "March 2025",
    headline:
      "The indie beauty boutiques redefining the Australian shopping experience",
    description:
      "SkyeAvenue was highlighted as one of a new generation of curated online beauty destinations putting curation and community above volume.",
    url: "#",
  },
  {
    outlet: "The Style Edit",
    date: "January 2025",
    headline: "15 Filipino-Australian brands worth bookmarking right now",
    description:
      "Featured as a top destination for discovering emerging Filipino skincare and beauty brands with a strong story behind every SKU.",
    url: "#",
  },
  {
    outlet: "Vogue Australia (Digital)",
    date: "November 2024",
    headline: "Small businesses embracing the slow beauty movement",
    description:
      "Quoted in a feature piece on how independent retailers are responding to consumer demand for mindful, ingredient-conscious beauty.",
    url: "#",
  },
];

const brandAssets = [
  { label: "Full Wordmark (SVG)", size: "Vector", href: "#" },
  { label: "Full Wordmark (PNG 2x)", size: "1200 × 300 px", href: "#" },
  { label: "Icon Mark (SVG)", size: "Vector", href: "#" },
  { label: "Brand Guidelines PDF", size: "1.2 MB", href: "#" },
];

export default function PressPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-16 md:py-28 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-4">
                Newsroom
              </p>
              <h1 className="text-4xl md:text-6xl font-serif font-semibold leading-tight">
                Press & Media
              </h1>
            </div>
            <a
              href="mailto:press@skye-avenue.com.au"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-medium hover:bg-foreground/90 transition-colors text-sm shrink-0"
            >
              <Mail className="w-4 h-4" />
              Press enquiries
            </a>
          </div>
        </div>
      </section>

      {/* About blurb for press */}
      <section className="container mx-auto px-4 py-16 max-w-5xl border-b border-border">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-4">
              About SkyeAvenue
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-4">
              SkyeAvenue is an Australian online beauty boutique specialising in
              curated skincare, wellness, and cosmetics from both established
              and emerging brands — with a particular focus on Filipino and
              Asian-Australian artisan labels.
            </p>
            <p className="text-foreground/60 leading-relaxed">
              Founded on the belief that great skin starts with great
              ingredients, we vet every product for efficacy, ethics, and story.
              We ship Australia-wide with carbon-offset delivery and accept
              Afterpay, Visa, Mastercard, and PayPal.
            </p>
          </div>
          <div className="bg-accent/5 rounded-2xl p-8 border border-border">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-foreground/40 mb-5">
              Quick Facts
            </h3>
            <dl className="flex flex-col gap-4">
              {[
                { term: "Founded", def: "2023" },
                { term: "Based in", def: "Australia" },
                { term: "Ships to", def: "Australia & select international" },
                { term: "Brands stocked", def: "40+" },
                { term: "Press contact", def: "press@skye-avenue.com.au" },
              ].map(({ term, def }) => (
                <div
                  key={term}
                  className="flex justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-foreground/50">{term}</dt>
                  <dd className="font-medium">{def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Press features */}
      <section className="container mx-auto px-4 py-16 max-w-5xl border-b border-border">
        <h2 className="text-2xl font-serif font-semibold mb-10">
          As Featured In
        </h2>
        <div className="flex flex-col gap-6">
          {pressFeatures.map((item) => (
            <a
              key={item.headline}
              href={item.url}
              className="group p-6 rounded-2xl border border-border hover:border-foreground/20 hover:bg-accent/5 transition-all duration-200 flex flex-col md:flex-row md:items-start gap-4"
            >
              <div className="md:w-40 shrink-0">
                <p className="text-xs font-semibold tracking-widest uppercase text-foreground/40">
                  {item.outlet}
                </p>
                <p className="text-xs text-foreground/30 mt-1">{item.date}</p>
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-semibold text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
                  {item.headline}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-foreground/30 shrink-0 group-hover:text-primary transition-colors mt-1 hidden md:block" />
            </a>
          ))}
        </div>
      </section>

      {/* Brand assets */}
      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <h2 className="text-2xl font-serif font-semibold mb-3">Brand Assets</h2>
        <p className="text-foreground/60 text-sm mb-8">
          Please use official assets only. Do not alter, recolour, or distort
          the logo. Usage outside editorial coverage requires written
          permission.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {brandAssets.map((asset) => (
            <a
              key={asset.label}
              href={asset.href}
              className="group flex flex-col gap-3 p-5 rounded-xl border border-border hover:border-foreground/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-foreground/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium leading-snug">
                  {asset.label}
                </p>
                <p className="text-xs text-foreground/40 mt-0.5">
                  {asset.size}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
