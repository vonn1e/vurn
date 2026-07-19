import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const VISITOR_COOKIE = "vurn_vid";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const visitorId = request.cookies.get(VISITOR_COOKIE)?.value ?? crypto.randomUUID();

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const destinationUrl = await convex.mutation(api.tracking.logClick, {
    slug,
    visitorId,
  });

  const response = destinationUrl
    ? NextResponse.redirect(destinationUrl, 302)
    : NextResponse.redirect(new URL("/links", request.url), 302);

  response.cookies.set(VISITOR_COOKIE, visitorId, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
