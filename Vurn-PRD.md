# PRD v2 — YouTube Revenue Intelligence for Creators

**Working title:** Signal (final name candidates in §10)
**Prepared for:** Claude Code (build agent)
**Owner:** Vonnie
**Version:** 2.0 — supersedes PRD v1
**Model:** Free beta → testimonials → paid launch (pricing intentionally out of scope)
**Status:** Final review — awaiting Vonnie's approval before any build begins

---

## 1. What changed since v1

v1 was a better RevTrack. v2 is a different category. Three research passes drove the shift: (a) what creators actually obsess over (impressions/CTR, outlier scores, velocity — none of it in RevTrack), (b) what buyers actually do (consume hours of content across many touchpoints before purchasing — invisible to last-click tools), and (c) what RevTrack's own copy confesses — its site describes itself, verbatim, as offering "done-for-you setup and 12 months support" (that exact phrase is the page's own meta description, the text they wrote for Google and social previews) = fragile tracking sold as a service through one founder's audience, reporting the past instead of directing the future.

**Positioning:** RevTrack tells you what happened. We tell you what to make next — and set ourselves up in 10 minutes.

## 2. The promise (this is the product)

> **Set up in 10 minutes. By this time next week, every video on your channel has a price tag.**

Every feature exists to keep that sentence true. If a feature doesn't shorten the path from "connected" to "confident about the next upload," it waits.

## 3. Who it's for

Monetized YouTubers who sell something — **Skool communities first** (a huge wave of creators run one as side income and no tool tracks which videos bring them paying members), plus courses, coaching, SaaS, services, affiliates — from 5k to 2M subs. Solo or tiny teams. They check analytics on their phone, feel genuine anxiety when a video flops, and secretly wonder whether they're building a business or feeding an algorithm. v1 targets own-product and Skool sellers (cleanest tracking); blended income (AdSense/affiliates/sponsors) in P1 widens to every monetized creator.

## 4. The emotional core (informs all copy and UX)

The feeling we resolve: **making videos blind.** A video gets 500k views and the bank account doesn't notice; another gets 12k views and quietly pays the mortgage — and the creator can't tell which is which, so every upload is a coin flip performed in public. YouTube Studio measures applause. You can't deposit applause. The product's job is to end the coin flip.

## 5. Core loop

Connect → See → Make.
1. **Connect** (10 min): sign in with YouTube, add your links, connect your checkout. A checklist walks through each piece; nothing can break.
2. **See** (48 hrs): every video priced in $ per view; buyer journeys appear; maturing revenue marked.
3. **Make** (weekly): the Start / Fix / Stop brief tells them what to film, what to repair, what to stop waiting on.

## 6. Feature set

### P0 — the beta (nothing ships after this until this is solid)

**F1 — Ten-minute self-serve setup.** YouTube OAuth (Analytics API), **Smart Links** — one stable, trackable link per video and placement (description / pinned / card / end screen) — one server-side pixel snippet (GTM + Shopify + generic), Stripe + ThriveCart webhooks, Zapier fallback. **Skool supported at launch** — Skool has no public API, so support runs through its verified Zapier/Make triggers: Smart Link → Skool about page (ref param) → "new paid member" event → email-matched to the click session. RevTrack's FAQ says it can't support Skool; we lead with it. **Multi-channel from day one:** every record is channel-scoped at the data-model level — connect several channels and each keeps its own dashboard, benchmarks, and grades, never merged (RevTrack blends multiple channels into one soup). Setup completion is the activation metric; every screen has a live checklist.

**F2 — Data Health Score.** Their weakness becomes our trust signal. A visible "tracking 96% healthy" indicator: pixel firing, webhooks received, links resolving (watchdog pings every Smart Link daily, alerts on 404s), server-side capture vs. blocked-client estimate. When data is degraded we *say so* instead of showing quiet holes.

