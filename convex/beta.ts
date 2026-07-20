import { query } from "./_generated/server";

// Public seat counter for the landing page and signup form.
// Total comes from the BETA_SEATS env var (default 50):
//   npx convex env set BETA_SEATS <n>
export const seats = query({
  args: {},
  handler: async (ctx) => {
    const total = Number(process.env.BETA_SEATS ?? 50);
    const users = await ctx.db.query("users").take(total + 1);
    return { claimed: Math.min(users.length, total), total };
  },
});
