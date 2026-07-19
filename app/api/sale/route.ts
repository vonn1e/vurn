import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Bare sale endpoint — this later becomes the Stripe webhook.
// Body: { email, amount, visitorId? }. If visitorId is omitted, the sale
// attaches to the most recent clicker (handy for the simulate-sale demo).
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, amount, visitorId } = (body ?? {}) as {
    email?: unknown;
    amount?: unknown;
    visitorId?: unknown;
  };
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  const parsedAmount = typeof amount === "string" ? Number(amount) : amount;
  if (typeof parsedAmount !== "number" || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  await convex.mutation(api.tracking.recordSale, {
    email,
    amount: parsedAmount,
    ...(typeof visitorId === "string" && visitorId ? { visitorId } : {}),
  });

  return NextResponse.json({ ok: true });
}
