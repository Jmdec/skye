import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";

const openRoles = [
  {
    id: "social-content",
    title: "Social & Content Creator",
    type: "Part-time / Freelance",
    location: "Remote (Australia)",
    summary:
      "We're looking for a creative individual to help tell the SkyeAvenue story across Instagram, TikTok, and our blog. You'll produce short-form video, photography, and written content that reflects our aesthetic — clean, glowing, real.",
    requirements: [
      "Strong eye for beauty and lifestyle content",
      "Experience with Reels / TikTok editing (CapCut, Adobe Premiere, or similar)",
      "Understanding of skincare and beauty trends",
      "Based in Australia preferred",
    ],
  },
  {
    id: "customer-experience",
    title: "Customer Experience Associate",
    type: "Casual / Part-time",
    location: "Remote (Australia)",
    summary:
      "You'll be the warm, knowledgeable voice behind our inbox — answering product questions, resolving order issues, and making every customer feel genuinely looked after. A passion for beauty is a must.",
    requirements: [
      "Excellent written communication skills",
      "Empathetic, calm, and solution-focused",
      "Comfortable with Shopify / e-commerce order management",
      "Beauty knowledge a strong plus",
    ],
  },
];

const values = [
  {
    emoji: "✨",
    title: "Genuine passion over credentials",
    body: "We care more about your enthusiasm for beauty and your values than your CV.",
  },
  {
    emoji: "🌿",
    title: "Flexibility first",
    body: "We're a small team that works smart, not long. We believe in sustainable work-life balance.",
  },
  {
    emoji: "🤝",
    title: "Everyone's voice counts",
    body: "You'll have real impact on how we grow. No layer of bureaucracy, no watered-down ideas.",
  },
  {
    emoji: "💛",
    title: "Community at the core",
    body: "Our customers and team alike are part of the SkyeAvenue family — that's not a marketing line.",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 py-20 md:py-32 max-w-5xl">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-4">
            Join Us
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-semibold leading-tight mb-6">
            Careers at <br />
            <span className="text-primary">SkyeAvenue</span>
          </h1>
          <p className="text-lg text-foreground/60 max-w-xl leading-relaxed">
            We're a small, passionate team building something beautiful from the
            ground up. If that excites you, we'd love to meet you.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 py-16 max-w-5xl border-b border-border">
        <h2 className="text-2xl font-serif font-semibold mb-10">
          Why SkyeAvenue
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex gap-4 p-6 rounded-2xl border border-border"
            >
              <span className="text-2xl">{v.emoji}</span>
              <div>
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {v.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section className="container mx-auto px-4 py-16 max-w-5xl border-b border-border">
        <h2 className="text-2xl font-serif font-semibold mb-2">Open Roles</h2>
        <p className="text-foreground/60 text-sm mb-10">
          We're a growing brand — new roles open regularly. Check back often or
          send a speculative application below.
        </p>

        <div className="flex flex-col gap-6">
          {openRoles.map((role) => (
            <div
              key={role.id}
              className="p-8 rounded-2xl border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-serif font-semibold">
                    {role.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground/50">
                      <Clock className="w-3 h-3" />
                      {role.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground/50">
                      <MapPin className="w-3 h-3" />
                      {role.location}
                    </span>
                  </div>
                </div>
                <a
                  href={`mailto:careers@skye-avenue.com.au?subject=Application: ${role.title}`}
                  className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-foreground/90 transition-colors shrink-0"
                >
                  Apply now <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-foreground/60 text-sm leading-relaxed mb-4">
                {role.summary}
              </p>
              <ul className="flex flex-col gap-1.5">
                {role.requirements.map((req) => (
                  <li
                    key={req}
                    className="flex items-start gap-2 text-sm text-foreground/60"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Speculative */}
      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="bg-accent/5 rounded-3xl border border-border p-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-2">
              Don't see your role?
            </h2>
            <p className="text-foreground/60 text-sm max-w-md">
              We love hearing from talented people even when we're not actively
              hiring. Send us a short note about yourself and what you'd bring
              to the team.
            </p>
          </div>
          <a
            href="mailto:careers@skye-avenue.com.au?subject=Speculative application"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-medium hover:bg-primary/90 transition-colors shrink-0 text-sm"
          >
            Say hello <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
