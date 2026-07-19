"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Fragment } from "react";
import { AsciiArt } from "@/components/ui/test";

const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

const when = (ts: number) =>
  new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function MoneyPathPage() {
  const journeys = useQuery(api.journeys.list);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Money Path</h1>
        <p className="mt-1 text-sm text-white/50">
          One trail per buyer: the videos they clicked out from, in order,
          ending at the purchase.
        </p>
      </div>

      {journeys === undefined && (
        <p className="text-sm text-white/40">Loading journeys…</p>
      )}
      {journeys?.length === 0 && (
        <div className="relative overflow-hidden rounded-xl border border-dashed border-white/15">
          <AsciiArt className="absolute inset-0 opacity-15 saturate-0" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-emerald-400 mix-blend-color"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b0e13]/50 via-[#0b0e13]/70 to-[#0b0e13]/90"
          />
          <p className="relative px-6 py-14 text-center text-sm text-white/50">
            No journeys yet. Click a Smart Link, then hit “Simulate sale” on
            the dashboard — a path will draw itself here.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {journeys?.map((journey) => (
          <div
            key={journey.email}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-sm text-white/70">{journey.email}</p>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold tabular-nums text-emerald-300">
                {money(journey.totalSpent)} total
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-y-3">
              {journey.steps.map((step, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <span className="mx-2 shrink-0 text-white/30">→</span>
                  )}
                  {step.kind === "click" ? (
                    <span
                      className="max-w-56 rounded-lg border border-white/10 bg-black/30 px-3 py-2"
                      title={step.videoUrl}
                    >
                      <span className="block truncate text-sm font-medium">
                        {step.videoTitle ?? step.videoUrl}
                      </span>
                      <span className="block text-[11px] text-white/40">
                        {when(step.timestamp)}
                      </span>
                    </span>
                  ) : (
                    <span className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2">
                      <span className="block text-sm font-semibold text-emerald-300">
                        💰 {money(step.amount)}
                      </span>
                      <span className="block text-[11px] text-emerald-300/60">
                        {when(step.timestamp)}
                      </span>
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
