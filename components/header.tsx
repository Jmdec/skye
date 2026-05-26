"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useRouter } from "next/navigation";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: string;
}

// ── Announcement Banner ──────────────────────────────────────────────────────
const announcements = [
  {
    id: 1,
    text: "Now accepting",
    highlight: "AFTERPAY",
    suffix: "payments",
    icon: (
      // Afterpay logo mark (simplified mint circular arrows)
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 fill-current"
        aria-hidden="true"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm3.5 9c-2.21 0-4-1.343-4-3h8c0 1.657-1.79 3-4 3z" />
      </svg>
    ),
  },
  {
    id: 2,
    text: "Free shipping on orders over",
    highlight: "$75",
    suffix: "",
    icon: null,
  },
];

function AnnouncementBanner() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  // Auto-rotate announcements
  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  const ann = announcements[current];

  return (
    <div className="relative w-full bg-[#b5e4d8] text-[#1a1a1a] overflow-hidden">
      {/* subtle shimmer stripe */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.4) 60px,rgba(255,255,255,.4) 61px)",
        }}
      />

      <div className="container mx-auto px-4 flex items-center justify-between h-10 text-sm font-medium relative z-10">
        {/* Prev arrow */}
        {announcements.length > 1 && (
          <button
            onClick={() =>
              setCurrent(
                (c) => (c - 1 + announcements.length) % announcements.length,
              )
            }
            className="p-1 rounded hover:bg-black/10 transition-colors shrink-0"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Message */}
        <div
          key={ann.id}
          className="flex-1 flex items-center justify-center gap-2 animate-fade-in"
        >
          {/* Afterpay-style badge */}
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1a1a1a] text-[#b5e4d8] shrink-0">
            <svg
              viewBox="0 0 16 16"
              className="w-3.5 h-3.5 fill-current"
              aria-hidden="true"
            >
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm1 9.5H7v-5h2v5zm0-6.5H7V2.5h2V4z" />
            </svg>
          </span>
          <span>
            {ann.text} <strong className="font-bold">{ann.highlight}</strong>
            {ann.suffix && ` ${ann.suffix}`}
          </span>
          {/* Afterpay logo pill */}
          {ann.id === 1 && (
            <span className="inline-flex items-center gap-1 bg-[#1a1a1a] text-[#b5e4d8] text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
              <svg
                viewBox="0 0 20 20"
                className="w-3 h-3 fill-current"
                aria-hidden="true"
              >
                <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm4 11H6a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2zm0-4H6a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2z" />
              </svg>
              afterpay
            </span>
          )}
        </div>

        {/* Next arrow / close */}
        <div className="flex items-center gap-1 shrink-0">
          {announcements.length > 1 && (
            <button
              onClick={() => setCurrent((c) => (c + 1) % announcements.length)}
              className="p-1 rounded hover:bg-black/10 transition-colors"
              aria-label="Next announcement"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setVisible(false)}
            className="p-1 rounded hover:bg-black/10 transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* dot indicators */}
      {announcements.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {announcements.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-[#1a1a1a]" : "bg-[#1a1a1a]/30"}`}
              aria-label={`Go to announcement ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Header ──────────────────────────────────────────────────────────────
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Announcements", href: "/announcements" },
  ];

  return (
    <>
      {/* ── Announcement banner sits ABOVE the sticky header ── */}
      <AnnouncementBanner />

      <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          {/* Desktop Layout */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl sm:text-4xl font-serif font-semibold text-foreground hover:text-primary transition-colors tracking-wide"
            >
              SkyeAvenue
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors border-b-2 border-transparent hover:border-primary pb-1"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 hover:bg-accent/10 rounded-lg transition-colors"
                aria-label={`Shopping bag with ${totalItems} items`}
              >
                <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full animate-cart-bounce">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {authLoading ? (
                <div className="w-8 h-8 rounded-full bg-accent/20 animate-pulse" />
              ) : user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors text-sm font-medium"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="max-w-[120px] truncate text-foreground">
                      {user.name}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-foreground/50 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-52 bg-background border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-foreground/50 truncate">
                            {user.email}
                          </p>
                        </div>
                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/80 hover:bg-accent/10 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-6 pb-4 flex flex-col gap-5 border-t border-border pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-border pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="text-sm text-foreground/60">
                      Signed in as{" "}
                      <span className="font-semibold text-foreground">
                        {user.name}
                      </span>
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-medium text-foreground/80"
                    >
                      My Orders
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base font-medium text-foreground/80"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-left text-base font-medium text-destructive"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-medium text-foreground/80"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-medium text-foreground/80"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Tailwind keyframe for fade-in (add to your global CSS if not present) */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.35s ease both;
        }
      `}</style>
    </>
  );
}
