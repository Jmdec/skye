import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartContent } from "@/components/cart-content";

export const metadata = {
  title: "Shopping Bag | Skye Avenue",
  description: "Review and manage your shopping bag",
};

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-accent/10 border-b border-border py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
              Your Shopping Bag
            </h1>
          </div>
        </section>

        {/* Cart Content */}
        <CartContent />
      </main>

      <Footer />
    </div>
  );
}
