"use server";
import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";

export const login = async () => {
  try {
    await signIn("github", { redirectTo: "/" });
  } catch (error: unknown) {
    // Handle Next.js redirect (this is expected behavior)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      throw error; // Re-throw redirect errors
    }
    // Handle actual sign in errors
    console.error("Actual sign in error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut({ redirectTo: "/" });
  } catch (error: unknown) {
    // Handle Next.js redirect (this is expected behavior)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      throw error; // Re-throw redirect errors
    }
    console.error("Actual sign out error:", error);
    redirect("/");
  }
};