**F3 — Impressions-to-Income funnel.** The full spine per video, in plain language at every step: **Thumbnail shown** (an impression — YouTube displayed your thumbnail to someone) → **Thumbnail clicked** (CTR — the % who tapped it; this is where your thumbnail and title do their job) → **Watched** (a view) → **Your link clicked** (they tapped the link in your description or pinned comment — a completely different click from the thumbnail one) → Emails → Bookings → Sales → Revenue. Note for UI copy: never say bare "clicks" — always "thumbnail clicks" or "link clicks," because creators conflate them. Joining Studio data with sales data lets the product diagnose *which* problem a video has: **packaging** (thumbnail shown plenty, rarely clicked → the thumbnail/title needs work), **pitch** (watched plenty, link rarely clicked → the in-video ask needs work), or **offer** (link clicked plenty, few sales → the landing page/product needs work). Three different problems, three different fixes — RevTrack can't tell them apart because it starts at views.

**F4 — Content table, rebuilt.** Thumbnail-led essentials (Views, Clicks, Emails, Sales, Revenue, $/view, Grade) with expandable full-funnel rows. Revenue Grade = $/view vs. trailing channel average (Shorts excluded), styled as an outlier score — creators already think in "3× my average" language.

**F5 — The Money Path (the feature nobody else has).** Per-buyer journey reconstruction: which videos each buyer clicked out from before purchasing, in order. Surfaced as: average videos-before-purchase, average days-from-first-click-to-purchase, the Top Assist videos that appear in the most journeys but rarely get last-click credit, and first-touch vs. last-touch revenue columns. An optional "estimated watch time before purchase" figure (sum of average view duration across the videos in the journey) is always labeled *estimated*.

*How it works technically (honest scope):* YouTube does not expose any individual viewer's watch history to anyone — so no tool on earth can literally see every video a buyer watched, and we never claim to. What we can build deterministically: (1) every Smart Link is unique per video + placement and routes through our redirect service, which sets a first-party visitor ID on the creator's own domain; (2) each later click from any other video appends to that same visitor's timeline; (3) when the visitor submits an email (lead form) or purchases (Stripe/checkout webhook carries the email), we stitch the identity and the full ordered click-trail becomes their Money Path; (4) cross-device journeys merge whenever the same email appears on both devices; (5) videos they watched but never clicked from are filled in two honest ways — the one-question checkout survey ("which video sent you?") and aggregate correlation, both clearly labeled. v1 ships deterministic click-journeys only; probabilistic enrichment later.

**F6 — Maturing revenue.** Median view-to-sale lag computed per channel; videos younger than the lag get a "still maturing" badge instead of a bad grade. Simple decay curve per video (revenue by month since publish) with an "evergreen" tag for long-tail earners. Kills the false negative that makes creators abandon slow-burn winners.

**F7 — The Start / Fix / Stop brief.** Weekly email + in-app card, rules-based in v1: START (topics/formats of revenue outliers — "your case-study style earns 3.4× average, film another"), FIX (specific repair with location — "561k views, 0.75% link CTR: add a spoken ask ~2:00 and a pinned comment"), STOP (release expectations — "this one's done earning; stop waiting on it"). This closes the gap between RevTrack's marketing (make only videos that convert) and its product (a spreadsheet).

### P1 — first paid-launch wave
Blended income per video (AdSense import, affiliate/sponsor CSV + manual), self-reported attribution ("how did you hear?" widget reconciled against click data to catch TV/dark viewers), retention curve × CTA overlay (did the pitch cost viewers, and did it pay?), alerts (velocity spikes, conversion collapses, old video waking up), split tests with plain-language significance, multi-channel switcher UI (isolation already built in P0 — this is just the picker and cross-channel rollup view, clearly labeled, opt-in).

