import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Called by the /go/[slug] redirect route: log the click, return the destination.
export const logClick = mutation({
  args: { slug: v.string(), visitorId: v.string() },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("links")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!link) return null;
    await ctx.db.insert("clicks", {
      linkId: link._id,
      visitorId: args.visitorId,
      timestamp: Date.now(),
    });
    return link.destinationUrl;
  },
});

// Called by /api/sale (the endpoint that later becomes the Stripe webhook).
// Stitches email <-> visitor: if no visitorId is given, attach the sale to the
// most recent clicker so the demo loop (tap link on phone, simulate sale on
// laptop) just works. Attribution is last-click.
export const recordSale = mutation({
  args: {
    email: v.string(),
    amount: v.number(),
    visitorId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let visitorId = args.visitorId ?? null;
    if (!visitorId) {
      const latestClick = await ctx.db.query("clicks").order("desc").first();
      visitorId = latestClick?.visitorId ?? null;
    }

    let attributedLinkId = null;
    if (visitorId) {
      const lastClick = await ctx.db
        .query("clicks")
        .withIndex("by_visitor", (q) => q.eq("visitorId", visitorId))
        .order("desc")
        .first();
      attributedLinkId = lastClick?.linkId ?? null;
    }

    await ctx.db.insert("sales", {
      email: args.email.trim().toLowerCase(),
      amount: args.amount,
      visitorId,
      attributedLinkId,
      timestamp: Date.now(),
    });
  },
});
