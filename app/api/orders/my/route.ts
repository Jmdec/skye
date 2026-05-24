import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    const response = await fetch(`${API_URL}/api/orders/my`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token ?? ""}`,  // ← Bearer
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Error fetching my orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}