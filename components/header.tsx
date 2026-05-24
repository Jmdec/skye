"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useRouter } from "next/navigation";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser]                     = useState<AuthUser | null>(null);
  const [userMenuOpen, setUserMenuOpen]     = useState(false);
  const [authLoading, setAuthLoading]       = useState(true);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const router = useRouter();

  // ── Fetch current user ──────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  // ── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { label: "Home",          href: "/" },
    { label: "Products",      href: "/products" },
    { label: "About",         href: "/about" },
    { label: "Contact Us",    href: "/contact" },
    { label: "Announcements", href: "/announcements" },
  ];

  return (
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
              // ── Logged-in dropdown ────────────────────────────────────
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
                  <ChevronDown className={`w-4 h-4 text-foreground/50 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <>
                    {/* backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-background border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-foreground/50 truncate">{user.email}</p>
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
              // ── Guest links ───────────────────────────────────────────
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
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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

            {/* Mobile auth links */}
            <div className="border-t border-border pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="text-sm text-foreground/60">
                    Signed in as <span className="font-semibold text-foreground">{user.name}</span>
                  </div>
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground/80">
                    My Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground/80">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-left text-base font-medium text-destructive">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground/80">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground/80">
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}