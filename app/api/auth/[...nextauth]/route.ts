import { handlers } from "@/auth";

export const runtime = "nodejs"; // <- important for Prisma
export const dynamic = "force-dynamic"; // avoids static optimization

export const GET = handlers.GET;
export const POST = handlers.POST;
