import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";

// Sign-up requires the beta invite code (INVITE_CODE env var on the
// deployment — change it anytime with: npx convex env set INVITE_CODE <code>).
// Sign-in for existing accounts never asks for it.
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
});
