"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AsciiArt } from "@/components/ui/test";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();

  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn("password", { email, password, flow });
      router.replace("/dashboard");
    } catch {
      setError(
        flow === "signIn"
          ? "That email and password didn't match. New here? Switch to create an account."
          : "Couldn't create the account — passwords need 8+ characters, and the email may already be registered.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <AsciiArt className="absolute inset-0 opacity-15 saturate-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-emerald-400 mix-blend-color"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b0e13]/70 via-[#0b0e13]/85 to-[#0b0e13]"
      />

      <div className="relative w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-baseline justify-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-emerald-400">
            Vurn
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">
            beta
          </span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-sm">
          <h1 className="text-lg font-semibold">
            {flow === "signIn" ? "Welcome back" : "Join the free beta"}
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {flow === "signIn"
              ? "Sign in to see what your videos earn."
              : "Create an account. Every video gets a price tag."}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@channel.com"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none placeholder:text-white/25 focus:border-emerald-400/60"
            />
            <input
              type="password"
              required
              minLength={8}
              autoComplete={flow === "signIn" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (8+ characters)"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm outline-none placeholder:text-white/25 focus:border-emerald-400/60"
            />
            {error && <p className="text-xs text-rose-400">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 disabled:opacity-50"
            >
              {busy
                ? "One moment…"
                : flow === "signIn"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <button
            onClick={() => {
              setFlow(flow === "signIn" ? "signUp" : "signIn");
              setError(null);
            }}
            className="mt-4 w-full text-center text-xs text-white/40 transition-colors hover:text-emerald-300"
          >
            {flow === "signIn"
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
