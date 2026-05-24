import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(null, { status: 401 });
    }

    const laravelRes = await fetch(`${API_URL}/api/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!laravelRes.ok) {
      return NextResponse.json(null, { status: 401 });
    }

    const data = await laravelRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[API] Auth me error:", error);
    return NextResponse.json(null, { status: 502 });
  }
}