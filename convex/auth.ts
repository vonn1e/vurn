import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";

// Sign-up requires the beta invite code (INVITE_CODE env var, case-insensitive)
// and a free seat (BETA_SEATS env var, default 50). Sign-in for existing
// accounts checks neither.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        if (params.flow === "signUp") {
          const required = (process.env.INVITE_CODE ?? "").trim().toLowerCase();
          const given = String(params.inviteCode ?? "").trim().toLowerCase();
          if (!required || given !== required) {
            throw new ConvexError("invalid-invite-code");
          }
        }
        return { email: params.email as string };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) return args.existingUserId;
      const total = Number(process.env.BETA_SEATS ?? 50);
      const users = await ctx.db.query("users").take(total + 1);
      if (users.length >= total) throw new ConvexError("beta-full");
      return await ctx.db.insert("users", {
        email: typeof args.profile.email === "string" ? args.profile.email : undefined,
      });
    },
  },
});
