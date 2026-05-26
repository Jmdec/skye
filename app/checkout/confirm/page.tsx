// app/checkout/confirm/page.tsx
"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ── Split into inner component so Suspense can wrap useSearchParams ──────────
function AfterpayConfirmInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status");
  const orderRef = searchParams.get("order");
  const orderToken = searchParams.get("orderToken");

  const [capturing, setCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "SUCCESS" || !orderToken || !orderRef) return;

    const capture = async () => {
      setCapturing(true);
      try {
        const res = await fetch("/api/checkout/afterpay-capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_number: orderRef, token: orderToken }),
        });
        const json = await res.json();
        if (res.ok) {
          setCaptured(true);
        } else {
          setError(json.message ?? "Payment capture failed. Contact support.");
        }
      } catch {
        setError("Network error capturing payment.");
      } finally {
        setCapturing(false);
      }
    };

    capture();
  }, [status, orderToken, orderRef]);

  if (status === "CANCELLED") {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-serif text-3xl font-semibold mb-2">
            Payment Cancelled
          </h2>
          <p className="text-foreground/60 mb-8">
            Your Afterpay payment was cancelled. Your order has not been placed.
          </p>
          <Link href="/checkout">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 px-6">
              Back to Checkout
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  if (capturing) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <Loader2 className="w-10 h-10 animate-spin text-pink-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-semibold mb-2">
            Confirming your payment…
          </h2>
          <p className="text-foreground/60">
            Please don&apos;t close this page.
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-serif text-3xl font-semibold mb-2">
            Payment Error
          </h2>
          <p className="text-foreground/60 mb-4">{error}</p>
          <p className="text-sm text-foreground/40 mb-8">
            Reference: {orderRef}
          </p>
          <Link href="/checkout">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 px-6">
              Try Again
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  if (captured) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-serif text-3xl font-semibold mb-2">
            Order Confirmed!
          </h2>
          <p className="text-foreground/60 mb-2">
            Your Afterpay payment was successful. Thank you for shopping with
            Skye Avenue.
          </p>
          <p className="text-sm font-semibold text-pink-500 mb-8">
            Order #{orderRef}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 px-6">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/orders">
              <Button
                variant="outline"
                className="border-pink-200 hover:bg-pink-50 rounded-md h-11 px-6"
              >
                My Orders
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return null;
}

// ── Default export wraps inner component in Suspense ─────────────────────────
export default function AfterpayConfirmPage() {
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-lg text-center">
            <Loader2 className="w-10 h-10 animate-spin text-pink-400 mx-auto mb-4" />
            <p className="text-foreground/60">Loading…</p>
          </div>
        </section>
      }
    >
      <AfterpayConfirmInner />
    </Suspense>
  );
}
