import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata = {
  title: "Checkout | Skye Avenue",
  description: "Complete your order",
};

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-accent/10 border-b border-border py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
              Checkout
            </h1>
          </div>
        </section>

        {/* Checkout Content */}
        <CheckoutForm />
      </main>

      <Footer />
    </div>
  );
}
