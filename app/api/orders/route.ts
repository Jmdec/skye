import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;  // ← add this

    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    if (searchParams.get("status"))   params.set("status",   searchParams.get("status")!);
    if (searchParams.get("search"))   params.set("search",   searchParams.get("search")!);
    if (searchParams.get("per_page")) params.set("per_page", searchParams.get("per_page")!);

    const response = await fetch(`${API_URL}/api/admin/orders?${params}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token ?? ""}`,  // ← Bearer instead of Cookie
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}