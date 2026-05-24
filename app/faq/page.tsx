"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "Do you offer free shipping?",
    answer:
      "Yes! We offer free shipping on all orders over AUD $100. Orders under this amount will incur a flat shipping fee of AUD $12.",
  },
  {
    id: 2,
    question: "What is your return policy?",
    answer:
      "We offer a 30-day returns policy on all products. If you are not completely satisfied with your purchase, simply contact us for a return label and instructions.",
  },
  {
    id: 3,
    question: "Are all products authentic?",
    answer:
      "Absolutely. All products in our collection are sourced directly from authorized distributors and brand partners. We guarantee 100% authenticity.",
  },
  {
    id: 4,
    question: "How long does delivery take?",
    answer:
      "Standard delivery typically takes 5-7 business days within Australia. Express delivery options are available for additional fees.",
  },
  {
    id: 5,
    question: "Do you accept international orders?",
    answer:
      "Currently, we only deliver to Australian addresses. We are exploring international shipping options and will announce this soon.",
  },
  {
    id: 6,
    question: "Can I track my order?",
    answer:
      "Yes! Once your order ships, you will receive a tracking number via email that you can use to monitor your delivery.",
  },
  {
    id: 7,
    question: "How do I know which products suit my skin type?",
    answer:
      "Each product listing includes detailed information about benefits and ingredients. If you need personalized recommendations, feel free to contact our team.",
  },
  {
    id: 8,
    question: "Are your products cruelty-free?",
    answer:
      "Many of the brands we partner with are cruelty-free and committed to ethical practices. Product descriptions include this information when applicable.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-accent/10 border-b border-border py-12 sm:py-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-foreground/60">
              Find answers to common questions about our products, shipping, and
              policies.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-border rounded-lg overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-card/50 transition-colors text-left"
                  >
                    <span className="font-semibold text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                        openId === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openId === faq.id && (
                    <div className="px-6 py-4 bg-background border-t border-border">
                      <p className="text-foreground/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Help */}
            <div className="mt-12 bg-accent/5 border border-border rounded-lg p-8 text-center">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                Still have questions?
              </h2>
              <p className="text-foreground/70 mb-6">
                Can&apos;t find what you&apos;re looking for? Our customer
                service team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
