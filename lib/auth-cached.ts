import { cache } from "react";
import { auth } from "@/auth";

/**
 * React cache()-wrapped auth() so a single request only hits the DB once,
 * regardless of how many server components call getAuth() (e.g. layout + page).
 */
export const getAuth = cache(auth);
