"use server";
import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";

function isNextRedirect(error: unknown): boolean {
  return (
    !!error &&
    typeof error === "object" &&
    "digest" in error &&
    typeof (error as { digest: string }).digest === "string" &&
    (error as { digest: string }).digest.includes("NEXT_REDIRECT")
  );
}

export const loginWith = async (provider: "github" | "google") => {
  try {
    await signIn(provider, { redirectTo: "/" });
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    console.error(`Sign-in error (${provider}):`, error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut({ redirectTo: "/" });
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    console.error("Sign-out error:", error);
    redirect("/");
  }
};
