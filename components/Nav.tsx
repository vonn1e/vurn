"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";

const tabs = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/links", label: "Smart Links" },
  { href: "/path", label: "Money Path" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();

  return (
    <header className="border-b border-white/10 bg-[#0d1117]/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl items-center gap-8 px-6 py-4">
        <Link href="/dashboard" className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-emerald-400">
            Vurn
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">
            beta
          </span>
        </Link>
        <nav className="flex gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={async () => {
            // Leave the gated area first so the auth-gate redirect to /signin
            // doesn't race the navigation to the landing page.
            router.push("/");
            await signOut();
          }}
          className="ml-auto rounded-md px-3 py-1.5 text-sm font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