### P2 — expansion (named for creators, explained in plain English)
- **Money Moments** (timestamp attribution) — see *which moments in a video* make people click your link (e.g., "the ask at 11:20 drove 41% of clicks"), so you learn exactly where to place CTAs next time.
- **Revenue Forecast** — next month's income shown as an honest range ("$28k–$41k") based on how your videos' earnings decay — never a fake-precise single number.
- **The Brag Sheet** (sponsor export) — one click produces a polished PDF of your conversion stats ("my audience doesn't just watch, they buy — here's proof") to hand to sponsors and justify higher rates.
- **Studio Access** (team roles) — your editor or VA gets studio access, not your password. View-only or limited permissions, revocable anytime.
- **Where You Stand → Peer Benchmarks** (opt-in) — a section that answers the quiet question: your CTR, $/view, and conversion rates against anonymized channels of similar size and niche. Nobody sees your numbers; you see where you stand.

### Gaps lifted straight from RevTrack's own FAQ (each becomes a checkbox we win)
1. **Skool:** they say no; we say yes at launch (via F1's Zapier/Make path). Skool communities are where a huge share of YouTube-preneurs already sell — this alone converts switchers. *Competitive check (researched):* Skool's built-in analytics are an operator health check — member counts, MRR, churn, trials, about-page conversion — and its in-progress "Advanced Analytics" will add coarse member-source buckets (affiliates, social, search, ads, direct). Nothing connects a specific YouTube **video** to a paying member, and Skool has no incentive to build the off-platform link/redirect layer that requires. We are not reinventing the wheel; we're building the wheel Skool doesn't make.
2. **Multiple channels:** they merge all data together; we isolate per channel with per-channel benchmarks, plus an optional labeled rollup. Never silently mixed.
3. **Accuracy & data-timing transparency:** instead of vague FAQ reassurance, an in-product "Accuracy & timing" page states plainly what's tracked and what isn't, and when each data type lands: clicks in real time, sales within seconds of the webhook, YouTube Studio metrics on YouTube's ~48-hour API delay, Money Path journeys sharpening as sales accumulate. The F2 health score makes the answer live, per-account, not boilerplate.
4. **Support:** they promise answers within 24 hours; we commit to a first response within 12 (concierge Slack during beta typically much faster). Stated on the site, measured internally.

## 7. Explicitly not building
Thumbnail A/B testing, SEO keyword tools, comment management, TikTok/IG attribution, sub-accounts/agency features (until pulled by demand).

## 8. Data model (delta from v1)
**Every table carries `channel_id` from day one — isolation is architectural, not a filter.** Add: `impressions_daily` (channel_id, video_id, impressions, ctr, avd — from Studio API), `journeys` (channel_id, buyer_email_hash, ordered video touchpoints, minutes, first_touch_video, last_touch_video), `revenue_maturity` (per-channel median lag, per-video maturity state), `health_checks` (pixel/webhook/link status timeline), `briefs` (weekly generated Start/Fix/Stop payloads), `external_events` (source: skool|zapier|make, event type, email_hash, value — powers Skool and any no-API platform). Aggregates materialized nightly per channel; journeys recomputed on purchase events.

## 9. Landing page copy (v1 — free beta)

### Hero
**Headline:** You can't deposit views.
**Subhead:** [NAME] shows you what every video actually earns — and what to film next. Set up in 10 minutes. By this time next week, every video on your channel has a price tag.
**CTA button:** Join the free beta
**Under-button microcopy:** Free while in beta. We'll ask for an honest testimonial if it works — and honest feedback if it doesn't.
**Skool bar (directly under hero — lead with this):** 🎓 **Sell a Skool community?** [NAME] shows you which videos bring in paying members — the thing Skool's dashboard and RevTrack both can't tell you.

*Alt heroes (test in beta):*
- **Your best video isn't your most-viewed one.** Find the uploads quietly paying your rent — and make more of them.
- **Stop filming coin flips.** Every upload is a gamble until you know which videos make money. Know.

### The three steps (section)
**Know your money videos in 3 steps.**
1. **Connect** — Sign in with YouTube, add your video links, and connect wherever you get paid — Stripe, ThriveCart, or Skool. Everything is copy-and-paste, a checklist walks you through each step, and nothing here can break your channel or your checkout. Most people are done before their coffee gets cold — and if anything looks off, a real person answers within 12 hours.
2. **See** — Every video gets a price tag: dollars per view, sales attributed, revenue still maturing. Within 48 hours you'll know your #1 earner. It's probably not the one you think.
3. **Make** — Every Monday: a Start / Fix / Stop brief. What to film next, which video needs its CTA repaired (and where), and which one to stop waiting on.

### Feature blocks (three, in order)
**The Money Path.** Your buyers didn't convert off one video. See the trail of videos that sent each buyer your way — in order, including the quiet trust-builders that never get the credit. Then make more of those.

**Impressions to income.** We join YouTube Studio's data with your sales data, so a "failing" video gets a real diagnosis: a thumbnail-and-title problem (shown a lot, rarely clicked), a pitch problem (watched a lot, link rarely clicked), or an offer problem (link clicked a lot, few sales). Three different fixes. Stop guessing which one you have.

**Tracking that tells on itself.** A live health score shows your data is 96% complete — and a watchdog pings every link daily so a silent 404 never eats a launch week again.

### Honesty block (founder note)
"Attribution on YouTube is genuinely hard — anyone promising 100% is selling you a story. We built server-side tracking, we show you a health score instead of hiding gaps, and buyers who watched on their TV get caught by a one-question checkout survey. It's the most honest picture of your channel's money that exists."

### FAQ (landing page — the answers RevTrack can't give)
**Does it work with Skool?** Yes. Skool has no public API, so most tools give up — we built the bridge (Smart Link → your Skool about page → new-member events → matched to the click). If you sell a Skool community from YouTube, this was built for you.
**I run more than one channel — will my data get mixed together?** Never. Each channel gets its own dashboard, its own benchmarks, its own grades. Want a combined view? It's there, clearly labeled, one tap away — but nothing merges unless you ask.
**How accurate is this?** Honestly: no YouTube attribution is 100%, and anyone claiming it is selling you a story. We use server-side tracking, catch untrackable buyers with a one-question checkout survey, and show you a live health score so you always know how complete your picture is — per account, not a boilerplate FAQ answer.
**When will I see data?** Clicks: in real time. Sales: seconds after checkout. YouTube's own stats (views, impressions, CTR): on YouTube's ~48-hour delay — that one's on them. Buyer journeys: they sharpen with every sale.
**How fast is support?** First response within 12 hours, usually much faster. Beta users get a direct Slack line to the founder.

### Beta CTA (footer)
**We're letting in [50] channels.** Free during beta. You bring a channel that sells something; we'll show you what it really earns. If it changes how you film, we'll ask for a testimonial. That's the whole deal. → Join the free beta

## 10. Name candidates

Criteria: short, a little creative, hints at the measurable outcome (videos that pay).

| Name | Why it works | Watch-outs |
|---|---|---|
| **The Take** | Film term ("take one") × "your take" = money earned. "What's your take this month?" becomes product language. | Short domains contested; brand as *usetake.com / thetake.app*. |
| **PerView** | The product's core metric ($ per view) as the brand. Instantly explains itself to any creator. | Reads slightly clinical; strong for a data brand. |
| **Residuals** | Hollywood word for getting paid long after release — exactly the evergreen promise. Emotional for anyone who dreams of videos that keep paying. | Longer; check trademark in entertainment. |
| **BoxOffice** | "What did it gross?" Every creator understands instantly. | Playful more than precise; possible mark conflicts. |
| **PayView** | Views that pay. Blunt, memorable, honest. | Close to "pay-per-view"; could read adult/PPV. |
| **GreenScreen** | Production term × the color of money. "The only green screen that shows you the money." | Pun-forward; check existing tools with the name. |
| **MoneyPath** | Names the flagship feature; describes the buyer-journey promise literally. | Descriptive > distinctive; fine as feature name if not product name. |
| **Rerun** | Old episodes that keep paying — the evergreen dream. Warm, nostalgic. | Hints at only half the product. |
| **Bankroll** | Outcome-forward, creator-slang adjacent. | Gambling connotation. |
| **Deposit** | "You can't deposit views. Now you can." Copy writes itself. | Fintech-sounding; may confuse category. |

**Recommendation:** *The Take* (primary) — cinematic + money in one word, endless copy hooks ("Take 47 finally paid"), with **PerView** as the pragmatic runner-up and **Residuals** as the premium/emotional dark horse. Verify domains and trademarks before committing; none checked here.

## 11. Beta plan & success metrics

Recruit 30–50 channels that sell something (warm networks, r/PartneredYoutube, X creator-econ circles) — deliberately over-index on Skool community sellers, since they're locked out of RevTrack and will feel the difference immediately. Free, in exchange for: permission to use anonymized data in case studies + a testimonial if satisfied. Concierge Slack channel; weekly office hours for the first month. **Support SLA: first response within 12 hours** (vs. RevTrack's stated 24), tracked from day one so the claim on the site is always true.

