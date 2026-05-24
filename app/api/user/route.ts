import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    // Get auth token from HTTP-only cookie
    const token = req.cookies.get("auth_token")?.value;

    console.log("[v0] Token from cookie:", token ? "present" : "missing");

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Call Laravel backend with token to get current user
    // Laravel Sanctum expects the token in Authorization header as Bearer token
    const laravelRes = await fetch(`${API_URL}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // Include cookies if needed
    });

    console.log("[v0] Laravel response status:", laravelRes.status);

    const data = await laravelRes.json();

    if (!laravelRes.ok) {
      console.log("[v0] Laravel error:", data);
      return NextResponse.json(data, { status: laravelRes.status });
    }

    // Return user data
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[API] User fetch error:", error);
    return NextResponse.json(
      { message: "Network error. Could not reach the server." },
      { status: 502 },
    );
  }
}
