import { getAuth } from "@/lib/auth-cached";
import Navbar from "./Navbar";

/**
 * Thin async server component that resolves the session then hands it to the
 * client Navbar. Rendered inside <Suspense> in the root layout so the static
 * HTML shell is streamed to the browser immediately without waiting for the
 * auth DB lookup.
 */
export default async function NavbarServer() {
  const session = await getAuth();
  return <Navbar session={session} />;
}
