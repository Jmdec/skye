// app/api/customers/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  try {
    const res = await fetch(`${API_URL}/api/admin/customers`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token ?? ""}`,
      },
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Failed to fetch customers" }, { status: 500 });
  }
}