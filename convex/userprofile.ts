import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const upsertUserProfile = mutation({
  args: {
    clerkUserId: v.string(),
    profileData: v.object({
      avatar: v.optional(v.string()), // Change to accept string URLs
      displayName: v.optional(v.string()),
      email: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const existingProfiles = await ctx.db
      .query("userProfile")
      .filter((q) => q.eq(q.field("userId"), args.clerkUserId))
      .take(1);
    const existingProfile =
      existingProfiles.length > 0 ? existingProfiles[0] : null;
    if (existingProfile) {
      const updatedProfile = { ...existingProfile, ...args.profileData };
      return await ctx.db.replace(existingProfile._id, updatedProfile);
    } else {
      return await ctx.db.insert("userProfile", {
        userId: args.clerkUserId,
        ...args.profileData,
      });
    }
  },
});

export const getUserProfile = query({
  args: {
    clerkUserId: v.string(),
  },
  async handler({ db }, { clerkUserId }) {
    const existingProfiles = await db
      .query("userProfile")
      .filter((q) => q.eq(q.field("userId"), clerkUserId))
      .take(1);
    return existingProfiles.length > 0 ? existingProfiles[0] : null;
  },
});

export const getAllUserProfiles = query(async ({ db }) => {
  return await db.query("userProfile").collect();
});
