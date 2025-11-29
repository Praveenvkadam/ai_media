import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (user !== null) {
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }

    const now = Date.now();
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      email: identity.email ?? "",
      tokenIdentifier: identity.tokenIdentifier,
      imageUrl: identity.pictureUrl,
      username:
        identity.nickname ||
        identity.given_name ||
        identity.name?.split(" ")[0],
      createdAt: now,
      lastActiveAt: now,
      Phone: undefined,
    });
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
    username: v.optional(v.string()),
    Phone: v.optional(v.bigint()),
  },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, args);
  },
});
