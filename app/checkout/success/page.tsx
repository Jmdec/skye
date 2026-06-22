// app/checkout/success/page.tsx

import Link from "next/link";
import { Check, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string; session_id?: string };
}) {
  const orderNumber = searchParams.order;

  return (
    <section className="py-16 min-h-[60vh] flex items-center">
      <div className="container mx-auto px-4 max-w-lg text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />
        </div>

        {/* Heading */}
        <h1 className="font-serif text-4xl font-semibold text-foreground mb-3">
          Payment Successful!
        </h1>
        <p className="text-foreground/60 mb-4 text-base">
          Thank you for shopping with Skye Avenue. Your order has been confirmed
          and we'll be in touch soon.
        </p>

        {/* Order number */}
        {orderNumber && (
          <div className="inline-block bg-pink-50 border border-pink-100 rounded-2xl px-6 py-3 mb-8">
            <p className="text-xs text-pink-400 uppercase tracking-widest mb-1">
              Order Number
            </p>
            <p className="text-lg font-semibold text-pink-600">
              #{orderNumber}
            </p>
          </div>
        )}

        {/* Info card */}
        <div className="bg-white border border-pink-100 rounded-2xl p-5 mb-8 text-left space-y-2.5">
          <p className="text-sm font-semibold text-foreground mb-1">
            What's next?
          </p>
          {[
            "You'll receive a confirmation email shortly.",
            "We'll prepare your order and notify you when it ships.",
            "Track your order anytime under My Orders.",
          ].map((step) => (
            <div key={step} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-emerald-600" />
              </div>
              <p className="text-sm text-foreground/70">{step}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 px-6">
              Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/orders">
            <Button
              variant="outline"
              className="border-pink-200 hover:bg-pink-50 rounded-md h-11 px-6"
            >
              <ShoppingBag className="w-4 h-4 mr-2" /> My Orders
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
