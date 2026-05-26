import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function verifyToken(
  token: string,
): Promise<{ valid: boolean; user?: any }> {
  try {
    const res = await fetch(`${API_URL}/api/user`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return { valid: false };
    const user = await res.json();
    return { valid: true, user };
  } catch {
    return { valid: false };
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  // ── Redirect logged-in users away from auth pages ─────────────────────
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      const { valid } = await verifyToken(token);
      if (valid) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      // Token is invalid — let them through to login/register
      // and clear the bad cookie
      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      return response;
    }
    return NextResponse.next();
  }

  // ── Protect /admin routes ──────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { valid, user } = await verifyToken(token);

      if (!valid) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
