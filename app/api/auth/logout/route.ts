import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (token) {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {});
  }

  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
  res.cookies.delete("auth_token");
  return res;
}