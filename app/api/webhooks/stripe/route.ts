import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Stripe webhook — the real version of /api/sale.
// Listens for checkout.session.completed, verifies the signature, and records
// the sale. client_reference_id carries the Vurn visitorId (the /go redirect
// appends it to Stripe Payment Links), so the sale stitches deterministically
// to the device that clicked. Without it, recordSale falls back to the most
// recent clicker.
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = await Stripe.webhooks.constructEventAsync(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email ?? session.customer_email;
    const amount = (session.amount_total ?? 0) / 100;
    // Card payments on Payment Links are paid immediately; skip async methods
    // that complete later (those fire checkout.session.async_payment_succeeded).
    if (session.payment_status === "paid" && email && amount > 0) {
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      await convex.mutation(api.tracking.recordSale, {
        email,
        amount,
        ...(session.client_reference_id
          ? { visitorId: session.client_reference_id }
          : {}),
      });
    }
  }

  return NextResponse.json({ received: true });
}
