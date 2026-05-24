"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalErr, setGlobalErr] = useState("");

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    setGlobalErr("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      let data: { message?: string; user?: { role?: string }; errors?: Record<string, string[]> };
      try {
        data = await res.json();
      } catch {
        setGlobalErr(`Server error (${res.status}). Please try again.`);
        return;
      }

      if (!res.ok) {
        if (data?.errors && typeof data.errors === "object") {
          setErrors(
            Object.fromEntries(
              Object.entries(data.errors).map(([k, v]) => [
                k,
                Array.isArray(v) ? v[0] : v,
              ]),
            ),
          );
        } else {
          setGlobalErr(data?.message ?? `Login failed (${res.status}). Please try again.`);
        }
        return;
      }

      // ── Redirect based on role ──────────────────────────────────────────
      const params      = new URLSearchParams(window.location.search);
      const callbackUrl = params.get("callbackUrl");
      const role        = data.user?.role;

      console.log("[Login] user role:", role); // debug — remove later

      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }

      router.refresh(); // ensure header re-fetches auth state

    } catch (err) {
      console.error("[Login] Unexpected error:", err);
      setGlobalErr("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fce7f3 0%,#fbcfe8 30%,#f9a8d4 60%,#f472b6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Jost', sans-serif",
        fontWeight: 300,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.15, backgroundImage: "radial-gradient(circle,#be185d 1.2px,transparent 1.2px)", backgroundSize: "20px 20px" }} />
      <div style={{ position: "absolute", top: -100, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(244,114,182,0.35),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle,rgba(251,207,232,0.4),transparent 70%)", pointerEvents: "none" }} />

      <div className="card" style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.75)", borderRadius: "24px", width: "100%", maxWidth: "420px", boxShadow: "0 24px 64px rgba(190,24,93,0.12)", overflow: "hidden", position: "relative" }}>
        <div style={{ height: "3px", background: "linear-gradient(90deg,#be185d,#ec4899,#f9a8d4,#ec4899,#be185d)" }} />

        <div style={{ padding: "36px 32px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <p style={{ fontSize: "10px", letterSpacing: ".28em", textTransform: "uppercase", color: "#ec4899", marginBottom: "8px" }}>
              Welcome back
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 300, lineHeight: 1, color: "#500724" }}>
              Skye <em style={{ fontStyle: "italic", color: "#be185d" }}>Avenue</em>
            </h1>
          </div>

          {globalErr && (
            <div style={{ background: "rgba(190,24,93,0.08)", border: "1px solid rgba(190,24,93,0.2)", borderRadius: "10px", padding: "10px 14px", marginBottom: "20px", fontSize: "12px", color: "#9d174d" }}>
              {globalErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Field label="Email address" error={errors.email}>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="skye-input"
                style={inputStyle(!!errors.email)}
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="skye-input"
                style={inputStyle(!!errors.password)}
              />
            </Field>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#831843", cursor: "pointer" }}>
                <input type="checkbox" checked={form.remember} onChange={(e) => set("remember", e.target.checked)} style={{ accentColor: "#ec4899" }} />
                Remember me
              </label>
              <Link href="/forgot-password" style={{ fontSize: "12px", color: "#ec4899", textDecoration: "none" }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="skye-btn"
              style={{
                width: "100%", padding: "13px", border: "none", borderRadius: "100px",
                background: loading ? "linear-gradient(135deg,#f9a8d4,#ec4899)" : "linear-gradient(135deg,#db2777,#ec4899,#f472b6)",
                color: "#fff", fontFamily: "'Jost',sans-serif", fontSize: "11px",
                letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer", transition: "opacity 0.2s, transform 0.2s",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,transparent,rgba(236,72,153,0.25))" }} />
            <span style={{ fontSize: "11px", color: "#f4a8c4" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,rgba(236,72,153,0.25),transparent)" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#831843" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "#ec4899", fontWeight: 500, textDecoration: "none" }}>
              Create one →
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        @keyframes cardIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .card { animation: cardIn 0.55s ease both; }
        .skye-input:focus { outline: none !important; border-color: #ec4899 !important; box-shadow: 0 0 0 3px rgba(236,72,153,0.12) !important; }
        .skye-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ display: "block", fontSize: "10px", letterSpacing: ".16em", textTransform: "uppercase", color: "#9d174d", marginBottom: "7px", opacity: 0.85 }}>
        {label}
      </label>
      {children}
      {error && <p style={{ fontSize: "11px", color: "#be185d", marginTop: "5px" }}>{error}</p>}
    </div>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%", padding: "11px 16px",
    border: `1px solid ${hasError ? "#be185d" : "rgba(236,72,153,0.22)"}`,
    borderRadius: "10px", background: "rgba(255,255,255,0.7)",
    fontFamily: "'Jost',sans-serif", fontSize: "13px", color: "#500724",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
}