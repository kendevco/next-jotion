// convex/updateWorkspaces.ts
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const updateWorkspaces = mutation({
  handler: async (ctx) => {
    const workspaces = await ctx.db.query("workspaces").collect();
    for (const workspace of workspaces) {
      const updates: Partial<{ ownerId: Id<"userProfile"> }> = {};
      if (!workspace.ownerId) {
        updates.ownerId = workspace.userId as Id<"userProfile">; // Cast userId to Id<"userProfile">
      }
      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(workspace._id, updates);
      }
    }
  },
});