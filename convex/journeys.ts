import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

type Step =
  | {
      kind: "click";
      videoTitle: string | null;
      videoUrl: string;
      timestamp: number;
    }
  | { kind: "sale"; amount: number; timestamp: number };

// Stitch email <-> visitor and materialize one journey per buyer:
// the ordered trail of videos they clicked out from, ending in 💰.
export const list = query({
  args: {},
  handler: async (ctx) => {
    if (!(await getAuthUserId(ctx))) throw new Error("Not authenticated");
    const sales = await ctx.db.query("sales").order("desc").collect();
    const links = await ctx.db.query("links").collect();
    const linkById = new Map(links.map((l) => [l._id, l]));

    // All visitor ids seen for each buyer email (cross-device merge).
    const visitorsByEmail = new Map<string, Set<string>>();
    for (const sale of sales) {
      if (!visitorsByEmail.has(sale.email)) {
        visitorsByEmail.set(sale.email, new Set());
      }
      if (sale.visitorId) visitorsByEmail.get(sale.email)!.add(sale.visitorId);
    }

    const journeys = [];
    for (const [email, visitorIds] of visitorsByEmail) {
      const steps: Step[] = [];
      for (const visitorId of visitorIds) {
        const clicks = await ctx.db
          .query("clicks")
          .withIndex("by_visitor", (q) => q.eq("visitorId", visitorId))
          .collect();
        for (const click of clicks) {
          const link = linkById.get(click.linkId);
          if (!link) continue;
          steps.push({
            kind: "click",
            videoTitle: link.videoTitle,
            videoUrl: link.videoUrl,
            timestamp: click.timestamp,
          });
        }
      }
      for (const sale of sales) {
        if (sale.email !== email) continue;
        steps.push({ kind: "sale", amount: sale.amount, timestamp: sale.timestamp });
      }
      steps.sort((a, b) => a.timestamp - b.timestamp);
      journeys.push({
        email,
        steps,
        totalSpent: sales
          .filter((s) => s.email === email)
          .reduce((sum, s) => sum + s.amount, 0),
        lastActivity: steps.length ? steps[steps.length - 1].timestamp : 0,
      });
    }

    journeys.sort((a, b) => b.lastActivity - a.lastActivity);
    return journeys;
  },
});
