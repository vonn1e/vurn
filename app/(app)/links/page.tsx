"use client";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { FormEvent, useEffect, useState } from "react";

export default function SmartLinksPage() {
  const links = useQuery(api.links.list);
  const createLink = useMutation(api.links.create);

  const [videoUrl, setVideoUrl] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [origin, setOrigin] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      new URL(videoUrl);
      new URL(destinationUrl);
    } catch {
      setError("Both fields need full URLs, including https://");
      return;
    }
    setCreating(true);
    try {
      await createLink({ videoUrl, destinationUrl });
      setVideoUrl("");
      setDestinationUrl("");
    } finally {
      setCreating(false);
    }
  }

  async function copy(slug: string) {
    await navigator.clipboard.writeText(`${origin}/go/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 1500);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Smart Links</h1>
        <p className="mt-1 text-sm text-white/50">
          Paste a YouTube URL and where it should send people. You get a short
          link that tracks every click.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
              YouTube video URL
            </span>
            <input
              type="url"
              required
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/25 focus:border-emerald-400/60"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">
              Destination URL
            </span>
            <input
              type="url"
              required
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://your-offer.com/checkout"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/25 focus:border-emerald-400/60"
            />
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={creating}
          className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create Smart Link"}
        </button>
      </form>

      <div className="space-y-3">
        {links === undefined && (
          <p className="text-sm text-white/40">Loading links…</p>
        )}
        {links?.length === 0 && (
          <p className="text-sm text-white/40">
            No links yet — create your first one above.
          </p>
        )}
        {links?.map((link) => (
          <div
            key={link._id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {link.videoTitle ?? link.videoUrl}
              </p>
              <p className="mt-0.5 truncate text-xs text-white/40">
                → {link.destinationUrl}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs tabular-nums text-white/50">
                {link.clickCount} click{link.clickCount === 1 ? "" : "s"}
              </span>
              <code className="rounded-md bg-black/40 px-2 py-1 font-mono text-xs text-emerald-300">
                /go/{link.slug}
              </code>
              <button
                onClick={() => copy(link.slug)}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium transition-colors hover:border-emerald-400/60 hover:text-emerald-300"
              >
                {copiedSlug === link.slug ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
