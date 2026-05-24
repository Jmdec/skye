import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Shop",
      links: [
        { label: "New Arrivals", href: "/products?sort=newest" },
        { label: "Skincare", href: "/products?category=skincare" },
        { label: "Fragrance", href: "/products?category=fragrance" },
        { label: "Wellness", href: "/products?category=wellness" },
        { label: "All Products", href: "/products" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Story", href: "/about#story" }, // ← was duplicate /about
        { label: "Sustainability", href: "/sustainability" },
        { label: "Press", href: "/press" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Shipping & Returns", href: "/shipping" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #1a0a0e 0%, #2d0f1a 30%, #3d1525 60%, #2a0d18 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-900/30 via-rose-800/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-fuchsia-900/25 via-pink-800/15 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-rose-900/10 blur-3xl" />
      </div>

      {/* Decorative top border shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #ec4899 30%, #f9a8d4 50%, #ec4899 70%, transparent)",
        }}
      />

      {/* Decorative rings */}
      <div className="absolute top-8 right-12 w-48 h-48 rounded-full border border-pink-800/20" />
      <div className="absolute top-16 right-20 w-32 h-32 rounded-full border border-pink-700/15" />
      <div className="absolute bottom-12 left-8 w-24 h-24 rounded-full border border-rose-700/20" />

      <div className="relative container mx-auto px-4 pt-16 pb-8">
        {/* Brand statement row */}
        <div className="mb-14 pb-10 border-b border-pink-900/40">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-pink-500/70 mb-3">
                Australian Beauty
              </p>
              <h2
                className="text-5xl sm:text-6xl font-light text-transparent bg-clip-text"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  backgroundImage:
                    "linear-gradient(135deg, #be185d 0%, #ec4899 40%, #f9a8d4 65%, #fda4af 85%, #be185d 100%)",
                  backgroundSize: "200% auto",
                  animation: "shimmer 6s linear infinite",
                }}
              >
                Skye Avenue
              </h2>
            </div>
            <p className="text-sm text-pink-200/70 font-light max-w-xs lg:text-right leading-relaxed">
              Premium Australian beauty and skincare products, thoughtfully
              curated for the modern woman.
            </p>
          </div>
        </div>

        {/* Main links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Social */}
          <div className="flex flex-col gap-6">
            <p className="text-[10px] tracking-[0.35em] uppercase text-pink-400 font-medium">
              Follow Along
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                aria-label="Instagram"
                className="group w-10 h-10 rounded-full flex items-center justify-center border border-pink-800/40 text-pink-400/60 hover:text-pink-300 hover:border-pink-500/60 hover:bg-pink-900/30 transition-all duration-300"
              >
                <InstagramIcon className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="group w-10 h-10 rounded-full flex items-center justify-center border border-pink-800/40 text-pink-400/60 hover:text-pink-300 hover:border-pink-500/60 hover:bg-pink-900/30 transition-all duration-300"
              >
                <FacebookIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* Mini newsletter */}
            <div className="mt-2">
              <p className="text-xs text-pink-200/60 mb-3 font-light">
                Stay in the loop
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-l-full text-xs bg-white/5 border border-pink-800/30 text-pink-100/70 placeholder:text-pink-400/60 focus:outline-none focus:border-pink-600/50 transition-colors"
                />
                <button
                  className="px-4 py-2.5 rounded-r-full text-xs font-medium text-white transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #be185d, #ec4899)",
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-5">
              <p className="text-[10px] tracking-[0.35em] uppercase text-pink-400 font-medium">
                {section.title}
              </p>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-pink-200/80 hover:text-pink-300 transition-colors duration-200 font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ borderTop: "1px solid rgba(236,72,153,0.12)" }}
        >
          <p className="text-xs text-pink-200/60 font-light">
            &copy; {currentYear} Skye Avenue. All rights reserved.
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Cookies", href: "/cookies" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-pink-200/60 hover:text-pink-300/60 transition-colors font-light"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </footer>
  );
}
