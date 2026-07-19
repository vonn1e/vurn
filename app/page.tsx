"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";

const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

function LiveCell({ value }: { value: number }) {
  const prev = useRef(value);
  const [flashKey, setFlashKey] = useState(0);
  useEffect(() => {
    if (value !== prev.current) {
      prev.current = value;
      setFlashKey((k) => k + 1);
    }
  }, [value]);
  return (
    <span
      key={flashKey}
      className={`inline-block rounded px-1.5 py-0.5 tabular-nums ${flashKey ? "tick-flash" : ""}`}
    >
      {value.toLocaleString("en-US")}
    </span>
  );
}

function SimulateSaleButton() {
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const counter = useRef(1);

  async function simulate() {
    setBusy(true);
    setLastResult(null);
    const email = `buyer${Date.now() % 1000}${counter.current++}@demo.test`;
    const amount = [49, 99, 149, 199, 299][Math.floor(Math.random() * 5)];
    try {
      const res = await fetch("/api/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount }),
      });
      const data = await res.json();
      setLastResult(
        res.ok
          ? `${money(amount)} sale recorded for ${email}`
          : (data.error ?? "Something went wrong"),
      );
    } catch {
      setLastResult("Request failed — is the dev server running?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {lastResult && <span className="text-xs text-white/50">{lastResult}</span>}
      <button
        onClick={simulate}
        disabled={busy}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-50"
      >
        {busy ? "Recording…" : "💸 Simulate sale"}
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const stats = useQuery(api.dashboard.videoStats);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-white/50">
            Every video, priced. Clicks tick up live — try tapping a Smart Link
            on your phone.
          </p>
        </div>
        <SimulateSaleButton />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Link clicks", value: stats?.totals.clicks ?? 0 },
          { label: "Sales", value: stats?.totals.sales ?? 0 },
          { label: "Revenue", value: stats ? money(stats.totals.revenue) : "—" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-white/40">
              {card.label}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-300">
              {typeof card.value === "number"
                ? card.value.toLocaleString("en-US")
                : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs uppercase tracking-wide text-white/40">
              <th className="px-5 py-3 font-medium">Video</th>
              <th className="px-5 py-3 text-right font-medium">Link clicks</th>
              <th className="px-5 py-3 text-right font-medium">Sales</th>
              <th className="px-5 py-3 text-right font-medium">Revenue</th>
              <th className="px-5 py-3 text-right font-medium">$ / click</th>
            </tr>
          </thead>
          <tbody>
            {stats === undefined && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-white/40">
                  Loading…
                </td>
              </tr>
            )}
            {stats?.table.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-white/40">
                  No videos yet — create a Smart Link first.
                </td>
              </tr>
            )}
            {stats?.table.map((row) => (
              <tr
                key={row.videoUrl}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
              >
                <td className="max-w-xs truncate px-5 py-3 font-medium">
                  {row.videoTitle ?? row.videoUrl}
                </td>
                <td className="px-5 py-3 text-right">
                  <LiveCell value={row.clicks} />
                </td>
                <td className="px-5 py-3 text-right tabular-nums">
                  {row.sales.toLocaleString("en-US")}
                </td>
                <td className="px-5 py-3 text-right font-semibold tabular-nums text-emerald-300">
                  {money(row.revenue)}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-white/70">
                  {money(row.perClick)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
