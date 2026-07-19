import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  links: defineTable({
    slug: v.string(),
    videoUrl: v.string(),
    videoTitle: v.union(v.string(), v.null()),
    destinationUrl: v.string(),
  }).index("by_slug", ["slug"]),

  clicks: defineTable({
    linkId: v.id("links"),
    visitorId: v.string(),
    timestamp: v.number(),
  })
    .index("by_visitor", ["visitorId"])
    .index("by_link", ["linkId"]),

  sales: defineTable({
    email: v.string(),
    amount: v.number(),
    visitorId: v.union(v.string(), v.null()),
    attributedLinkId: v.union(v.id("links"), v.null()),
    timestamp: v.number(),
  }).index("by_email", ["email"]),
});
