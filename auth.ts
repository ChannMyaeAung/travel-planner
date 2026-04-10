import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import type { OAuthConfig } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Auth.js v5 / oauth4webapi validates every id_token JWT's "iss" claim against
// as.issuer. For type:"oauth" providers with explicit endpoints, as.issuer
// falls back to "https://authjs.dev" (hardcoded default — see callback.js:50
// TODO comment). Google always returns an id_token regardless of whether
// "openid" scope is requested. The result: every Google login fails with
// `unexpected JWT "iss" claim value`.
//
// Fix: use the token endpoint's `conform` hook (internal to auth.js, present
// in the JS runtime even though it's not in the @auth/core@0.41.0 TS types)
// to strip id_token from the raw HTTP response before oauth4webapi sees it.
// We fetch the user profile from the userinfo endpoint anyway, so the
// id_token is not needed.
interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

const GoogleOAuth: OAuthConfig<GoogleProfile> = {
  id: "google",
  name: "Google",
  type: "oauth",
  clientId: process.env.AUTH_GOOGLE_ID!,
  clientSecret: process.env.AUTH_GOOGLE_SECRET!,
  allowDangerousEmailAccountLinking: true,
  authorization: {
    url: "https://accounts.google.com/o/oauth2/v2/auth",
    params: { scope: "openid email profile" },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  token: {
    url: "https://oauth2.googleapis.com/token",
    // `conform` is not in the public TS types for @auth/core@0.41.0 but IS
    // called in the JS runtime (callback.js line 121) before JWT validation.
    // It receives the raw fetch Response and must return a (possibly mutated) Response.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    conform: async (response: Response): Promise<Response> => {
      const body = await response.clone().json();
      delete body.id_token; // prevent oauth4webapi from validating the JWT iss claim
      return new Response(JSON.stringify(body), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    },
  } as OAuthConfig<GoogleProfile>["token"],
  userinfo: "https://www.googleapis.com/oauth2/v3/userinfo",
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    };
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleOAuth,
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  callbacks: {
    // With PrismaAdapter + database sessions, `user` is the full DB user row.
    // The adapter already stores userId on the session; this callback exposes
    // it on session.user so server components and actions can read session.user.id.
    session: async ({ session, user }) => {
      if (session?.user) session.user.id = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
});
