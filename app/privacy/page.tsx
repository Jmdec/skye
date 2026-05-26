import Link from "next/link";

const sections = [
  {
    id: "collection",
    title: "1. Information We Collect",
    content: `When you visit SkyeAvenue or place an order, we may collect the following types of information:

**Personal identification information** — name, email address, phone number, shipping and billing address.

**Payment information** — we do not store full card details. Payments are processed securely by our payment providers (Stripe, Afterpay, PayPal). We receive only a transaction confirmation and last-four-digit reference.

**Device & usage data** — IP address, browser type, pages visited, time on site, and referring URL. This is collected automatically via cookies and analytics tools to help us improve your experience.

**Communications** — if you contact us via email or our contact form, we retain those messages to assist with your enquiry.`,
  },
  {
    id: "use",
    title: "2. How We Use Your Information",
    content: `We use your information to:

- Process and fulfil your orders, including sending order confirmations and shipping updates
- Respond to customer service enquiries
- Send marketing emails and promotions **only if you have opted in** — you can unsubscribe at any time
- Improve our website, product range, and overall experience through anonymised analytics
- Comply with legal obligations (tax records, fraud prevention)

We do **not** sell, rent, or trade your personal information to third parties for their own marketing purposes.`,
  },
  {
    id: "sharing",
    title: "3. Information Sharing",
    content: `We share your data only where necessary to run our business:

**Shipping partners** — your name, address, and order details are passed to our courier services (e.g. Australia Post, Sendle) solely for delivery.

**Payment processors** — Stripe, Afterpay, and PayPal receive the information required to complete your transaction under their own privacy policies.

**Analytics providers** — aggregated, anonymised data may be shared with Google Analytics or similar tools.

**Legal requirements** — we may disclose information if required by law, court order, or to protect the rights and safety of SkyeAvenue and our customers.`,
  },
  {
    id: "cookies",
    title: "4. Cookies",
    content: `Our site uses cookies to:

- Keep items in your shopping cart between sessions
- Remember your preferences
- Analyse site traffic (via Google Analytics)

You can disable cookies in your browser settings, but some features (such as the cart) may not function correctly. We do not use cookies to track you across third-party websites for advertising purposes.`,
  },
  {
    id: "retention",
    title: "5. Data Retention",
    content: `We retain your personal data for as long as necessary to provide our services and meet legal obligations. Order records are kept for a minimum of 7 years for taxation and compliance purposes. You may request deletion of your account and associated data at any time (subject to legal retention requirements) by contacting us at hannahmontero@skye-avenue.com.au.`,
  },
  {
    id: "rights",
    title: "6. Your Rights",
    content: `Under the Australian Privacy Act 1988 and applicable laws, you have the right to:

- **Access** the personal information we hold about you
- **Correct** inaccurate or incomplete information
- **Request deletion** of your data (where not legally required to retain it)
- **Opt out** of marketing communications at any time via the unsubscribe link in any email

To exercise any of these rights, contact us at hannahmontero@skye-avenue.com.au. We will respond within 30 days.`,
  },
  {
    id: "security",
    title: "7. Security",
    content: `We take reasonable steps to protect your information from unauthorised access, disclosure, or misuse. Our site uses SSL/TLS encryption, and access to customer data is restricted to authorised staff only. No method of transmission over the internet is 100% secure, so we cannot guarantee absolute security.`,
  },
  {
    id: "thirdparty",
    title: "8. Third-Party Links",
    content: `Our site may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies before providing any personal information.`,
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised effective date. Continued use of our site after any changes constitutes acceptance of the updated policy.`,
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: `If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us:\n\n**Email:** hannahmontero@skye-avenue.com.au\n**Mailing address:** SkyeAvenue, Australia\n\nYou may also lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at www.oaic.gov.au if you believe your privacy rights have been breached.`,
  },
];

function renderContent(text: string) {
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    // Bold **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    if (line.startsWith("- ")) {
      return (
        <li
          key={i}
          className="ml-4 list-disc text-foreground/70 leading-relaxed"
        >
          {parts.map((p, j) =>
            typeof p === "string" ? p.slice(j === 0 ? 2 : 0) : p,
          )}
        </li>
      );
    }
    return (
      <p key={i} className="text-foreground/70 leading-relaxed">
        {parts}
      </p>
    );
  });
}

export default function PrivacyPage() {
  const effectiveDate = "1 January 2025";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border bg-accent/5">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-semibold mb-4">
            Privacy Policy
          </h1>
          <p className="text-foreground/50 text-sm">
            Effective date: {effectiveDate}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar TOC */}
          <aside className="md:w-56 shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-4">
                Contents
              </p>
              <nav className="flex flex-col gap-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-sm text-foreground/50 hover:text-foreground transition-colors leading-snug"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="flex-1 min-w-0 flex flex-col gap-12">
            <p className="text-foreground/60 leading-relaxed border-l-2 border-primary pl-4">
              SkyeAvenue ("we", "us", "our") is committed to protecting your
              privacy. This policy explains what information we collect, how we
              use it, and your rights regarding your personal data.
            </p>

            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="text-xl font-serif font-semibold mb-4">
                  {s.title}
                </h2>
                <div className="flex flex-col gap-2">
                  {renderContent(s.content)}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}
