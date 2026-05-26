import Link from "next/link";
import { Leaf, Recycle, Heart, Globe, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: Leaf,
    title: "Conscious Sourcing",
    body: "Every product we carry is vetted for responsible ingredient sourcing. We partner with brands that prioritise cruelty-free formulations, ethically harvested botanicals, and transparent supply chains.",
  },
  {
    icon: Recycle,
    title: "Minimal Packaging",
    body: "We're progressively moving to recycled mailers, compostable tissue paper, and plastic-free tape. Our goal is zero single-use plastic in all outgoing orders by 2026.",
  },
  {
    icon: Heart,
    title: "Community First",
    body: "A portion of every order supports local women-led initiatives in the Philippines and Australia. Beauty should uplift — inside the bottle and beyond it.",
  },
  {
    icon: Globe,
    title: "Carbon-Offset Shipping",
    body: "We calculate the carbon footprint of every shipment and offset it through verified reforestation projects. Ship confidently knowing your order travels greener.",
  },
];

export default function SustainabilityPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f0f7f4] border-b border-border">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #3d8b6e 0%, transparent 60%), radial-gradient(circle at 80% 20%, #a8d5c2 0%, transparent 50%)",
          }}
        />
        <div className="container mx-auto px-4 py-24 md:py-36 relative z-10 max-w-4xl">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#3d8b6e] mb-4">
            Our Commitment
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-semibold leading-tight mb-6">
            Beauty that <br />
            <em className="not-italic text-[#3d8b6e]">respects the earth.</em>
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl leading-relaxed">
            Sustainability isn't a trend for us — it's built into every decision
            we make, from the brands we stock to the box your order arrives in.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group p-8 rounded-2xl border border-border hover:border-[#3d8b6e]/40 hover:bg-[#f0f7f4]/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#3d8b6e]/10 flex items-center justify-center mb-5 group-hover:bg-[#3d8b6e]/20 transition-colors">
                <Icon className="w-5 h-5 text-[#3d8b6e]" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">{title}</h3>
              <p className="text-foreground/60 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Progress banner */}
      <section className="bg-[#3d8b6e] text-white">
        <div className="container mx-auto px-4 py-16 max-w-5xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase opacity-70 mb-3">
            2025 Progress
          </p>
          <div className="grid grid-cols-3 gap-8 mt-8">
            {[
              { stat: "100%", label: "Cruelty-free brands" },
              { stat: "68%", label: "Plastic-free packaging" },
              { stat: "12k+", label: "Trees planted via offsets" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="text-4xl md:text-5xl font-serif font-bold mb-2">
                  {stat}
                </p>
                <p className="text-sm opacity-70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 max-w-3xl text-center">
        <h2 className="text-3xl font-serif font-semibold mb-4">
          Want to learn more?
        </h2>
        <p className="text-foreground/60 mb-8">
          Reach out to us — we love talking about this stuff.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 rounded-xl font-medium hover:bg-foreground/90 transition-colors"
        >
          Get in touch <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </main>
  );
}
