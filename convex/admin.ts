import { internalMutation } from "./_generated/server";

// Wipe all demo data. Internal-only (not callable from the client);
// run from the CLI before a demo: npx convex run admin:wipeAll
// Delete every account and session (auth tables only — tracking data stays).
// Run before the beta opens so test accounts don't occupy seats:
//   npx convex run admin:purgeAllUsers
export const purgeAllUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "authSessions",
      "authAccounts",
      "authRefreshTokens",
      "authVerificationCodes",
      "authVerifiers",
      "authRateLimits",
      "users",
    ] as const;
    const counts: Record<string, number> = {};
    for (const table of tables) {
      const rows = await ctx.db.query(table).collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
      counts[table] = rows.length;
    }
    return counts;
  },
});

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
