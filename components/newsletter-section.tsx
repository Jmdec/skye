"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

type Variant = "default" | "pink";

interface NewsletterSectionProps {
  variant?: Variant;
}

export function NewsletterSection({
  variant = "default",
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "duplicate"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setStatus("duplicate");
        setMessage(data.message ?? "You're already subscribed!");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setMessage(
          data?.errors?.email?.[0] ?? data.message ?? "Something went wrong.",
        );
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "Thank you for subscribing!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  // ── Pink variant ──────────────────────────────────────────────────────────
  if (variant === "pink") {
    return (
      <section
        style={{
          background:
            "linear-gradient(160deg, #fdf2f8, #fce7f3 50%, #fbcfe8 100%)",
          borderTop: "1px solid rgba(236,72,153,0.15)",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            letterSpacing: ".28em",
            textTransform: "uppercase",
            color: "#ec4899",
            marginBottom: "10px",
          }}
        >
          Newsletter
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "36px",
            fontWeight: 300,
            color: "#500724",
            marginBottom: "10px",
          }}
        >
          Stay in the <em style={{ fontStyle: "italic" }}>Loop.</em>
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "#831843",
            opacity: 0.65,
            marginBottom: "28px",
            lineHeight: 1.6,
          }}
        >
          Subscribe for the latest announcements, exclusive offers, and skincare
          tips.
        </p>

        {status === "success" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              padding: "16px 0",
            }}
          >
            <CheckCircle2 size={36} style={{ color: "#10b981" }} />
            <p style={{ fontSize: "13px", color: "#10b981", fontWeight: 500 }}>
              {message}
            </p>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "400px",
                margin: "0 auto",
              }}
              className="newsletter-form"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="your@email.com"
                required
                disabled={status === "loading"}
                style={{
                  flex: 1,
                  padding: "12px 18px",
                  border: "1px solid rgba(236,72,153,0.2)",
                  borderRadius: "100px",
                  background: "rgba(255,255,255,0.8)",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "13px",
                  color: "#500724",
                  outline: "none",
                  opacity: status === "loading" ? 0.6 : 1,
                  width: "100%",
                  boxSizing: "border-box" as const,
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "100px",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  background:
                    "linear-gradient(135deg, #db2777, #ec4899, #f472b6)",
                  color: "#fff",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "11px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  opacity: status === "loading" ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {status === "loading" && (
                  <Loader2
                    size={12}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                )}
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>

            {(status === "error" || status === "duplicate") && (
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "12px",
                  color: status === "duplicate" ? "#d97706" : "#ef4444",
                }}
              >
                {message}
              </p>
            )}
          </>
        )}

        <style>{`
          @media (min-width: 480px) {
            .newsletter-form {
              flex-direction: row !important;
            }
          }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </section>
    );
  }

  // ── Default variant ───────────────────────────────────────────────────────
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center space-y-4 sm:space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-foreground/60">
            Be the first to know about new releases, exclusive offers, and
            beauty tips from our experts.
          </p>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              <p className="text-sm font-medium text-emerald-600">{message}</p>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder="Enter your email"
                  required
                  disabled={status === "loading"}
                  className="flex-1 px-4 py-3 rounded-md bg-card border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8 py-3 font-semibold whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === "loading" && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </button>
              </form>

              {(status === "error" || status === "duplicate") && (
                <p
                  className={`text-xs ${status === "duplicate" ? "text-amber-500" : "text-red-400"}`}
                >
                  {message}
                </p>
              )}
            </>
          )}

          <p className="text-xs text-foreground/50">
            We&apos;ll never share your email. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
