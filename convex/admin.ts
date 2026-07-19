import { internalMutation } from "./_generated/server";

// Wipe all demo data. Internal-only (not callable from the client);
// run from the CLI before a demo: npx convex run admin:wipeAll
export const wipeAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    const counts = { links: 0, clicks: 0, sales: 0 };
    for (const table of ["links", "clicks", "sales"] as const) {
      const rows = await ctx.db.query(table).collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
      counts[table] = rows.length;
    }
    return counts;
  },
});
