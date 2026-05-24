"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { X, Loader2, AlertCircle } from "lucide-react";
import { NewsletterSection } from "@/components/newsletter-section";
// ── Types ─────────────────────────────────────────────────────────────────────

interface Announcement {
  id: number;
  title: string;
  tag: string;
  content: string;
  featured: boolean;
  published_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Tag ───────────────────────────────────────────────────────────────────────

const tagStyles: Record<string, { bg: string; color: string }> = {
  "New Arrival": { bg: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#be185d" },
  Offer:         { bg: "linear-gradient(135deg, #fef3c7, #fde68a)", color: "#92400e" },
  Event:         { bg: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#5b21b6" },
  Update:        { bg: "linear-gradient(135deg, #d1fae5, #a7f3d0)", color: "#065f46" },
  Blog:          { bg: "linear-gradient(135deg, #dbeafe, #bfdbfe)", color: "#1e40af" },
};

function Tag({ tag }: { tag: string }) {
  const s = tagStyles[tag] ?? tagStyles["New Arrival"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 12px",
        borderRadius: "100px",
        fontSize: "9px",
        letterSpacing: ".16em",
        textTransform: "uppercase",
        fontWeight: 500,
        background: s.bg,
        color: s.color,
      }}
    >
      {tag}
    </span>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
      <span style={{ fontSize: "13px", color: "#ec4899" }}>{icon}</span>
      <span style={{ fontSize: "10px", letterSpacing: ".28em", textTransform: "uppercase", color: "#ec4899" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(236,72,153,0.3), transparent)" }} />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [selected, setSelected]           = useState<Announcement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/announcements");
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Failed to load");
        setAnnouncements(json.data as Announcement[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load announcements");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featured = announcements.filter((a) => a.featured);

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, background: "#fff0f5" }}>
      <Header />

      <main>
        {/* HERO */}
        <section
          style={{
            background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 30%, #f9a8d4 60%, #f472b6 100%)",
            padding: "52px 40px 44px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: "100px",
              padding: "7px 18px",
              marginBottom: "18px",
              fontSize: "10px",
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "#9d174d",
            }}
          >
            ✦ Latest Updates
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(44px, 6vw, 72px)",
              fontWeight: 300,
              lineHeight: 1.0,
              color: "#500724",
            }}
          >
            <em style={{ fontStyle: "italic", color: "#be185d" }}>Announcements</em>
          </h1>
          <p style={{ fontSize: "13px", color: "#831843", opacity: 0.7, marginTop: "12px" }}>
            Stay updated with our latest news, product launches, and exclusive offers.
          </p>
        </section>

        {/* LOADING */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "80px 40px", color: "#ec4899" }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: "13px" }}>Loading announcements…</span>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div style={{ margin: "40px", padding: "20px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", color: "#ef4444", fontSize: "13px" }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* CONTENT */}
        {!loading && !error && (
          <>
            {/* FEATURED */}
            {featured.length > 0 && (
              <section style={{ padding: "36px 40px 24px" }}>
                <SectionHeader icon="★" label="Featured" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {featured.map((a, i) => (
                    <button
                      key={a.id}
                      onClick={() => setSelected(a)}
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(236,72,153,0.18)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "transform .25s, box-shadow .25s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 32px rgba(236,72,153,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                      }}
                    >
                      <div
                        style={{
                          height: "3px",
                          background: i === 0
                            ? "linear-gradient(90deg, #be185d, #ec4899, #f9a8d4)"
                            : "linear-gradient(90deg, #f9a8d4, #ec4899, #be185d)",
                        }}
                      />
                      <div style={{ padding: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                          <Tag tag={a.tag} />
                          <span style={{ fontSize: "11px", color: "#f4a8c4", opacity: 0.8 }}>
                            {formatDate(a.published_at)}
                          </span>
                        </div>
                        <h3
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "22px",
                            fontWeight: 300,
                            color: "#500724",
                            marginBottom: "10px",
                            lineHeight: 1.2,
                          }}
                        >
                          {a.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#831843",
                            opacity: 0.65,
                            lineHeight: 1.6,
                            marginBottom: "14px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {a.content}
                        </p>
                        <span style={{ fontSize: "11px", color: "#ec4899", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          Read more →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* ALL ANNOUNCEMENTS */}
            <section style={{ padding: "8px 40px 36px" }}>
              <SectionHeader icon="🔔" label="All Announcements" />

              {announcements.length === 0 ? (
                <p style={{ textAlign: "center", color: "#be185d", opacity: 0.5, fontSize: "13px", padding: "40px 0" }}>
                  No announcements yet. Check back soon!
                </p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {announcements.map((a, i) => (
                    <button
                      key={a.id}
                      onClick={() => setSelected(a)}
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(236,72,153,0.15)",
                        borderRadius: "14px",
                        padding: "20px",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        textAlign: "left",
                        transition: "transform .2s, box-shadow .2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(236,72,153,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "14px",
                          right: "14px",
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "9px",
                          color: "#ec4899",
                          fontWeight: 500,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <Tag tag={a.tag} />
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "17px",
                          fontWeight: 300,
                          color: "#500724",
                          margin: "10px 0 6px",
                          lineHeight: 1.25,
                        }}
                      >
                        {a.title}
                      </h3>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                        <span style={{ fontSize: "10px", color: "#f4a8c4" }}>
                          {formatDate(a.published_at)}
                        </span>
                        <span style={{ fontSize: "10px", color: "#ec4899" }}>View →</span>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "2px",
                          background: "linear-gradient(90deg, #be185d, #ec4899, #f9a8d4)",
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* NEWSLETTER */}
              <NewsletterSection />

        {/* MODAL */}
        {selected && (
          <div
            onClick={() => setSelected(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              background: "rgba(80,7,36,0.4)",
              backdropFilter: "blur(4px)",
              animation: "fadeIn 0.2s ease",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
                width: "100%",
                maxWidth: "480px",
                boxShadow: "0 24px 64px rgba(236,72,153,0.2)",
                position: "relative",
                animation: "slideUp 0.25s ease",
              }}
            >
              <div style={{ height: "3px", background: "linear-gradient(90deg, #be185d, #ec4899, #f9a8d4, #ec4899, #be185d)" }} />
              <div style={{ padding: "32px" }}>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "none",
                    background: "#fce7f3",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#be185d",
                  }}
                >
                  <X size={14} />
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <Tag tag={selected.tag} />
                  <span style={{ fontSize: "11px", color: "#f4a8c4" }}>
                    {formatDate(selected.published_at)}
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "28px",
                    fontWeight: 300,
                    color: "#500724",
                    marginBottom: "16px",
                    lineHeight: 1.2,
                  }}
                >
                  {selected.title}
                </h2>
                <div style={{ height: "1px", background: "linear-gradient(90deg, #fbcfe8, transparent)", marginBottom: "16px" }} />
                <p style={{ fontSize: "13px", color: "#831843", lineHeight: 1.75, opacity: 0.8 }}>
                  {selected.content}
                </p>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    marginTop: "28px",
                    width: "100%",
                    padding: "13px",
                    border: "none",
                    borderRadius: "100px",
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #db2777, #ec4899, #f472b6)",
                    color: "#fff",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "11px",
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        input::placeholder { color: rgba(190,24,93,0.35); }
        input:focus { border-color: #ec4899 !important; box-shadow: 0 0 0 3px rgba(236,72,153,0.1); }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}