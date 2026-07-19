# Vurn — V1 proof of concept

The smallest thing that produces the "whoa" moment (PRD §12): watch a click
counter tick up **live** on the dashboard, press **Simulate sale**, watch
revenue land on a video, and watch a Money Path draw itself.

## The three screens

| Screen | Route | What it does |
|---|---|---|
| Smart Links | `/links` | Paste a YouTube URL + destination URL → get a short `/go/xyz` link. List with copy buttons. Video titles resolve automatically (YouTube oEmbed — no API key, no OAuth). |
| Dashboard | `/` | One table per video: link clicks (live), sales, revenue, $ per click. Plus the **💸 Simulate sale** button. |
| Money Path | `/path` | One timeline per buyer: the videos they clicked out from, in order, ending in 💰. |

## Mechanics

- `GET /go/[slug]` logs `{linkId, visitorId (cookie), timestamp}` to Convex and 302-redirects to the destination. If the destination is a Stripe Payment Link (`buy.stripe.com`), the visitor id rides along as `client_reference_id`.
- `POST /api/sale` takes `{email, amount, visitorId?}` — the manual/simulated sale endpoint. If `visitorId` is omitted (the simulate button does this), the sale attaches to the most recent clicker, so the phone-tap → laptop-sale demo just works.
- `POST /api/webhooks/stripe` — the real thing. Verifies the `stripe-signature` header, handles `checkout.session.completed`, and records the sale stitched to the `client_reference_id` visitor.
- Journeys are stitched by matching a sale's email to its visitor's ordered click trail (`convex/journeys.ts`).
- Live updates are Convex reactive queries — zero polling code.

## Run it

```bash
npm install
npm run dev
```

That starts Next.js (`localhost:3000`) and a local anonymous Convex deployment
(`127.0.0.1:3210`) in parallel. No accounts or API keys needed.

## Demo script (the excitement test)

1. Open `localhost:3000/links`, create a Smart Link for any YouTube video.
2. Open the dashboard on your laptop. On your phone (same network, use the
   `http://<laptop-ip>:3000` address Next.js prints), tap the `/go/...` link.
3. Watch the click counter tick up live.
4. Press **💸 Simulate sale** → revenue appears on that video.
5. Open Money Path → the buyer's trail has drawn itself.

## Stripe test-mode setup (real fake money)

1. In Stripe (test mode/sandbox): create a product + price, then a **Payment Link** for it.
2. Create a Smart Link whose destination is that `buy.stripe.com` URL.
3. Developers → Webhooks → Add endpoint: `https://<your-domain>/api/webhooks/stripe`, event `checkout.session.completed`.
4. Copy the signing secret (`whsec_…`) into the `STRIPE_WEBHOOK_SECRET` env var (Vercel project settings, and `.env.local` for local dev), then redeploy.
5. Tap the Smart Link, pay with test card `4242 4242 4242 4242` (any expiry/CVC/ZIP). The sale lands in seconds, attributed to the video that sent it.

## Explicitly not in V1 (per PRD §12)

Login/auth (single hardcoded workspace), YouTube OAuth, Skool/Zapier, health
score, briefs, grades, multi-channel, emails.

## Stack

Next.js (App Router) + Tailwind CSS + Convex (live queries). See
[Vurn-PRD.md](Vurn-PRD.md) for the full product spec.

## Next steps toward hosting (manual, one-time)

- **GitHub**: create a repo and `git remote add origin … && git push -u origin main` (local history is already committed).
- **Convex**: `npx convex login` + `npx convex dev --configure` to move from the local anonymous deployment to a hosted free-tier project (required before deploying anywhere).
- **Vercel**: import the GitHub repo; set `NEXT_PUBLIC_CONVEX_URL` to the hosted Convex URL.
