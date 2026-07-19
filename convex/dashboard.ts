import { query } from "./_generated/server";

// One row per video: link clicks, sales, revenue, $ per click.
// Live query, so the dashboard ticks in real time as clicks and sales land.
export const videoStats = query({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.db.query("links").collect();
    const clicks = await ctx.db.query("clicks").collect();
    const sales = await ctx.db.query("sales").collect();

    const linkById = new Map(links.map((l) => [l._id, l]));

    type Row = {
      videoUrl: string;
      videoTitle: string | null;
      clicks: number;
      sales: number;
      revenue: number;
      lastClickAt: number | null;
    };
    const rows = new Map<string, Row>();
    const rowFor = (videoUrl: string) => {
      let row = rows.get(videoUrl);
      if (!row) {
        row = {
          videoUrl,
          videoTitle: null,
          clicks: 0,
          sales: 0,
          revenue: 0,
          lastClickAt: null,
        };
        rows.set(videoUrl, row);
      }
      return row;
    };

    for (const link of links) {
      const row = rowFor(link.videoUrl);
      if (link.videoTitle) row.videoTitle = link.videoTitle;
    }
    for (const click of clicks) {
      const link = linkById.get(click.linkId);
      if (!link) continue;
      const row = rowFor(link.videoUrl);
      row.clicks++;
      if (row.lastClickAt === null || click.timestamp > row.lastClickAt) {
        row.lastClickAt = click.timestamp;
      }
    }
    for (const sale of sales) {
      if (!sale.attributedLinkId) continue;
      const link = linkById.get(sale.attributedLinkId);
      if (!link) continue;
      const row = rowFor(link.videoUrl);
      row.sales++;
      row.revenue += sale.amount;
    }

    const table = [...rows.values()]
      .map((row) => ({
        ...row,
        perClick: row.clicks > 0 ? row.revenue / row.clicks : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue || b.clicks - a.clicks);

    return {
      table,
      totals: {
        clicks: clicks.length,
        sales: sales.length,
        revenue: sales.reduce((sum, s) => sum + s.amount, 0),
      },
    };
  },
});
