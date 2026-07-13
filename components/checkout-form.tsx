"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Lock,
  Store,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  full_address?: string;
}

interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface NominatimSuggestion {
  place_id: number;
  display_name: string;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    municipality?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

const EMPTY_ADDRESS: Address = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "Australia",
};

const PAYMENT_METHODS = [
  {
    value: "card",
    label: "Credit / Debit Card",
    icon: "💳",
    description: "Visa, Mastercard, Apple Pay, Google Pay",
    upcoming: false,
  },
  {
    value: "afterpay",
    label: "Afterpay",
    icon: null,
    description: "Pay in 4 interest-free installments",
    upcoming: false,
  },
  {
    value: "pay_in_store",
    label: "Pay In Store",
    icon: null,
    description: "Tap your card on our EFTPOS terminal upon pickup",
    upcoming: false,
  },
];

const SHIPPING_METHODS = [
  {
    value: "standard",
    label: "Standard",
    description: "2 to 8 business days",
    cost: 15,
  },
  {
    value: "express",
    label: "Express",
    description: "1 to 4 business days",
    cost: 20,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const iCls = (err?: string, locked?: boolean) =>
  `w-full text-sm border ${err ? "border-red-300" : "border-pink-200"} rounded-xl px-3.5 py-2.5 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-gray-300 transition-all ${
    locked ? "bg-pink-50/50 text-foreground/60 cursor-not-allowed" : "bg-white"
  }`;

function Field({
  label,
  error,
  locked,
  children,
}: {
  label: string;
  error?: string;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-pink-400 font-semibold mb-1.5">
        {label}
        {locked && <Lock className="w-2.5 h-2.5 text-pink-300" />}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function AfterpayLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="120" height="28" rx="4" fill="#B2FCE4" />
      <text
        x="60"
        y="19"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
        fontWeight="900"
        fontSize="13"
        fill="#000000"
      >
        afterpay
      </text>
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function CheckoutForm() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();

  const subtotal = getTotalPrice();

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddr, setShippingAddr] = useState<Address>({
    ...EMPTY_ADDRESS,
  });
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard",
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "afterpay" | "pay_in_store"
  >("afterpay");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [lastAddress, setLastAddress] = useState(false);

  // ── Address autocomplete (OpenStreetMap Nominatim — free, no API key, AU only) ──
  const [addressSuggestions, setAddressSuggestions] = useState<
    NominatimSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSearch = useRef(false);
  const addressBoxRef = useRef<HTMLDivElement | null>(null);

  const shippingCost =
    SHIPPING_METHODS.find((m) => m.value === shippingMethod)?.cost ?? 10;
  const total = subtotal + shippingCost;

  // ── Fetch logged-in user & last address ──────────────────────────────────
  useEffect(() => {
    const fetchUserAndAddress = async () => {
      try {
        const meRes = await fetch("/api/auth/me");
        const user: AuthUser | null = meRes.ok ? await meRes.json() : null;

        if (!user) return;

        setAuthUser(user);
        setCustomerName(user.name ?? "");
        setCustomerEmail(user.email ?? "");
        setCustomerPhone(user.phone_number ?? "");

        const ordersRes = await fetch("/api/orders/my");
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const lastOrder = ordersData.data?.[0];
          if (lastOrder?.shipping_address) {
            const addr = lastOrder.shipping_address;
            setShippingAddr({
              line1: addr.line1 ?? user.full_address ?? "",
              line2: addr.line2 ?? "",
              city: addr.city ?? "",
              state: addr.state ?? "",
              zip: addr.zip ?? "",
              country: addr.country ?? "Australia",
            });
            setLastAddress(true);
          } else if (user.full_address) {
            setShippingAddr((prev) => ({ ...prev, line1: user.full_address! }));
          }
        } else if (user.full_address) {
          setShippingAddr((prev) => ({ ...prev, line1: user.full_address! }));
        }
      } catch {
        // guest
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUserAndAddress();
  }, []);

  // ── Close suggestion dropdown on outside click ────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        addressBoxRef.current &&
        !addressBoxRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Cleanup pending debounce timer on unmount ─────────────────────────────
  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  const isLocked = !!authUser;

  const setAddr = (field: keyof Address, value: string) =>
    setShippingAddr((prev) => ({ ...prev, [field]: value }));

  // ── Address search (Nominatim, restricted to Australia) ──────────────────
  const handleLine1Change = (value: string) => {
    setAddr("line1", value);
    if (errors["shipping_address.line1"]) {
      setErrors((prev) => ({ ...prev, ["shipping_address.line1"]: "" }));
    }

    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      setShowSuggestions(false);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (value.trim().length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setSearchingAddress(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=au&limit=5&q=${encodeURIComponent(
            value,
          )}`,
        );
        if (res.ok) {
          const data: NominatimSuggestion[] = await res.json();
          setAddressSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch {
        // Free public API — fail silently and let the user type manually
      } finally {
        setSearchingAddress(false);
      }
    }, 400);
  };

  const selectSuggestion = (place: NominatimSuggestion) => {
    const a = place.address ?? {};
    const streetLine =
      [a.house_number, a.road].filter(Boolean).join(" ") ||
      place.display_name.split(",")[0];

    skipNextSearch.current = true;
    setShippingAddr((prev) => ({
      ...prev,
      line1: streetLine,
      city: a.city || a.town || a.suburb || a.municipality || prev.city,
      state: a.state || prev.state,
      zip: a.postcode || prev.zip,
      country: a.country || "Australia",
    }));
    setErrors((prev) => ({
      ...prev,
      ["shipping_address.line1"]: "",
      ["shipping_address.city"]: "",
      ["shipping_address.zip"]: "",
      ["shipping_address.country"]: "",
    }));
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!customerName.trim()) e.customerName = "Required";
    if (!customerEmail.trim()) e.customerEmail = "Required";
    else if (!/\S+@\S+\.\S+/.test(customerEmail))
      e.customerEmail = "Invalid email";
    if (!shippingAddr.line1.trim()) e["shipping_address.line1"] = "Required";
    if (!shippingAddr.city.trim()) e["shipping_address.city"] = "Required";
    if (!shippingAddr.zip.trim()) e["shipping_address.zip"] = "Required";
    if (!shippingAddr.country.trim())
      e["shipping_address.country"] = "Required";
    if (items.length === 0) e._global = "Your cart is empty.";
    return e;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const payload = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone_number: customerPhone.trim() || undefined,
        shipping_address: {
          line1: shippingAddr.line1.trim(),
          line2: shippingAddr.line2.trim() || undefined,
          city: shippingAddr.city.trim(),
          state: shippingAddr.state.trim() || undefined,
          zip: shippingAddr.zip.trim(),
          country: shippingAddr.country.trim(),
        },
        shipping_method: shippingMethod,
        shipping_cost: shippingCost,
        payment_method: paymentMethod,
        notes: notes.trim() || undefined,
        items: items.map((item) => ({
          product_id: Number(item.id),
          qty: item.quantity,
          price: item.price,
          name: item.name,
        })),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          const mapped: Record<string, string> = {};
          Object.entries(json.errors as Record<string, string[]>).forEach(
            ([k, v]) => {
              mapped[k] = Array.isArray(v) ? v[0] : (v as string);
            },
          );
          setErrors(mapped);
        } else {
          setErrors({ _global: json.message ?? "Something went wrong." });
        }
        return;
      }

      // ── Stripe Card: redirect to Stripe Checkout ─────────────────────────
      if (paymentMethod === "card") {
        if (json.data?.stripe_url) {
          clearCart();
          window.location.href = json.data.stripe_url;
        } else {
          setErrors({
            _global:
              "Could not initiate card payment. Please try another payment method.",
          });
        }
        return;
      }

      // ── Pay In Store ──────────────────────────────────────────────────────
      if (paymentMethod === "pay_in_store") {
        clearCart();
        setOrderNumber(json.data.order_number);
        setSuccess(true);
        return;
      }

      // ── Afterpay ──────────────────────────────────────────────────────────
      if (paymentMethod === "afterpay") {
        if (json.data?.afterpay_redirect_url) {
          clearCart();
          window.location.href = json.data.afterpay_redirect_url;
        } else {
          setErrors({
            _global:
              "Could not initiate Afterpay. Please try another payment method.",
          });
        }
        return;
      }

      // ── Fallback ──────────────────────────────────────────────────────────
      clearCart();
      setOrderNumber(json.data.order_number);
      setSuccess(true);
    } catch (err) {
      console.error("[Checkout]", err);
      setErrors({ _global: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const installmentAmount = (total / 4).toFixed(2);

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
            Order Placed!
          </h2>
          <p className="text-foreground/60 mb-2">
            Thank you for shopping with Skye Avenue.
          </p>
          <p className="text-sm font-semibold text-pink-500 mb-6">
            Order #{orderNumber}
          </p>
          {paymentMethod === "pay_in_store" && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-8 text-left">
              <Store className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-700">
                  Payment due in store
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Please have your card ready to tap on our EFTPOS terminal upon
                  pickup. Total due:{" "}
                  <span className="font-bold">${total.toFixed(2)}</span>
                </p>
              </div>
            </div>
          )}
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

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-2xl space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-pink-50 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left: form fields ─────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Global error */}
              {errors._global && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-500">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors._global}
                </div>
              )}

              {/* Logged-in notice */}
              {authUser && (
                <div className="flex items-center gap-2 p-4 bg-pink-50 border border-pink-100 rounded-2xl text-sm text-pink-600">
                  <Lock className="w-4 h-4 shrink-0" />
                  Signed in as{" "}
                  <span className="font-semibold ml-1">{authUser.email}</span>
                  {lastAddress && (
                    <span className="ml-auto text-pink-400 text-xs">
                      Last address prefilled
                    </span>
                  )}
                </div>
              )}

              {/* Contact */}
              <div className="bg-white border border-pink-100 rounded-2xl p-6 space-y-4">
                <h3 className="font-serif text-lg text-foreground mb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Full Name"
                    error={errors.customerName}
                    locked={isLocked}
                  >
                    <input
                      value={customerName}
                      onChange={(e) =>
                        !isLocked && setCustomerName(e.target.value)
                      }
                      readOnly={isLocked}
                      placeholder="Jane Smith"
                      className={iCls(errors.customerName, isLocked)}
                    />
                  </Field>
                  <Field
                    label="Email"
                    error={errors.customerEmail}
                    locked={isLocked}
                  >
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) =>
                        !isLocked && setCustomerEmail(e.target.value)
                      }
                      readOnly={isLocked}
                      placeholder="jane@example.com"
                      className={iCls(errors.customerEmail, isLocked)}
                    />
                  </Field>
                </div>
                <Field label="Phone (optional)" locked={isLocked}>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) =>
                      !isLocked && setCustomerPhone(e.target.value)
                    }
                    readOnly={isLocked}
                    placeholder="+61 4XX XXX XXX"
                    className={iCls(undefined, isLocked)}
                  />
                </Field>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-pink-100 rounded-2xl p-6 space-y-4">
                <h3 className="font-serif text-lg text-foreground mb-2">
                  Shipping Address
                </h3>

                {/* Address Line 1 with AU autocomplete (OpenStreetMap Nominatim) */}
                <div ref={addressBoxRef} className="relative">
                  <Field
                    label="Address Line 1"
                    error={errors["shipping_address.line1"]}
                  >
                    <div className="relative">
                      <input
                        value={shippingAddr.line1}
                        onChange={(e) => handleLine1Change(e.target.value)}
                        onFocus={() =>
                          addressSuggestions.length > 0 &&
                          setShowSuggestions(true)
                        }
                        placeholder="Start typing your street address…"
                        autoComplete="off"
                        className={iCls(errors["shipping_address.line1"])}
                      />
                      {searchingAddress && (
                        <Loader2 className="w-4 h-4 text-pink-300 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </Field>

                  {showSuggestions && addressSuggestions.length > 0 && (
                    <ul className="absolute z-20 mt-1 w-full bg-white border border-pink-100 rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
                      {addressSuggestions.map((s) => (
                        <li key={s.place_id}>
                          <button
                            type="button"
                            onClick={() => selectSuggestion(s)}
                            className="w-full text-left flex items-start gap-2 px-3.5 py-2.5 text-sm text-foreground/80 hover:bg-pink-50 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-pink-300 shrink-0 mt-0.5" />
                            <span className="truncate">{s.display_name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-[10px] text-foreground/30 mt-1">
                    Australian addresses powered by OpenStreetMap
                  </p>
                </div>

                <Field label="Address Line 2 (optional)">
                  <input
                    value={shippingAddr.line2}
                    onChange={(e) => setAddr("line2", e.target.value)}
                    placeholder="Apartment, suite, unit…"
                    className={iCls()}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City" error={errors["shipping_address.city"]}>
                    <input
                      value={shippingAddr.city}
                      onChange={(e) => setAddr("city", e.target.value)}
                      placeholder="Sydney"
                      className={iCls(errors["shipping_address.city"])}
                    />
                  </Field>
                  <Field label="State / Territory">
                    <input
                      value={shippingAddr.state}
                      onChange={(e) => setAddr("state", e.target.value)}
                      placeholder="NSW"
                      className={iCls()}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Postcode"
                    error={errors["shipping_address.zip"]}
                  >
                    <input
                      value={shippingAddr.zip}
                      onChange={(e) => setAddr("zip", e.target.value)}
                      placeholder="2000"
                      className={iCls(errors["shipping_address.zip"])}
                    />
                  </Field>
                  <Field
                    label="Country"
                    error={errors["shipping_address.country"]}
                  >
                    <input
                      value={shippingAddr.country}
                      onChange={(e) => setAddr("country", e.target.value)}
                      placeholder="Australia"
                      className={iCls(errors["shipping_address.country"])}
                    />
                  </Field>
                </div>
              </div>

              {/* ── Shipping Method ──────────────────────────────────────── */}
              <div className="bg-white border border-pink-100 rounded-2xl p-6 space-y-3">
                <h3 className="font-serif text-lg text-foreground mb-2">
                  Shipping Method
                </h3>
                {SHIPPING_METHODS.map((sm) => (
                  <label
                    key={sm.value}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      shippingMethod === sm.value
                        ? "border-pink-400 bg-pink-50/60"
                        : "border-pink-100 hover:border-pink-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping_method"
                      value={sm.value}
                      checked={shippingMethod === sm.value}
                      onChange={() =>
                        setShippingMethod(sm.value as typeof shippingMethod)
                      }
                      className="accent-pink-500"
                    />
                    <span className="flex-1">
                      <span className="text-sm font-medium text-foreground">
                        {sm.label}
                      </span>
                      <span className="block text-xs text-foreground/40 mt-0.5">
                        {sm.description}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      ${sm.cost.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-pink-100 rounded-2xl p-6 space-y-3">
                <h3 className="font-serif text-lg text-foreground mb-2">
                  Payment Method
                </h3>

                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.value}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                      pm.upcoming
                        ? "border-pink-50 bg-gray-50/50 cursor-not-allowed opacity-60"
                        : paymentMethod === pm.value
                          ? "border-pink-400 bg-pink-50/60 cursor-pointer"
                          : "border-pink-100 hover:border-pink-200 cursor-pointer"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={pm.value}
                      checked={paymentMethod === pm.value}
                      onChange={() =>
                        !pm.upcoming &&
                        setPaymentMethod(pm.value as typeof paymentMethod)
                      }
                      disabled={pm.upcoming}
                      className="accent-pink-500"
                    />
                    <span className="flex items-center gap-2 flex-1">
                      {pm.icon && <span className="text-base">{pm.icon}</span>}
                      {pm.value === "afterpay" && (
                        <AfterpayLogo className="h-5 w-auto" />
                      )}
                      {pm.value === "pay_in_store" && (
                        <Store className="w-4 h-4 text-pink-400" />
                      )}
                      <span className="text-sm text-foreground font-medium">
                        {pm.label}
                      </span>
                      {pm.upcoming ? (
                        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider bg-pink-100 text-pink-400 px-2 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      ) : pm.description ? (
                        <span className="ml-auto text-xs text-foreground/40">
                          {pm.description}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}

                {paymentMethod === "card" && (
                  <div className="mt-2 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-start gap-2">
                      <span className="text-base">💳</span>
                      <div>
                        <p className="text-xs font-semibold text-blue-700 mb-1">
                          Secure payment via Stripe
                        </p>
                        <p className="text-[11px] text-blue-500">
                          You'll be redirected to Stripe's secure payment page.
                          Visa, Mastercard, Apple Pay and Google Pay accepted.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "afterpay" && total > 0 && (
                  <div className="mt-2 p-3.5 bg-[#B2FCE4]/20 border border-[#B2FCE4] rounded-xl">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Pay in 4 interest-free installments of{" "}
                      <span className="text-gray-900">
                        ${installmentAmount}
                      </span>
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex-1 text-center">
                          <div
                            className={`h-1.5 rounded-full mb-1 ${n === 1 ? "bg-gray-800" : "bg-gray-200"}`}
                          />
                          <p className="text-[10px] text-gray-500">
                            {n === 1 ? "Today" : `Week ${(n - 1) * 2}`}
                          </p>
                          <p className="text-[10px] font-semibold text-gray-700">
                            ${installmentAmount}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">
                      You&apos;ll be redirected to Afterpay to complete your
                      payment. No interest, no fees when you pay on time.
                    </p>
                  </div>
                )}

                {paymentMethod === "pay_in_store" && (
                  <div className="mt-2 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-2">
                      <Store className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-700 mb-1">
                          How it works
                        </p>
                        <ul className="text-[11px] text-amber-600 space-y-0.5 list-disc list-inside">
                          <li>
                            Place your order now — no payment needed online
                          </li>
                          <li>Come to our store to pick up your order</li>
                          <li>Tap your card on our EFTPOS terminal</li>
                          <li>Afterpay in-store accepted too!</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-white border border-pink-100 rounded-2xl p-6">
                <h3 className="font-serif text-lg text-foreground mb-4">
                  Order Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions, gift messages…"
                  rows={3}
                  className={iCls() + " resize-none"}
                />
              </div>
            </div>

            {/* ── Right: order summary ──────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 space-y-4">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  Order Summary
                </h2>

                <div className="space-y-3 pb-4 border-b border-border">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground/70 truncate max-w-[160px]">
                        {item.name}{" "}
                        <span className="text-foreground/40">
                          ×{item.quantity}
                        </span>
                      </span>
                      <span className="font-medium text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal + Shipping breakdown */}
                <div className="space-y-2 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Subtotal</span>
                    <span className="text-foreground">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">
                      Shipping
                      <span className="text-foreground/40 ml-1 text-xs">
                        (
                        {
                          SHIPPING_METHODS.find(
                            (m) => m.value === shippingMethod,
                          )?.label
                        }
                        )
                      </span>
                    </span>
                    <span className="text-foreground">
                      ${shippingCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-serif text-2xl font-semibold text-foreground">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {paymentMethod === "card" && (
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="text-sm">💳</span>
                    <span className="text-xs text-blue-600 font-medium">
                      Secure card payment via Stripe
                    </span>
                  </div>
                )}

                {paymentMethod === "afterpay" && total > 0 && (
                  <div className="flex items-center gap-2 p-2.5 bg-[#B2FCE4]/20 rounded-lg border border-[#B2FCE4]/60">
                    <AfterpayLogo className="h-4 w-auto" />
                    <span className="text-xs text-gray-600">
                      4 × <strong>${installmentAmount}</strong>
                    </span>
                  </div>
                )}

                {paymentMethod === "pay_in_store" && (
                  <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                    <Store className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs text-amber-700 font-medium">
                      Pay <strong>${total.toFixed(2)}</strong> in store
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-12 font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {paymentMethod === "afterpay"
                        ? "Redirecting to Afterpay…"
                        : paymentMethod === "card"
                          ? "Redirecting to Stripe…"
                          : "Placing Order…"}
                    </>
                  ) : (
                    <>
                      {paymentMethod === "afterpay"
                        ? "Continue to Afterpay"
                        : paymentMethod === "card"
                          ? "Pay with Card"
                          : paymentMethod === "pay_in_store"
                            ? "Place Order – Pay In Store"
                            : "Place Order"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {!authUser && (
                  <p className="text-xs text-center text-foreground/50">
                    Have an account?{" "}
                    <Link
                      href="/login"
                      className="text-pink-500 hover:underline font-medium"
                    >
                      Sign in
                    </Link>{" "}
                    to autofill your details.
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
