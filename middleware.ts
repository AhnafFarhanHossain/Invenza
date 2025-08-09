import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Handle "/" → auto-redirect if logged in
  if (request.nextUrl.pathname === "/") {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        await jwtVerify(token, secret);
        // Valid token → go to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        // Invalid token → stay on "/"
        return NextResponse.next();
      }
    }
    return NextResponse.next(); // No token → stay on "/"
  }

  // Handle dashboard protection
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
