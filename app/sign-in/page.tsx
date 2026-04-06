import { loginWith } from "@/lib/auth-actions";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method. Use the original provider you signed up with.",
  OAuthSignin: "Could not start the sign-in flow. Please try again.",
  OAuthCallback: "Something went wrong during sign-in. Please try again.",
  Verification: "The sign-in link has expired. Please request a new one.",
  Default: "An unexpected error occurred. Please try again.",
};

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // In Next.js 15+, searchParams is a Promise in server components
  // We use an inline async IIFE via React's use() pattern, but since this
  // is a plain server component we can just await at the top.
  return <SignInContent searchParamsPromise={searchParams} />;
}

async function SignInContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ error?: string }>;
}) {
  const { error } = await searchParamsPromise;
  const errorMessage = error
    ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default)
    : null;
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Back link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="p-2.5 bg-blue-600 rounded-xl group-hover:bg-blue-700 transition-colors duration-200">
              <Image
                src="/logo.png"
                alt="Travel Planner"
                width={26}
                height={26}
                className="brightness-0 invert"
              />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Travel Planner
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm">
            Sign in to continue planning your adventures
          </p>
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 animate-fade-in-up">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-3 animate-fade-in-up animation-delay-100">
          {/* GitHub */}
          <form
            action={async () => {
              "use server";
              await loginWith("github");
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-md"
            >
              {/* GitHub icon */}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">or</span>
            </div>
          </div>

          {/* Google */}
          <form
            action={async () => {
              "use server";
              await loginWith("google");
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-sm"
            >
              {/* Google icon */}
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By signing in you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
