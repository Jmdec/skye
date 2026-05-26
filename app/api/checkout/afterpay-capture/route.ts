// app/api/checkout/afterpay-capture/route.ts
//
// Called by the confirm page after Afterpay redirects back with SUCCESS.
// This finalizes the payment by telling Afterpay to capture the funds.

import { NextRequest, NextResponse } from "next/server";

const AFTERPAY_ENV = process.env.AFTERPAY_ENVIRONMENT ?? "sandbox";
const AFTERPAY_BASE =
  AFTERPAY_ENV === "production"
    ? "https://api.afterpay.com/v2"
    : // ? "https://api.us.afterpay.com/v2"  // US/CA
      "https://global-api-sandbox.afterpay.com/v2";

const AFTERPAY_MERCHANT_ID = process.env.AFTERPAY_MERCHANT_ID!;
const AFTERPAY_SECRET_KEY = process.env.AFTERPAY_SECRET_KEY!;

function afterpayAuth(): string {
  return (
    "Basic " +
    Buffer.from(`${AFTERPAY_MERCHANT_ID}:${AFTERPAY_SECRET_KEY}`).toString(
      "base64",
    )
  );
}

export async function POST(req: NextRequest) {
  const { order_number, token } = await req.json();

  if (!token || !order_number) {
    return NextResponse.json(
      { message: "Missing token or order reference." },
      { status: 400 },
    );
  }

  try {
    // Tell Afterpay to capture (charge) the payment
    const captureRes = await fetch(`${AFTERPAY_BASE}/payments/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: afterpayAuth(),
        "User-Agent": "SkyeAvenue/1.0",
      },
      body: JSON.stringify({
        token,
        merchantReference: order_number,
      }),
    });

    const captureData = await captureRes.json();

    if (!captureRes.ok || captureData.status !== "APPROVED") {
      console.error("[Afterpay Capture] Failed:", captureData);
      return NextResponse.json(
        {
          message:
            captureData.message ?? "Payment was not approved by Afterpay.",
        },
        { status: 402 },
      );
    }

    // ── Update your order in the DB to "paid" ─────────────────────────────
    // await db.orders.update({
    //   where: { order_number },
    //   data: {
    //     status:           "paid",
    //     payment_id:       captureData.id,        // Afterpay payment ID
    //     payment_status:   captureData.status,    // "APPROVED"
    //   },
    // });

    console.log(
      `[Afterpay] Payment captured: ${captureData.id} for order ${order_number}`,
    );

    return NextResponse.json({
      data: {
        order_number,
        afterpay_payment_id: captureData.id,
        status: captureData.status,
      },
    });
  } catch (err) {
    console.error("[Afterpay Capture] Error:", err);
    return NextResponse.json(
      { message: "Failed to capture payment." },
      { status: 500 },
    );
  }
}
