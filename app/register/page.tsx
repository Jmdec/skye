"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_number: "",
    full_address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalErr, setGlobalErr] = useState("");

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(form.password))
      e.password = "Password must contain an uppercase letter.";
    else if (!/[0-9]/.test(form.password))
      e.password = "Password must contain a number.";
    if (form.password !== form.password_confirmation)
      e.password_confirmation = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});
    setGlobalErr("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      let data: any;
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
              Object.entries(data.errors as Record<string, string[]>).map(
                ([k, v]) => [k, Array.isArray(v) ? v[0] : v],
              ),
            ),
          );
        } else {
          setGlobalErr(
            data?.message ??
              `Registration failed (${res.status}). Please try again.`,
          );
        }
        return;
      }

      const params = new URLSearchParams(window.location.search);
      router.push(params.get("callbackUrl") ?? "/");
    } catch (err) {
      console.error("[Register] Unexpected error:", err);
      setGlobalErr(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#fce7f3 0%,#fbcfe8 30%,#f9a8d4 60%,#f472b6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        fontFamily: "'Jost', sans-serif",
        fontWeight: 300,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.15,
          backgroundImage:
            "radial-gradient(circle,#be185d 1.2px,transparent 1.2px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(244,114,182,0.35),transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -60,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(251,207,232,0.4),transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="card"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.75)",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 24px 64px rgba(190,24,93,0.12)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg,#be185d,#ec4899,#f9a8d4,#ec4899,#be185d)",
          }}
        />

        <div style={{ padding: "36px 32px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: ".28em",
                textTransform: "uppercase",
                color: "#ec4899",
                marginBottom: "8px",
              }}
            >
              Join us
            </p>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "36px",
                fontWeight: 300,
                lineHeight: 1,
                color: "#500724",
              }}
            >
              Skye{" "}
              <em style={{ fontStyle: "italic", color: "#be185d" }}>Avenue</em>
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "#831843",
                opacity: 0.7,
                marginTop: "8px",
              }}
            >
              Create your account to get started
            </p>
          </div>

          {globalErr && (
            <div
              style={{
                background: "rgba(190,24,93,0.08)",
                border: "1px solid rgba(190,24,93,0.2)",
                borderRadius: "10px",
                padding: "10px 14px",
                marginBottom: "20px",
                fontSize: "12px",
                color: "#9d174d",
              }}
            >
              {globalErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <SectionDivider label="Account Details" />

            <Field label="Full name" error={errors.name}>
              <input
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="skye-input"
                style={inputStyle(!!errors.name)}
              />
            </Field>

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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
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
              <Field
                label="Confirm password"
                error={errors.password_confirmation}
              >
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password_confirmation}
                  onChange={(e) => set("password_confirmation", e.target.value)}
                  className="skye-input"
                  style={inputStyle(!!errors.password_confirmation)}
                />
              </Field>
            </div>

            <p
              style={{
                fontSize: "10px",
                color: "#9d174d",
                opacity: 0.65,
                marginTop: "-10px",
                marginBottom: "20px",
              }}
            >
              Min. 8 characters with uppercase letter and number.
            </p>

            <SectionDivider label="Personal Details (Optional)" />

            <Field label="Phone number" error={errors.phone_number}>
              <input
                type="tel"
                placeholder="+61 4xx xxx xxx"
                value={form.phone_number}
                onChange={(e) => set("phone_number", e.target.value)}
                className="skye-input"
                style={inputStyle(!!errors.phone_number)}
              />
            </Field>

            <Field label="Full address" error={errors.full_address}>
              <textarea
                placeholder="123 George St, Sydney, NSW 2000"
                value={form.full_address}
                onChange={(e) => set("full_address", e.target.value)}
                className="skye-input"
                rows={3}
                style={{
                  ...inputStyle(!!errors.full_address),
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="skye-btn"
              style={{
                width: "100%",
                padding: "13px",
                marginTop: "4px",
                border: "none",
                borderRadius: "100px",
                background: loading
                  ? "linear-gradient(135deg,#f9a8d4,#ec4899)"
                  : "linear-gradient(135deg,#db2777,#ec4899,#f472b6)",
                color: "#fff",
                fontFamily: "'Jost',sans-serif",
                fontSize: "11px",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s, transform 0.2s",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "24px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg,transparent,rgba(236,72,153,0.25))",
              }}
            />
            <span style={{ fontSize: "11px", color: "#f4a8c4" }}>or</span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg,rgba(236,72,153,0.25),transparent)",
              }}
            />
          </div>

          <p
            style={{ textAlign: "center", fontSize: "12px", color: "#831843" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#ec4899",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Sign in →
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
        textarea.skye-input { font-family:'Jost',sans-serif; }
        input::placeholder, textarea::placeholder { color: rgba(190,24,93,0.35); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label
        style={{
          display: "block",
          fontSize: "10px",
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: "#9d174d",
          marginBottom: "7px",
          opacity: 0.85,
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: "11px", color: "#be185d", marginTop: "5px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "18px",
      }}
    >
      <span
        style={{
          fontSize: "9px",
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: "#ec4899",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(90deg,rgba(236,72,153,0.3),transparent)",
        }}
      />
    </div>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "11px 16px",
    border: `1px solid ${hasError ? "#be185d" : "rgba(236,72,153,0.22)"}`,
    borderRadius: "10px",
    background: "rgba(255,255,255,0.7)",
    fontFamily: "'Jost',sans-serif",
    fontSize: "13px",
    color: "#500724",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
}