Activation: % completing setup unassisted in ≤1 day (target 70%) and % who can name their top money video within 48 hours (target 80%). Engagement: Start/Fix/Stop brief open rate ≥50%. Proof: 10 usable testimonials + 3 case studies with hard numbers before any pricing page exists. North star: attributed revenue tracked per active channel.

## 12. V1 — proof of concept (build this first, keep it small)

**Goal:** the smallest thing that produces the "whoa" moment, in one sitting, with nothing over-engineered. The excitement test that defines done: open the dashboard on your laptop, tap a Smart Link on your phone, and watch the click counter tick up **live**. Press "simulate sale," watch revenue appear on that video, and watch a Money Path draw itself. That's it — if that loop works and feels good, V1 has proven the product.

**Three screens, nothing more:**
1. **Smart Links** — paste a YouTube URL + a destination URL → get a short link (`/go/xyz`). List of existing links with copy buttons.
2. **Dashboard** — one table: video title, link clicks (updating in real time), sales, revenue, $ per click. No YouTube API, no OAuth, no views column yet — that's deliberate.
3. **Money Path** — journeys assembled from click trails + sales, shown as a simple timeline per buyer (Video A → Video C → 💰).

**Mechanics (minimal):** the `/go/[slug]` route logs `{linkId, visitorId (cookie), timestamp}` and redirects. A "simulate sale" button (and a bare `/api/sale` endpoint that later becomes the Stripe webhook) posts `{email, amount, visitorId}`. One function stitches email ↔ visitor and materializes journeys.

