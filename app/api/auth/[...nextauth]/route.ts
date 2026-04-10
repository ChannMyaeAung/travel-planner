import { handlers } from "@/auth";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Both GitHub and Google send iss in OAuth callbacks (RFC 9207 / OIDC).
// Auth.js v5 beta.29 bug: validateAuthResponse compares iss against
// its own default issuer ("https://authjs.dev") rather than the
// provider's actual issuer, so it always fails in the route-handler
// codepath regardless of provider type.
// Strip iss from both callbacks so validateAuthResponse skips the check.
const OAUTH_CALLBACK_PATHS = [
  "/api/auth/callback/github",
  "/api/auth/callback/google",
];

function stripOAuthIss(req: NextRequest): NextRequest {
  const url = new URL(req.url);
  if (OAUTH_CALLBACK_PATHS.includes(url.pathname) && url.searchParams.has("iss")) {
    url.searchParams.delete("iss");
    return new NextRequest(url.toString(), req);
  }
  return req;
}

export function GET(req: NextRequest) {
  return handlers.GET(stripOAuthIss(req));
}

export function POST(req: NextRequest) {
  return handlers.POST(req);
}
