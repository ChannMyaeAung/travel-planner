import { handlers } from "@/auth";

export const runtime = "nodejs"; // Prisma requires Node.js runtime
export const dynamic = "force-dynamic"; // session cookies — never prerender

export const GET = handlers.GET;
export const POST = handlers.POST;