**Explicitly not in V1:** login/auth (single hardcoded workspace), YouTube OAuth, Skool/Zapier, health score, briefs, grades, multi-channel, emails. Every one of these waits.

**Stack (decided):**
- **Next.js** (App Router) + **Tailwind CSS**, with **21st.dev** components for a beautiful UI fast.
- **Convex** (convex.dev) as the database and backend functions. Convex is a genuinely good fit here beyond preference: its live queries mean the dashboard's click counter updates in real time with zero extra code — which *is* the demo magic.
- The Smart Link redirect runs as a route in the same Next.js app for V1 (`/go/[slug]`); a dedicated link domain comes later.

**Version control & hosting:**
- **GitHub:** create the repo first, commit from day one (`git init` → first commit → push), small commits per feature so anything can be rolled back. Claude will walk through the exact commands during the build.
- **Host: Vercel (recommended).** Free Hobby tier, built by the Next.js team so deploys are zero-config, fast global edge network, and it auto-deploys every push to the GitHub repo — push code, see it live in ~a minute. Netlify is also fast and reliable, but its Next.js support runs through a compatibility adapter that can lag new Next.js features; for a Next.js app, Vercel is the friction-free choice. (Convex hosts its own data layer on its free tier, so hosting cost for V1 is $0 either way.)

## 13. Beta build order (after V1 is approved and exciting)

**M1 (beta core):** F1 setup + F2 health + F4 table + F3 impressions join.
**M2 (the headliner):** F5 Money Path + F6 maturing revenue.
**M3 (the voice):** F7 briefs + landing page + beta onboarding flow.
Ship M1–M3, run beta 6–8 weeks, then P1.
