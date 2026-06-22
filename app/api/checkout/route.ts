// app/api/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

// ── Afterpay config ───────────────────────────────────────────────────────────
const AFTERPAY_ENV = process.env.AFTERPAY_ENVIRONMENT ?? "sandbox";
const AFTERPAY_MERCHANT_ID = process.env.AFTERPAY_MERCHANT_ID!;
const AFTERPAY_SECRET_KEY = process.env.AFTERPAY_SECRET_KEY!;

const AFTERPAY_BASE =
  AFTERPAY_ENV === "production"
    ? "https://api.afterpay.com/v2"
    : "https://global-api-sandbox.afterpay.com/v2";

function afterpayAuth(): string {
  return (
    "Basic " +
    Buffer.from(`${AFTERPAY_MERCHANT_ID}:${AFTERPAY_SECRET_KEY}`).toString(
      "base64",
    )
  );
}

// ── Cart item shape sent from CheckoutForm ────────────────────────────────────
interface CartItem {
  product_id: number;
  qty: number;
  price: number;
  name?: string;
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const body = await req.json();
    const token = req.cookies.get("auth_token")?.value;

    const {
      customer_name,
      customer_email,
      customer_phone_number,
      shipping_address,
      items,
      payment_method,
      notes,
    } = body;

    // ── Stripe Card flow ──────────────────────────────────────────────────────
    if (payment_method === "card") {
      // Step 1: Create a pending order in Laravel to get an order number
      const orderRes = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...body, status: "pending" }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        return NextResponse.json(orderData, { status: orderRes.status });
      }

      const order_number: string = orderData.data?.order_number;

      if (!order_number) {
        return NextResponse.json(
          { message: "Order created but no order number returned." },
          { status: 500 },
        );
      }

      // Step 2: Create Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email,
        line_items: [
          ...items.map((item: CartItem) => ({
            price_data: {
              currency: "aud",
              product_data: {
                name: item.name ?? `Product #${item.product_id}`,
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.qty,
          })),
          // Shipping as a line item
          {
            price_data: {
              currency: "aud",
              product_data: { name: "Standard Shipping (via Australia Post)" },
              unit_amount: Math.round((body.shipping_cost ?? 10) * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order=${order_number}`,
        cancel_url: `${APP_URL}/checkout?cancelled=true`,
        metadata: {
          order_number,
          customer_name,
          notes: notes ?? "",
        },
        payment_intent_data: {
          metadata: {
            order_number,
          },
        },
      });

      return NextResponse.json(
        {
          data: {
            order_number,
            stripe_url: session.url,
          },
        },
        { status: 201 },
      );
    }

    // ── Pay In Store / other non-Afterpay: forward to Laravel as-is ──────────
    if (payment_method !== "afterpay") {
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(data, { status: 201 });
    }

    // ── Afterpay flow ─────────────────────────────────────────────────────────

    // Step 1: Create a pending order in Laravel first
    const orderRes = await fetch(`${API_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...body, status: "pending" }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      return NextResponse.json(orderData, { status: orderRes.status });
    }

    const order_number: string = orderData.data?.order_number;

    if (!order_number) {
      return NextResponse.json(
        { message: "Order created but no order number returned." },
        { status: 500 },
      );
    }

    // Step 2: Build Afterpay checkout session
    const shippingCost: number = body.shipping_cost ?? 10;
    const totalAmount: number =
      items.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.qty,
        0,
      ) + shippingCost;

    const afterpayPayload = {
      amount: {
        amount: totalAmount.toFixed(2),
        currency: "AUD",
      },
      consumer: {
        givenNames:
          customer_name.split(" ").slice(0, -1).join(" ") || customer_name,
        surname: customer_name.split(" ").slice(-1)[0] || "",
        email: customer_email,
        ...(customer_phone_number
          ? { phoneNumber: customer_phone_number }
          : {}),
      },
      billing: {
        name: customer_name,
        line1: shipping_address.line1,
        ...(shipping_address.line2 ? { line2: shipping_address.line2 } : {}),
        suburb: shipping_address.city,
        ...(shipping_address.state ? { state: shipping_address.state } : {}),
        postcode: shipping_address.zip,
        countryCode: "AU",
        ...(customer_phone_number
          ? { phoneNumber: customer_phone_number }
          : {}),
      },
      shipping: {
        name: customer_name,
        line1: shipping_address.line1,
        ...(shipping_address.line2 ? { line2: shipping_address.line2 } : {}),
        suburb: shipping_address.city,
        ...(shipping_address.state ? { state: shipping_address.state } : {}),
        postcode: shipping_address.zip,
        countryCode: "AU",
        ...(customer_phone_number
          ? { phoneNumber: customer_phone_number }
          : {}),
      },
      items: items.map((item: CartItem) => ({
        name: item.name ?? `Product #${item.product_id}`,
        quantity: item.qty,
        price: {
          amount: item.price.toFixed(2),
          currency: "AUD",
        },
      })),
      merchant: {
        redirectConfirmUrl: `${APP_URL}/checkout/confirm?order=${order_number}&status=SUCCESS`,
        redirectCancelUrl: `${APP_URL}/checkout/confirm?order=${order_number}&status=CANCELLED`,
      },
      merchantReference: order_number,
      taxAmount: { amount: "0.00", currency: "AUD" },
      shippingAmount: { amount: "0.00", currency: "AUD" },
    };

    const afterpayRes = await fetch(`${AFTERPAY_BASE}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: afterpayAuth(),
        "User-Agent": "SkyeAvenue/1.0",
      },
      body: JSON.stringify(afterpayPayload),
    });

    const afterpayData = await afterpayRes.json();

    if (!afterpayRes.ok) {
      console.error("[Afterpay] Checkout session error:", afterpayData);
      return NextResponse.json(
        {
          message: afterpayData.message ?? "Afterpay checkout session failed.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        data: {
          order_number,
          afterpay_redirect_url: afterpayData.redirectCheckoutUrl,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[API] Error placing order:", error);
    return NextResponse.json(
      { message: "Failed to place order" },
      { status: 500 },
    );
  }
}
