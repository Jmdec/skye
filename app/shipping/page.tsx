import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Shipping & Returns | Skye Avenue",
  description: "Learn about our shipping and return policies",
};

export default function ShippingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <section className="bg-accent/10 border-b border-border py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-2">
              Shipping & Returns
            </h1>
            <p className="text-lg text-foreground/60">
              We want you to be completely satisfied with every purchase
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-3xl space-y-12">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-4">
                Shipping Information
              </h2>
              <div className="space-y-4">
                <p className="text-foreground/70">
                  We ship all orders within 1-2 business days using Australia
                  Post. Standard delivery typically takes 5-7 business days,
                  depending on your location.
                </p>
                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-foreground">
                    Shipping Rates
                  </h3>
                  <div className="space-y-2 text-sm text-foreground/70">
                    <p>Standard Delivery: AUD $12 (5-7 business days)</p>
                    <p>Free Shipping on orders over AUD $100</p>
                    <p>Express Delivery: AUD $25 (2-3 business days)</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-4">
                Returns & Exchanges
              </h2>
              <p className="text-foreground/70 mb-6">
                We offer a 30-day returns policy on all products. If you&apos;re
                not completely satisfied with your purchase, you can return it
                within 30 days of delivery for a full refund.
              </p>
              <h3 className="font-semibold text-foreground mb-3">
                Return Conditions
              </h3>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li>• Products must be unused and in original packaging</li>
                <li>• All items must be returned within 30 days of purchase</li>
                <li>• We provide a return label for free returns</li>
                <li>
                  • Refunds are processed within 5-7 business days of receipt
                </li>
                <li>• Exchanges are available for different sizes or colors</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-4">
                How to Return
              </h2>
              <div className="bg-accent/5 border border-border rounded-lg p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Step 1: Contact Us
                  </h4>
                  <p className="text-sm text-foreground/70">
                    Email us at hello@skyeavenue.com.au with your order number
                    and reason for return
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Step 2: Get Your Return Label
                  </h4>
                  <p className="text-sm text-foreground/70">
                    We&apos;ll send you a pre-paid return label via email
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Step 3: Ship It Back
                  </h4>
                  <p className="text-sm text-foreground/70">
                    Pack your item securely and drop it off at your nearest
                    Australia Post office
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Step 4: Get Your Refund
                  </h4>
                  <p className="text-sm text-foreground/70">
                    Once we receive and inspect your return, your refund will be
                    processed
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-4">
                Damaged or Lost Items
              </h2>
              <p className="text-foreground/70">
                If your package arrives damaged or lost, please contact us
                immediately. We&apos;ll work with Australia Post to investigate
                and will replace your item or issue a full refund at no cost to
                you.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
