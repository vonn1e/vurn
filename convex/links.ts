import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";

const SLUG_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

function randomSlug(length = 6) {
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += SLUG_ALPHABET[Math.floor(Math.random() * SLUG_ALPHABET.length)];
  }
  return slug;
}

export const create = mutation({
  args: {
    videoUrl: v.string(),
    destinationUrl: v.string(),
  },
  handler: async (ctx, args) => {
    let slug = randomSlug();
    while (
      await ctx.db
        .query("links")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      slug = randomSlug();
    }
    const linkId = await ctx.db.insert("links", {
      slug,
      videoUrl: args.videoUrl,
      videoTitle: null,
      destinationUrl: args.destinationUrl,
    });
    await ctx.scheduler.runAfter(0, internal.links.fetchVideoTitle, {
      linkId,
      videoUrl: args.videoUrl,
    });
    return slug;
  },
});

export const fetchVideoTitle = internalAction({
  args: { linkId: v.id("links"), videoUrl: v.string() },
  handler: async (ctx, args) => {
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(args.videoUrl)}&format=json`,
      );
      if (!res.ok) return;
      const data: { title?: string } = await res.json();
      if (data.title) {
        await ctx.runMutation(internal.links.setVideoTitle, {
          linkId: args.linkId,
          videoTitle: data.title,
        });
      }
    } catch {
      // Title stays null; UI falls back to the video URL.
    }
  },
});

export const setVideoTitle = internalMutation({
  args: { linkId: v.id("links"), videoTitle: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.linkId, { videoTitle: args.videoTitle });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.db.query("links").order("desc").collect();
    return Promise.all(
      links.map(async (link) => {
        const clicks = await ctx.db
          .query("clicks")
          .withIndex("by_link", (q) => q.eq("linkId", link._id))
          .collect();
        return { ...link, clickCount: clicks.length };
      }),
    );
  },
});
