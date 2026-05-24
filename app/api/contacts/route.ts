import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/contacts`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] Error fetching contacts:", error);
    return NextResponse.json({ message: "Failed to fetch contacts" }, { status: 500 });
  }
}