import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED = ["/trips", "/globe"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !req.auth) {
    const signInUrl = new URL("/", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Exclude both OAuth callbacks from middleware — route.ts strips the RFC 9207
  // iss param from both before auth.js sees it (auth.js v5 beta.29 bug).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth/callback/github|api/auth/callback/google|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
