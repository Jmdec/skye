"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const firstError = data?.errors
          ? Object.values(data.errors as Record<string, string[]>).flat()[0]
          : (data?.message ?? "Something went wrong");
        toast.error(firstError);
        return;
      }

      toast.success(data?.message ?? "Message sent!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    fontFamily: "'Jost', sans-serif",
    fontSize: "13px",
    fontWeight: 300,
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(236,72,153,0.2)",
    borderRadius: "10px",
    color: "#500724",
    outline: "none",
    boxSizing: "border-box",
  };

  const contactItems = [
    {
      icon: "✉",
      label: "Email",
      value: "hannahmontero@skye-avenue.com.au",
      href: "mailto:hannahmontero@skye-avenue.com.au",
    },
    {
      icon: "☎",
      label: "Phone",
      value: "046603755",
      href: "tel:046603755",
    },
    { icon: "⌖", label: "Location", value: "Sydney, Australia", href: null },
  ];

  const hours = [
    ["Mon – Fri", "9am – 6pm AEDT"],
    ["Saturday", "10am – 4pm AEDT"],
    ["Sunday", "Closed"],
  ];

  return (
    <div
      style={{
        fontFamily: "'Jost', sans-serif",
        fontWeight: 300,
        background: "#fff0f5",
        overflowX: "hidden",
      }}
    >
      <Header />

      <main>
        {/* HERO */}
        <section
          style={{
            background:
              "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 30%, #f9a8d4 60%, #f472b6 100%)",
            padding: "52px 24px 48px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              letterSpacing: ".28em",
              textTransform: "uppercase",
              color: "#9d174d",
              marginBottom: "14px",
              opacity: 0.8,
            }}
          >
            We&apos;d love to hear from you
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(40px, 7vw, 80px)",
              fontWeight: 300,
              lineHeight: 1.0,
              color: "#500724",
            }}
          >
            Get in{" "}
            <em style={{ fontStyle: "italic", color: "#be185d" }}>Touch.</em>
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#831843",
              opacity: 0.75,
              marginTop: "14px",
            }}
          >
            Reach out anytime — we&apos;re always happy to help.
          </p>
        </section>

        {/* MAIN CONTENT */}
        <div className="contact-grid">
          {/* LEFT — Contact Info */}
          <div>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: "#ec4899",
                marginBottom: "10px",
              }}
            >
              01 — Contact
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "32px",
                fontWeight: 300,
                color: "#500724",
                marginBottom: "28px",
                lineHeight: 1.1,
              }}
            >
              Contact
              <br />
              Information
            </h2>

            {contactItems.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  marginBottom: "22px",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "linear-gradient(135deg, #fce7f3, #f9a8d4)",
                    border: "1px solid rgba(236,72,153,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "9px",
                      letterSpacing: ".22em",
                      textTransform: "uppercase",
                      color: "#ec4899",
                      marginBottom: "3px",
                    }}
                  >
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{
                        fontSize: "13px",
                        color: "#be185d",
                        textDecoration: "none",
                        wordBreak: "break-all",
                      }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#500724",
                        opacity: 0.75,
                      }}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Hours card */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, #fce7f3, #fbcfe8, #f9a8d4)",
                borderRadius: "16px",
                padding: "24px 28px",
                marginTop: "28px",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px",
                  fontWeight: 300,
                  color: "#500724",
                  marginBottom: "16px",
                }}
              >
                Business Hours
              </h3>
              {hours.map(([day, time], i) => (
                <div
                  key={day}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#831843",
                    padding: "5px 0",
                    borderBottom:
                      i < hours.length - 1
                        ? "1px solid rgba(236,72,153,0.15)"
                        : "none",
                  }}
                >
                  <span>{day}</span>
                  <span style={{ opacity: 0.6 }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div
            style={{
              background:
                "linear-gradient(160deg, #fff5f9, #fce7f3 60%, #fbcfe8 100%)",
              border: "1px solid rgba(236,72,153,0.2)",
              borderRadius: "20px",
              padding: "36px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: "#ec4899",
                marginBottom: "8px",
              }}
            >
              02 — Message
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "32px",
                fontWeight: 300,
                color: "#500724",
                marginBottom: "28px",
              }}
            >
              Send a Message
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-name-email">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                style={{ ...inputStyle, marginBottom: "14px" }}
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                style={{ ...inputStyle, resize: "none", marginBottom: "14px" }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  background:
                    "linear-gradient(135deg, #db2777, #ec4899, #f472b6)",
                  color: "#fff",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "11px",
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  borderRadius: "100px",
                  opacity: isSubmitting ? 0.6 : 1,
                  transition: "opacity .2s, transform .15s",
                }}
              >
                {isSubmitting ? "Sending…" : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .contact-grid {
          padding: 48px 24px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr 1.6fr;
            gap: 40px;
            padding: 52px 40px;
          }
        }

        .form-name-email {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        @media (min-width: 480px) {
          .form-name-email {
            grid-template-columns: 1fr 1fr;
          }
        }

        input::placeholder, textarea::placeholder { color: rgba(190,24,93,0.35); }
        input:focus, textarea:focus { border-color: #ec4899 !important; box-shadow: 0 0 0 3px rgba(236,72,153,0.1); }
      `}</style>
    </div>
  );
}
