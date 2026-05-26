import Link from "next/link";

const sections = [
  {
    id: "agreement",
    title: "1. Acceptance of Terms",
    content: `By accessing or using the SkyeAvenue website (skye-avenue.com.au) or placing an order, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our site.

We reserve the right to update these Terms at any time. Continued use of the site after changes are posted constitutes your acceptance of the revised Terms.`,
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: `You must be at least 18 years of age to make a purchase on SkyeAvenue. By placing an order, you confirm that you meet this requirement. We reserve the right to refuse service to anyone at our sole discretion.`,
  },
  {
    id: "products",
    title: "3. Products & Pricing",
    content: `All product descriptions, images, and prices are as accurate as possible, but may contain errors. We reserve the right to correct any errors and to cancel orders placed at an incorrect price, with a full refund issued.

Prices are displayed in Australian Dollars (AUD) and are inclusive of GST unless stated otherwise. Prices are subject to change without notice.

Product images are for illustrative purposes only. Colour tones may vary slightly depending on your device's screen calibration.`,
  },
  {
    id: "orders",
    title: "4. Orders & Payment",
    content: `When you place an order, you are making an offer to purchase. We may decline any order at our discretion — for example, if a product is out of stock or if we suspect fraudulent activity.

Order confirmation emails are sent automatically and do not constitute acceptance of your order. Acceptance occurs when your order is dispatched.

We accept payment via credit/debit card (Visa, Mastercard), Afterpay, and PayPal. All transactions are processed securely by our payment partners.`,
  },
  {
    id: "shipping",
    title: "5. Shipping & Delivery",
    content: `We ship within Australia and to select international destinations. Estimated delivery times are provided at checkout and are not guaranteed. SkyeAvenue is not liable for delays caused by courier services, customs, or circumstances beyond our control.

Risk of loss and title for items pass to you upon delivery to the carrier. Please ensure your delivery address is correct — we cannot be held responsible for orders delivered to an incorrect address provided by the customer.`,
  },
  {
    id: "returns",
    title: "6. Returns & Refunds",
    content: `We want you to love your purchase. If you are not satisfied, please review our Returns Policy for full details on eligibility, timeframes, and how to initiate a return.

In summary: most unopened, unused items may be returned within 30 days of delivery for a refund or store credit. Opened or used beauty products cannot be returned for hygiene reasons unless they are faulty.

Your rights under the Australian Consumer Law (ACL) are not affected by this policy.`,
  },
  {
    id: "ip",
    title: "7. Intellectual Property",
    content: `All content on this site — including text, images, logos, graphics, and code — is the property of SkyeAvenue or our content suppliers and is protected by Australian and international copyright laws.

You may not reproduce, distribute, or create derivative works from our content without prior written permission.`,
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    content: `To the fullest extent permitted by law, SkyeAvenue shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our site or products, including but not limited to loss of profits, data, or goodwill.

Our total liability to you for any claim arising from these Terms shall not exceed the amount you paid for the order giving rise to the claim.

Nothing in these Terms limits your rights under the Australian Consumer Law.`,
  },
  {
    id: "prohibited",
    title: "9. Prohibited Conduct",
    content: `You agree not to:

- Use the site for any unlawful purpose
- Attempt to gain unauthorised access to any part of our systems
- Transmit any harmful, offensive, or disruptive content
- Resell our products commercially without written permission
- Use automated tools to scrape, crawl, or harvest data from our site`,
  },
  {
    id: "governing",
    title: "10. Governing Law",
    content: `These Terms are governed by the laws of New South Wales, Australia. Any disputes shall be subject to the exclusive jurisdiction of the courts of New South Wales.`,
  },
  {
    id: "contact",
    title: "11. Contact",
    content: `For any questions about these Terms, please contact us:\n\n**Email:** hello@skye-avenue.com.au`,
  },
];

function renderContent(text: string) {
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i} />;
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
            typeof p === "string" ? (j === 0 ? p.slice(2) : p) : p,
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

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-accent/5">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground/40 mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-semibold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-foreground/50 text-sm">
            Last updated: 1 January 2025
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-12">
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

          <article className="flex-1 min-w-0 flex flex-col gap-12">
            <p className="text-foreground/60 leading-relaxed border-l-2 border-primary pl-4">
              Please read these Terms and Conditions carefully before using
              SkyeAvenue. These Terms govern your use of our website and the
              purchase of products from us.
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
