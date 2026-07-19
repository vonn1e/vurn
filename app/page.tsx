"use client";

import Link from "next/link";
import { AsciiArt } from "@/components/ui/test";

const steps = [
  {
    n: "01",
    title: "Connect",
    body: "Sign in with YouTube, add your video links, and connect wherever you get paid — Stripe, ThriveCart, or Skool. Everything is copy-and-paste, a checklist walks you through each step, and nothing here can break your channel or your checkout. Most people are done before their coffee gets cold — and if anything looks off, a real person answers within 12 hours.",
  },
  {
    n: "02",
    title: "See",
    body: "Every video gets a price tag: dollars per view, sales attributed, revenue still maturing. Within 48 hours you'll know your #1 earner. It's probably not the one you think.",
  },
  {
    n: "03",
    title: "Make",
    body: "Every Monday: a Start / Fix / Stop brief. What to film next, which video needs its CTA repaired (and where), and which one to stop waiting on.",
  },
];

const features = [
  {
    title: "The Money Path.",
    body: "Your buyers didn't convert off one video. See the trail of videos that sent each buyer your way — in order, including the quiet trust-builders that never get the credit. Then make more of those.",
  },
  {
    title: "Impressions to income.",
    body: "We join YouTube Studio's data with your sales data, so a “failing” video gets a real diagnosis: a thumbnail-and-title problem (shown a lot, rarely clicked), a pitch problem (watched a lot, link rarely clicked), or an offer problem (link clicked a lot, few sales). Three different fixes. Stop guessing which one you have.",
  },
  {
    title: "Tracking that tells on itself.",
    body: "A live health score shows your data is 96% complete — and a watchdog pings every link daily so a silent 404 never eats a launch week again.",
  },
];

const faqs = [
  {
    q: "Does it work with Skool?",
    a: "Yes. Skool has no public API, so most tools give up — we built the bridge (Smart Link → your Skool about page → new-member events → matched to the click). If you sell a Skool community from YouTube, this was built for you.",
  },
  {
    q: "I run more than one channel — will my data get mixed together?",
    a: "Never. Each channel gets its own dashboard, its own benchmarks, its own grades. Want a combined view? It's there, clearly labeled, one tap away — but nothing merges unless you ask.",
  },
  {
    q: "How accurate is this?",
    a: "Honestly: no YouTube attribution is 100%, and anyone claiming it is selling you a story. We use server-side tracking, catch untrackable buyers with a one-question checkout survey, and show you a live health score so you always know how complete your picture is — per account, not a boilerplate FAQ answer.",
  },
  {
    q: "When will I see data?",
    a: "Clicks: in real time. Sales: seconds after checkout. YouTube's own stats (views, impressions, CTR): on YouTube's ~48-hour delay — that one's on them. Buyer journeys: they sharpen with every sale.",
  },
  {
    q: "How fast is support?",
    a: "First response within 12 hours, usually much faster. Beta users get a direct Slack line to the founder.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/5 bg-[#0b0e13]/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-emerald-400">
              Vurn
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">
              beta
            </span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/signin"
              className="rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              Join the free beta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <AsciiArt className="absolute inset-0 opacity-25 saturate-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-emerald-400 mix-blend-color"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b0e13]/60 via-[#0b0e13]/75 to-[#0b0e13]"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-20 pt-40 text-center">
          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
            You can&rsquo;t deposit views.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            Vurn shows you what every video actually earns — and what to film
            next. Set up in 10 minutes. By this time next week, every video on
            your channel has a price tag.
          </p>
          <Link
            href="/signin"
            className="mt-8 rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-emerald-950 shadow-xl shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30"
          >
            Join the free beta
          </Link>
          <p className="mt-3 text-xs text-white/35">
            Free while in beta. We&rsquo;ll ask for an honest testimonial if it
            works — and honest feedback if it doesn&rsquo;t.
          </p>
        </div>
      </section>

      {/* Skool bar */}
      <div className="border-y border-emerald-400/15 bg-emerald-500/[0.06]">
        <p className="mx-auto max-w-4xl px-6 py-4 text-center text-sm text-white/70">
          🎓 <span className="font-semibold text-white">Sell a Skool community?</span>{" "}
          Vurn shows you which videos bring in paying members — the thing
          Skool&rsquo;s dashboard and RevTrack both can&rsquo;t tell you.
        </p>
      </div>

      {/* Three steps */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Know your money videos in 3 steps.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-emerald-400/25"
            >
              <span className="font-mono text-xs text-emerald-400/70">
                {step.n}
              </span>
              <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature blocks */}
      <section className="border-t border-white/5 bg-black/20">
        <div className="mx-auto w-full max-w-3xl space-y-16 px-6 py-24">
          {features.map((f) => (
            <div key={f.title}>
              <h3 className="text-2xl font-bold tracking-tight text-emerald-300">
                {f.title}
              </h3>
              <p className="mt-3 leading-relaxed text-white/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Honesty block */}
      <section className="mx-auto w-full max-w-3xl px-6 py-24">
        <blockquote className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <p className="leading-relaxed text-white/70">
            &ldquo;Attribution on YouTube is genuinely hard — anyone promising
            100% is selling you a story. We built server-side tracking, we show
            you a health score instead of hiding gaps, and buyers who watched on
            their TV get caught by a one-question checkout survey. It&rsquo;s
            the most honest picture of your channel&rsquo;s money that
            exists.&rdquo;
          </p>
          <footer className="mt-4 text-sm text-white/40">— the founder</footer>
        </blockquote>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 bg-black/20">
        <div className="mx-auto w-full max-w-3xl px-6 py-24">
          <h2 className="text-3xl font-bold tracking-tight">
            The answers RevTrack can&rsquo;t give.
          </h2>
          <div className="mt-8 divide-y divide-white/5">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-white/85 transition-colors hover:text-white">
                  {faq.q}
                  <span className="text-emerald-400/60 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Beta CTA footer */}
      <section className="relative overflow-hidden border-t border-white/5">
        <AsciiArt className="absolute inset-0 opacity-10 saturate-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-emerald-400 mix-blend-color"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0e13]/70 via-[#0b0e13]/85 to-[#0b0e13]"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            We&rsquo;re letting in 50 channels.
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-white/60">
            Free during beta. You bring a channel that sells something;
            we&rsquo;ll show you what it really earns. If it changes how you
            film, we&rsquo;ll ask for a testimonial. That&rsquo;s the whole
            deal.
          </p>
          <Link
            href="/signin"
            className="mt-8 rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-emerald-950 shadow-xl shadow-emerald-500/25 transition-all hover:bg-emerald-400"
          >
            Join the free beta
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <p className="mx-auto max-w-6xl px-6 py-6 text-xs text-white/25">
          Vurn — every video gets a price tag.
        </p>
      </footer>
    </div>
  );
}
