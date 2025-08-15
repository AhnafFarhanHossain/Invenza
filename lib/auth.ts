// lib/auth.ts
import { jwtVerify } from "jose";

export async function getUserIdFromRequest(req: Request): Promise<string> {
  const cookieHeader = req.headers.get("cookie") || "";
  const tokenCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("token="));
  const token = tokenCookie ? tokenCookie.split("=")[1] : null;
  if (!token) throw new Error("No token provided");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  try {
    const { payload } = await jwtVerify(token, secret);
    // token created with { id: user._id } earlier — adapt if you use sub
    if (!payload || (!payload.id && !payload.sub)) throw new Error("Invalid token payload");
    const userId = payload.id ?? payload.sub;
    
    // Ensure we return a string
    return String(userId);
  } catch (err: any) {
    console.error("Token verification failed:", err.message);
    if (err.name === 'JWSSignatureVerificationFailed') {
      throw new Error("Invalid token signature");
    } else if (err.name === 'JWTExpired') {
      throw new Error("Token expired");
    } else {
      throw new Error("Unauthorized");
    }
  }
}
