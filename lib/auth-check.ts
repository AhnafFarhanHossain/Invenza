// lib/auth-check.ts
import { jwtVerify } from "jose";

export async function isTokenValid(token: string): Promise<boolean> {
  if (!token) return false;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function getTokenFromCookies(
  cookieHeader: string
): Promise<string | null> {
  if (!cookieHeader) return null;

  const tokenCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("token="));

  return tokenCookie ? tokenCookie.split("=")[1] : null;
}
