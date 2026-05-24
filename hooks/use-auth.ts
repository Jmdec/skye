"use client";

import { useEffect, useState } from "react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  full_address?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cookie is HttpOnly so we just call the endpoint —
    // Next.js reads the cookie server-side and forwards to Laravel
    fetch("/api/user", {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
