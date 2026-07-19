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

  // Stripe Payment Links accept client_reference_id and echo it back in the
  // checkout webhook — that's how a sale stitches to this exact visitor.
  let target = destinationUrl;
  if (target) {
    try {
      const url = new URL(target);
      if (url.hostname === "buy.stripe.com") {
        url.searchParams.set("client_reference_id", visitorId);
        target = url.toString();
      }
    } catch {
      // Leave the destination untouched if it isn't a valid URL.
    }
  }

  const response = target
    ? NextResponse.redirect(target, 302)
    : NextResponse.redirect(new URL("/links", request.url), 302);

  response.cookies.set(VISITOR_COOKIE, visitorId, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
